import nodemailer from 'nodemailer';
import config from '../../config/index.js';

// ── Gmail SMTP transporter ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailAppPassword,
  },
});

// Verify connection on startup
transporter.verify().then(() => {
  console.log('✅  Gmail SMTP connected — ready to send emails');
}).catch((err) => {
  console.error('❌  Gmail SMTP connection failed:', err.message);
  console.error('   Make sure EMAIL_USER and EMAIL_APP_PASSWORD are set in .env');
});

// ── Build beautiful HTML email ─────────────────────────────────────
const buildOtpHtml = (otp, purpose) => {
  const title = purpose === 'signup'
    ? 'Verify Your Email'
    : 'Reset Your Password';

  const message = purpose === 'signup'
    ? 'Use the verification code below to complete your sign-up on Grade Vision.'
    : 'Use the code below to reset your Grade Vision account password.';

  const digits = otp.split('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
              🎓 Grade Vision
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:22px;font-weight:700;">${title}</h2>
            <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">${message}</p>

            <!-- OTP Code -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:0 0 32px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    ${digits.map(d => `
                      <td style="padding:0 4px;">
                        <div style="width:48px;height:56px;background:#f0f0ff;border:2px solid #e0e0ef;border-radius:12px;text-align:center;line-height:56px;font-size:28px;font-weight:700;color:#4f46e5;">
                          ${d}
                        </div>
                      </td>
                    `).join('')}
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">
              ⏱ This code expires in <strong>5 minutes</strong>.
            </p>
            <p style="margin:0;color:#9ca3af;font-size:13px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #f0f0f0;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              © ${new Date().getFullYear()} Grade Vision. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

// ── Send OTP email ─────────────────────────────────────────────────
export const sendOtpEmail = async (to, otp, purpose = 'signup') => {
  const subject = purpose === 'signup'
    ? 'Grade Vision — Verify your email'
    : 'Grade Vision — Password reset code';

  const mailOptions = {
    from: `"Grade Vision" <${config.emailUser}>`,
    to,
    subject,
    html: buildOtpHtml(otp, purpose),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧  OTP email sent to ${to}  (messageId: ${info.messageId})`);
    return { success: true };
  } catch (err) {
    console.error(`❌  Failed to send email to ${to}:`, err.message);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

export default { sendOtpEmail };
