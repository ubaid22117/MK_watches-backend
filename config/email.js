const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── 1. EMAIL VERIFICATION (tumhara purana — same rakha) ─────────
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
                <tr>
                  <td style="background:linear-gradient(135deg,#1a1500,#0B0B0B);padding:40px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.2);">
                    <h1 style="font-family:Georgia,serif;color:#D4AF37;font-size:28px;letter-spacing:8px;margin:0;">MK</h1>
                    <p style="color:#666;font-size:11px;letter-spacing:6px;margin:6px 0 0;text-transform:uppercase;">WATCHES</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <h2 style="color:#ffffff;font-size:22px;margin:0 0 12px;font-family:Georgia,serif;">Welcome, ${name}!</h2>
                    <p style="color:#888;font-size:15px;line-height:1.7;margin:0 0 30px;">
                      Thank you for creating an account with <strong style="color:#D4AF37;">MK_Watches</strong>. 
                      Please verify your email address to activate your account and start exploring our luxury collection.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:10px 0 30px;">
                          <a href="${verifyURL}" style="background:linear-gradient(135deg,#D4AF37,#A0820A);color:#000000;text-decoration:none;padding:16px 40px;border-radius:6px;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;display:inline-block;">
                            Verify My Email
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color:#555;font-size:13px;margin:0 0 8px;">Or copy and paste this link:</p>
                    <p style="background:#0B0B0B;border:1px solid rgba(212,175,55,0.2);border-radius:6px;padding:12px;color:#888;font-size:12px;word-break:break-all;margin:0 0 30px;">${verifyURL}</p>
                    <div style="border-top:1px solid rgba(212,175,55,0.15);padding-top:24px;">
                      <p style="color:#555;font-size:13px;margin:0;">
                        This link expires in <strong style="color:#D4AF37;">24 hours</strong>. 
                        If you did not create this account, please ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#0d0d0d;padding:24px;text-align:center;border-top:1px solid rgba(212,175,55,0.1);">
                    <p style="color:#444;font-size:12px;margin:0;">© 2024 MK_Watches. All rights reserved.</p>
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

// ─── 2. PASSWORD RESET (tumhara purana — same rakha) ─────────────
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
                    <p style="color:#555;font-size:13px;">
                      This link expires in <strong style="color:#D4AF37;">1 hour</strong>. 
                      If you did not request this, ignore this email.
                    </p>
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

