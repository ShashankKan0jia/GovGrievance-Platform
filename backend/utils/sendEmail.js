const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "GovGrievance <onboarding@resend.dev>",

      // ✅ FORCE all emails to your inbox (demo mode)
      to: "kanojiashashank87@gmail.com",

      subject: subject,

      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>GovGrievance Notification</h2>
          <p>${text}</p>
        </div>
      `,
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;
