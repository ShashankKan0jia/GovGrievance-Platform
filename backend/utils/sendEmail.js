const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "GovGrievance <onboarding@resend.dev>",
      to: [to],
      subject,
      html: `<p>${text}</p>`,
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;
