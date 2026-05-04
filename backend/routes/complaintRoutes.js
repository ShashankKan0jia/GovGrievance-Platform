const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ================= CREATE COMPLAINT =================
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = new Complaint({
      userId: req.user.id,
      title,
      description,
      category,
      file: req.file ? req.file.path : null,
      status: "Pending",
      department: category + " Department",
      history: [
        {
          status: "Pending",
          message: "Complaint Registered",
        },
      ],
    });

    await complaint.save();

    // GET USER
    const user = await User.findById(req.user.id);

    // SEND EMAIL
    await sendEmail(
      user.email,
      "Complaint Registered Successfully",
      `Hello ${user.name},

Your complaint has been registered successfully.

Complaint ID: ${complaint._id}
Title: ${title}
Category: ${category}
Status: Pending

We will notify you when there are updates.

Thank you,
GovGrievance Team`,
    );

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (err) {
    console.error("CREATE COMPLAINT ERROR:", err);

    // multer error
    if (err.message === "Only image files allowed") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

// ================= GET MY COMPLAINTS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= OPTIONAL BACKUP =================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= TRACK SINGLE =================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
