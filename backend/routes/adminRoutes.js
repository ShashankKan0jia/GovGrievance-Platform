const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const User = require("../models/User"); // ⭐ NEW
const sendEmail = require("../utils/sendEmail"); // ⭐ NEW

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ================= GET ALL COMPLAINTS =================
router.get("/complaints", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= UPDATE STATUS =================
router.put(
  "/complaints/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      complaint.status = status;

      // add history timeline
      complaint.history.push({
        status: status,
        message: "Status changed to " + status,
      });

      await complaint.save();

      // ⭐ GET USER
      const user = await User.findById(complaint.userId);

      // ⭐ SEND EMAIL
      await sendEmail(
        "Complaint Status Updated 🔄",
        `
  Hello ${user.name},<br/><br/>

  Your complaint status has been updated.<br/><br/>

  <strong>Complaint ID:</strong> ${complaint._id}<br/>
  <strong>Title:</strong> ${complaint.title}<br/>
  <strong>Status:</strong> 
  <span style="
    padding:4px 8px;
    border-radius:6px;
    color:white;
    background:${
      status === "Resolved"
        ? "#28a745"
        : status === "In Progress"
          ? "#ffc107"
          : "#dc3545"
    };
  ">
    ${status}
  </span>
  <br/><br/>

  Please login to check full details.<br/><br/>

  Thank you,<br/>
  <strong>GovGrievance Team</strong>
  `,
      );

      res.json({
        message: "Complaint updated",
        complaint,
      });
    } catch (error) {
      console.error("ADMIN UPDATE ERROR:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

module.exports = router;
