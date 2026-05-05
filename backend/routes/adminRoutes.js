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

      complaint.history.push({
        status: status,
        message: "Status changed to " + status,
      });

      await complaint.save();

      const user = await User.findById(complaint.userId);

      // 🎨 STATUS COLOR
      const statusColor =
        status === "Resolved"
          ? "#28a745"
          : status === "In Progress"
            ? "#ffc107"
            : "#dc3545";

      // ✅ SEND EMAIL (CLEAN HTML)
      await sendEmail(
        "Complaint Status Updated 🔄",
        `
        <p>Hello <strong>${user.name}</strong>,</p>

        <p>Your complaint status has been updated.</p>

        <div style="margin:15px 0; padding:12px; background:#f9fafb; border-radius:8px;">
          <p style="margin:5px 0;"><strong>Complaint ID:</strong> ${complaint._id}</p>
          <p style="margin:5px 0;"><strong>Title:</strong> ${complaint.title}</p>
          <p style="margin:5px 0;">
            <strong>Status:</strong> 
            <span style="
              padding:5px 10px;
              border-radius:6px;
              color:white;
              background:${statusColor};
              font-size:13px;
            ">
              ${status}
            </span>
          </p>
        </div>

        <p>Please login to check full details.</p>

        <p>Thank you,<br/><strong>GovGrievance Team</strong></p>
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
