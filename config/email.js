const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, name, token) => {
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"MK_Watches" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email — MK_Watches',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
      </head>
      <body style="margin:0;padding:0;background:#0B0B0B;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0B;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(212,175,55,0.3);border-radius:16px;overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#1a1500,#0B0B0B);padding:40px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.2);">
                    <h1 style="font-family:Georgia,serif;color:#D4AF37;font-size:28px;letter-spacing:8px;margin:0;">MK</h1>
                    <p style="color:#666;font-size:11px;letter-spacing:6px;margin:6px 0 0;text-transform:uppercase;">WATCHES</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="color:#ffffff;font-size:22px;margin:0 0 12px;font-family:Georgia,serif;">
                      Welcome, ${name}!
                    </h2>
                    <p style="color:#888;font-size:15px;line-height:1.7;margin:0 0 30px;">
                      Thank you for creating an account with <strong style="color:#D4AF37;">MK_Watches</strong>. 
                      Please verify your email address to activate your account and start exploring our luxury collection.
                    </p>

                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:10px 0 30px;">
                          <a href="${verifyURL}" 
                             style="background:linear-gradient(135deg,#D4AF37,#A0820A);color:#000000;text-decoration:none;padding:16px 40px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;display:inline-block;">
                            Verify My Email
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color:#555;font-size:13px;margin:0 0 8px;">
                      Or copy and paste this link:
                    </p>
                    <p style="background:#0B0B0B;border:1px solid rgba(212,175,55,0.2);border-radius:6px;padding:12px;color:#888;font-size:12px;word-break:break-all;margin:0 0 30px;">
                      ${verifyURL}
                    </p>

                    <div style="border-top:1px solid rgba(212,175,55,0.15);padding-top:24px;">
                      <p style="color:#555;font-size:13px;margin:0;">
                        This link expires in <strong style="color:#D4AF37;">24 hours</strong>. 
                        If you did not create this account, please ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#0d0d0d;padding:24px;text-align:center;border-top:1px solid rgba(212,175,55,0.1);">
                    <p style="color:#444;font-size:12px;margin:0;">
                      © 2024 MK_Watches. All rights reserved.
                    </p>
                    <p style="color:#333;font-size:11px;margin:6px 0 0;">Pakistan</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, name, token) => {
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"MK_Watches" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request — MK_Watches',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0B0B0B;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0B;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(212,175,55,0.3);border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(135deg,#1a1500,#0B0B0B);padding:40px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.2);">
                    <h1 style="font-family:Georgia,serif;color:#D4AF37;font-size:28px;letter-spacing:8px;margin:0;">MK</h1>
                    <p style="color:#666;font-size:11px;letter-spacing:6px;margin:6px 0 0;">WATCHES</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <h2 style="color:#fff;font-size:22px;margin:0 0 12px;font-family:Georgia,serif;">Password Reset</h2>
                    <p style="color:#888;font-size:15px;line-height:1.7;margin:0 0 30px;">
                      Hi ${name}, we received a request to reset your password. Click below to create a new password.
                    </p>
                    <table width="100%"><tr>
                      <td align="center" style="padding:10px 0 30px;">
                        <a href="${resetURL}" style="background:linear-gradient(135deg,#D4AF37,#A0820A);color:#000;text-decoration:none;padding:16px 40px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;display:inline-block;">
                          Reset Password
                        </a>
                      </td>
                    </tr></table>
                    <p style="color:#555;font-size:13px;">This link expires in <strong style="color:#D4AF37;">1 hour</strong>. If you did not request this, ignore this email.</p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#0d0d0d;padding:24px;text-align:center;border-top:1px solid rgba(212,175,55,0.1);">
                    <p style="color:#444;font-size:12px;margin:0;">© 2024 MK_Watches. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };