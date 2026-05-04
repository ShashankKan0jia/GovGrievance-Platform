const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    // ⭐ NEW FILE FIELD
    file: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "Pending",
    },

    department: {
      type: String,
      default: "",
    },

    history: [
      {
        status: String,
        message: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Complaint", complaintSchema);
