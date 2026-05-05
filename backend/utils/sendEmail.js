const nodemailer = require("nodemailer");

// ✅ Create transporter ONCE (not inside function)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // ⏱ prevent hanging
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Optional but useful check
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter error:", err.message);
  } else {
    console.log("✅ Email server is ready");
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.response);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;
