const Complaint = require("../models/Complaint");
const sendEmail = require("../utils/sendEmail"); // ✅ ADD THIS

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

    // ✅ SEND EMAIL HERE
    await sendEmail(
      "Complaint Registered ✅",
      `
      Hello,<br/><br/>

      Your complaint has been successfully registered.<br/><br/>

      <strong>Complaint ID:</strong> ${complaint._id}<br/>
      <strong>Title:</strong> ${complaint.title}<br/>
      <strong>Category:</strong> ${complaint.category}<br/>
      <strong>Status:</strong> Pending<br/><br/>

      Our team will review it shortly.<br/><br/>

      Thank you,<br/>
      <strong>GovGrievance Team</strong>
      `,
    );

    res.status(201).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