// ─── 3. ORDER CONFIRMATION → CUSTOMER (naya) ─────────────────────
const sendOrderConfirmation = async (email, name, order) => {
  const itemsHtml = order.orderItems?.map(item => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #1a1a1a;color:#ccc;font-size:14px;">${item.name}</td>
      <td style="padding:12px;border-bottom:1px solid #1a1a1a;color:#ccc;text-align:center;font-size:14px;">${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #1a1a1a;color:#D4AF37;text-align:right;font-size:14px;font-weight:600;">
        Rs. ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('') || '';

  const orderId = order._id?.toString().slice(-8).toUpperCase();

  // Payment method message
  const paymentMsg = order.paymentMethod === 'Cash on Delivery'
    ? 'Payment will be collected at delivery.'
    : `Payment via <strong style="color:#D4AF37;">${order.paymentMethod}</strong> — our team will verify and confirm shortly.`;

  await transporter.sendMail({
    from: `"MK_Watches" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmed #${orderId} — MK_Watches`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0B0B0B;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0B;padding:40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(212,175,55,0.3);border-radius:16px;overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1a1500,#0B0B0B);padding:32px 40px;border-bottom:1px solid rgba(212,175,55,0.2);">
                  <table width="100%"><tr>
                    <td>
                      <h1 style="font-family:Georgia,serif;color:#D4AF37;font-size:26px;letter-spacing:8px;margin:0;">MK</h1>
                      <p style="color:#666;font-size:10px;letter-spacing:6px;margin:4px 0 0;text-transform:uppercase;">WATCHES</p>
                    </td>
                    <td align="right">
                      <p style="color:#2ecc71;font-size:13px;font-weight:600;margin:0;">✓ Order Confirmed</p>
                    </td>
                  </tr></table>
                </td>
              </tr>

              <!-- Body -->
              <tr><td style="padding:36px 40px;">
                <h2 style="color:#fff;font-size:20px;font-family:Georgia,serif;margin:0 0 8px;">
                  Shukriya, ${name}! ⌚
                </h2>
                <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 28px;">
                  Aap ka order receive ho gaya hai. Hamari team jald delivery confirm karegi.
                </p>

                <!-- Order ID box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background:#0B0B0B;border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px 20px;">
                      <p style="color:#555;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Order ID</p>
                      <p style="color:#D4AF37;font-family:monospace;font-size:20px;font-weight:700;margin:0;">#${orderId}</p>
                    </td>
                  </tr>
                </table>

                <!-- Items table -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:20px;">
                  <thead>
                    <tr style="background:#0d0d0d;">
                      <th style="padding:12px;color:#555;font-size:11px;letter-spacing:1px;text-align:left;text-transform:uppercase;">Item</th>
                      <th style="padding:12px;color:#555;font-size:11px;letter-spacing:1px;text-align:center;text-transform:uppercase;">Qty</th>
                      <th style="padding:12px;color:#555;font-size:11px;letter-spacing:1px;text-align:right;text-transform:uppercase;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>

                <!-- Totals -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="padding:6px 0;color:#666;font-size:13px;">Shipping</td>
                    <td style="padding:6px 0;color:#888;font-size:13px;text-align:right;">
                      Rs. ${(order.shippingPrice || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 0;color:#fff;font-size:16px;font-weight:700;border-top:1px solid #1a1a1a;">Total</td>
                    <td style="padding:10px 0 0;color:#D4AF37;font-size:18px;font-weight:700;text-align:right;border-top:1px solid #1a1a1a;">
                      Rs. ${(order.totalPrice || 0).toLocaleString()}
                    </td>
                  </tr>
                </table>

                <!-- Payment status -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background:#0B0B0B;border:1px solid rgba(212,175,55,0.15);border-radius:8px;padding:14px 18px;">
                      <p style="color:#D4AF37;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px;">Payment</p>
                      <p style="color:#aaa;font-size:13px;margin:0;">${paymentMsg}</p>
                    </td>
                  </tr>
                </table>

                <!-- Shipping address -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:#0B0B0B;border:1px solid rgba(212,175,55,0.15);border-radius:8px;padding:14px 18px;">
                      <p style="color:#D4AF37;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Deliver To</p>
                      <p style="color:#aaa;font-size:13px;line-height:1.7;margin:0;">
                        ${order.customerInfo?.name || ''}<br>
                        ${order.customerInfo?.address || ''}<br>
                        ${order.customerInfo?.city || ''}<br>
                        ${order.customerInfo?.phone || ''}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="color:#555;font-size:13px;margin:24px 0 0;">
                  Sawaal? WhatsApp karein: 
                  <a href="https://wa.me/923142371705" style="color:#D4AF37;text-decoration:none;">+92 314 2371705</a>
                </p>
              </td></tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0d0d0d;padding:20px 40px;text-align:center;border-top:1px solid rgba(212,175,55,0.1);">
                  <p style="color:#444;font-size:12px;margin:0;">© 2024 MK_Watches. All rights reserved. Pakistan</p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
};

// ─── 4. NEW ORDER ALERT → ADMIN (naya) ───────────────────────────
const sendAdminOrderAlert = async (order, customerName) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return; // agar .env mein ADMIN_EMAIL nahi to skip

  const orderId = order._id?.toString().slice(-8).toUpperCase();

  const itemsHtml = order.orderItems?.map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #1a1a1a;color:#ccc;font-size:13px;">${item.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #1a1a1a;color:#aaa;text-align:center;font-size:13px;">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #1a1a1a;color:#D4AF37;text-align:right;font-size:13px;">
        Rs. ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('') || '';

  // Payment badge color
  const paymentColor = order.paymentMethod === 'Cash on Delivery' ? '#e67e22' : '#e74c3c';

  await transporter.sendMail({
    from: `"MK_Watches Orders" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🛒 New Order #${orderId} — Rs. ${(order.totalPrice || 0).toLocaleString()} — ${order.paymentMethod}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0B0B0B;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0B;padding:30px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(212,175,55,0.25);border-radius:16px;overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="background:#1a1a1a;padding:20px 28px;border-bottom:2px solid #D4AF37;">
                  <table width="100%"><tr>
                    <td>
                      <p style="color:#D4AF37;font-size:18px;font-weight:700;margin:0;">🛒 New Order!</p>
                      <p style="color:#555;font-size:12px;margin:4px 0 0;">
                        ${new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </td>
                    <td align="right">
                      <p style="color:#D4AF37;font-family:monospace;font-size:22px;font-weight:700;margin:0;">#${orderId}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>

              <!-- Stats Row -->
              <tr>
                <td style="padding:20px 28px;border-bottom:1px solid #1a1a1a;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="33%" style="padding-right:8px;">
                        <div style="background:#0B0B0B;border:1px solid #222;border-radius:8px;padding:14px;">
                          <p style="color:#555;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Customer</p>
                          <p style="color:#fff;font-size:14px;font-weight:600;margin:0;">${customerName}</p>
                          <p style="color:#555;font-size:12px;margin:2px 0 0;">${order.customerInfo?.phone || 'N/A'}</p>
                        </div>
                      </td>
                      <td width="33%" style="padding:0 4px;">
                        <div style="background:#0B0B0B;border:1px solid #222;border-radius:8px;padding:14px;">
                          <p style="color:#555;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Total</p>
                          <p style="color:#2ecc71;font-size:18px;font-weight:700;margin:0;">Rs. ${(order.totalPrice || 0).toLocaleString()}</p>
                        </div>
                      </td>
                      <td width="33%" style="padding-left:8px;">
                        <div style="background:#0B0B0B;border:1px solid #222;border-radius:8px;padding:14px;">
                          <p style="color:#555;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Payment</p>
                          <p style="color:${paymentColor};font-size:13px;font-weight:600;margin:0;">${order.paymentMethod}</p>
                          <p style="color:#555;font-size:11px;margin:2px 0 0;">${order.paymentStatus || 'Pending'}</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items -->
              <tr>
                <td style="padding:20px 28px;border-bottom:1px solid #1a1a1a;">
                  <p style="color:#D4AF37;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Order Items</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1a1a1a;border-radius:8px;overflow:hidden;">
                    <thead>
                      <tr style="background:#0d0d0d;">
                        <th style="padding:10px 12px;color:#555;font-size:10px;text-align:left;text-transform:uppercase;">Item</th>
                        <th style="padding:10px 12px;color:#555;font-size:10px;text-align:center;text-transform:uppercase;">Qty</th>
                        <th style="padding:10px 12px;color:#555;font-size:10px;text-align:right;text-transform:uppercase;">Price</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                  </table>
                </td>
              </tr>

              <!-- Shipping Address -->
              <tr>
                <td style="padding:20px 28px;border-bottom:1px solid #1a1a1a;">
                  <p style="color:#D4AF37;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Ship To</p>
                  <p style="color:#aaa;font-size:13px;line-height:1.8;margin:0;">
                    ${order.customerInfo?.address || 'N/A'}<br>
                    ${order.customerInfo?.city || ''}<br>
                    ${order.customerInfo?.phone || ''}
                  </p>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:24px 28px;text-align:center;">
                  <a href="${process.env.CLIENT_URL}/admin/orders"
                    style="background:linear-gradient(135deg,#D4AF37,#A0820A);color:#000;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;display:inline-block;">
                    View in Admin Panel →
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0d0d0d;padding:16px 28px;text-align:center;border-top:1px solid #1a1a1a;">
                  <p style="color:#444;font-size:11px;margin:0;">MK_Watches Admin Notification — Do not reply to this email</p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
};

// ─── 5. ORDER STATUS UPDATE → CUSTOMER (naya) ────────────────────
const sendOrderStatusUpdate = async (email, name, order, newStatus) => {
  const orderId = order._id?.toString().slice(-8).toUpperCase();

  const statusConfig = {
    Pending: {
      color: '#e67e22', emoji: '📋',
      msg: 'Aap ka order receive ho gaya hai aur process hone wala hai.',
    },
    Processing: {
      color: '#3498db', emoji: '⚙️',
      msg: 'Aap ka order process ho raha hai. Jald ship hoga.',
    },
    Shipped: {
      color: '#9b59b6', emoji: '🚚',
      msg: 'Mubarak! Aap ka order ship ho gaya hai aur raaste mein hai.',
    },
    Delivered: {
      color: '#2ecc71', emoji: '✅',
      msg: 'Aap ka order deliver ho gaya! Apni luxury watch enjoy karein. ⌚',
    },
    Cancelled: {
      color: '#e74c3c', emoji: '❌',
      msg: 'Aap ka order cancel ho gaya hai. Kisi sawal ke liye WhatsApp karein.',
    },
  };

  const cfg = statusConfig[newStatus] || { color: '#D4AF37', emoji: '📦', msg: 'Order status update.' };

  await transporter.sendMail({
    from: `"MK_Watches" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order ${newStatus} #${orderId} — MK_Watches`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0B0B0B;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B0B;padding:40px 20px;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(212,175,55,0.3);border-radius:16px;overflow:hidden;">
              <tr>
                <td style="background:linear-gradient(135deg,#1a1500,#0B0B0B);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.2);">
                  <h1 style="font-family:Georgia,serif;color:#D4AF37;font-size:26px;letter-spacing:8px;margin:0;">MK</h1>
                  <p style="color:#666;font-size:10px;letter-spacing:6px;margin:4px 0 0;text-transform:uppercase;">WATCHES</p>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 40px;text-align:center;">
                  <p style="font-size:48px;margin:0 0 12px;">${cfg.emoji}</p>
                  <h2 style="color:#fff;font-size:22px;font-family:Georgia,serif;margin:0 0 6px;">
                    Order ${newStatus}
                  </h2>
                  <p style="color:#888;font-size:14px;margin:0 0 28px;">Hi ${name}, yeh aap ke order ka update hai.</p>

                  <!-- Status badge -->
                  <div style="display:inline-block;background:${cfg.color}18;border:1px solid ${cfg.color}44;border-radius:8px;padding:14px 28px;margin-bottom:24px;">
                    <p style="color:${cfg.color};font-size:18px;font-weight:700;margin:0;">${newStatus}</p>
                  </div>

                  <p style="color:#aaa;font-size:14px;line-height:1.7;margin:0 0 24px;">${cfg.msg}</p>

                  <p style="color:#555;font-size:13px;margin:0 0 4px;">Order ID</p>
                  <p style="color:#D4AF37;font-family:monospace;font-size:18px;font-weight:700;margin:0 0 28px;">#${orderId}</p>

                  <p style="color:#555;font-size:13px;margin:0;">
                    Sawaal? 
                    <a href="https://wa.me/923142371705" style="color:#D4AF37;text-decoration:none;">WhatsApp karein</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#0d0d0d;padding:20px 40px;text-align:center;border-top:1px solid rgba(212,175,55,0.1);">
                  <p style="color:#444;font-size:12px;margin:0;">© 2024 MK_Watches. All rights reserved. Pakistan</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
};

module.exports = {
  sendVerificationEmail,    // purana
  sendPasswordResetEmail,   // purana
  sendOrderConfirmation,    // naya
  sendAdminOrderAlert,      // naya
  sendOrderStatusUpdate,    // naya
};