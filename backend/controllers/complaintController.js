const Complaint = require("../models/Complaint");

// CREATE
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const complaint = await Complaint.create({
      userId: req.user.id,
      title,
      description,
      category,
      status: "Pending",
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET MY COMPLAINTS
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET SINGLE (TRACK)
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: "Not found" });

    res.json(complaint);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};
