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
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f9; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:#1a4f8c; color:white; padding:20px;">
        <h2 style="margin:0;">GovGrievance Portal</h2>
        <p style="margin:5px 0 0; font-size:14px;">Government Complaint System</p>
      </div>

      <!-- Body -->
      <div style="padding:25px; color:#333;">
        
        <p style="font-size:16px; margin-bottom:15px;">
          ${text}
        </p>

        <div style="margin-top:20px; padding:15px; background:#f9fafb; border-left:4px solid #1a4f8c; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#555;">
            This is an automated message. Please do not reply.
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:13px; color:#777;">
        © 2026 GovGrievance Platform • All rights reserved
      </div>

    </div>

  </div>
`,
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;
