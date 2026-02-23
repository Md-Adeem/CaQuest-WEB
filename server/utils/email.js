const nodemailer = require("nodemailer");

const createTransporter = () => {
  // Use different configs based on environment
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Development - use Ethereal (fake SMTP)
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER || "test@ethereal.email",
      pass: process.env.EMAIL_PASS || "testpass",
    },
  });
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CaQuest</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          ${content}
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} CaQuest. All rights reserved.
              </p>
              <p style="margin: 5px 0 0; color: #9ca3af; font-size: 12px;">
                Your trusted CA exam preparation platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const emailTemplates = {
  welcome: (userName) => ({
    subject: "Welcome to CaQuest! 🎓",
    html: baseTemplate(`
      <tr>
        <td style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CaQuest!</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0; font-size: 16px;">Your CA journey starts here</p>
        </td>
      </tr>
      <tr>
        <td style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #1f2937; margin: 0 0 15px;">Hi ${userName}! 👋</h2>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px;">
            Welcome aboard! We're thrilled to have you join thousands of CA aspirants
            who trust CaQuest for their exam preparation.
          </p>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 10px;">
            Here's how to get started:
          </p>
          <table style="width: 100%; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; background: #eff6ff; border-radius: 8px; margin-bottom: 8px;">
                <strong style="color: #1e40af;">Step 1:</strong>
                <span style="color: #3b82f6;"> Select your CA level (Foundation/Intermediate/Final)</span>
              </td>
            </tr>
            <tr><td style="height: 8px;"></td></tr>
            <tr>
              <td style="padding: 12px; background: #f0fdf4; border-radius: 8px;">
                <strong style="color: #166534;">Step 2:</strong>
                <span style="color: #22c55e;"> Choose a subscription plan</span>
              </td>
            </tr>
            <tr><td style="height: 8px;"></td></tr>
            <tr>
              <td style="padding: 12px; background: #fefce8; border-radius: 8px;">
                <strong style="color: #854d0e;">Step 3:</strong>
                <span style="color: #eab308;"> Start practicing chapter-wise questions!</span>
              </td>
            </tr>
          </table>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/dashboard"
               style="display: inline-block; background: #2563eb; color: white; padding: 14px 32px;
                      border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Go to Dashboard →
            </a>
          </div>
        </td>
      </tr>
    `),
  }),

  paymentSubmitted: (userName, planName, amount, transactionId) => ({
    subject: "Payment Received - Awaiting Verification 🕐",
    html: baseTemplate(`
      <tr>
        <td style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Received!</h1>
        </td>
      </tr>
      <tr>
        <td style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #1f2937; margin: 0 0 15px;">Hi ${userName}!</h2>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px;">
            We've received your payment submission. Our team will verify it within
            <strong>24 hours</strong> and activate your subscription.
          </p>
          <table style="width: 100%; background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Plan:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Transaction ID:</td>
              <td style="padding: 8px 0; color: #1f2937; font-family: monospace; text-align: right;">${transactionId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                  ⏳ Pending Verification
                </span>
              </td>
            </tr>
          </table>
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5;">
            You'll receive another email once your payment is verified and subscription is activated.
          </p>
        </td>
      </tr>
    `),
  }),

  paymentApproved: (userName, planName, levelName, expiryDate) => ({
    subject: "Subscription Activated! ✅ Start Practicing Now",
    html: baseTemplate(`
      <tr>
        <td style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Subscription Activated! ✅</h1>
        </td>
      </tr>
      <tr>
        <td style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #1f2937; margin: 0 0 15px;">Great news, ${userName}! 🎉</h2>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px;">
            Your payment has been verified and your subscription is now active!
          </p>
          <table style="width: 100%; background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #bbf7d0;">
            <tr>
              <td style="padding: 8px 0; color: #166534; font-size: 14px;">Plan:</td>
              <td style="padding: 8px 0; color: #166534; font-weight: bold; text-align: right;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #166534; font-size: 14px;">Level:</td>
              <td style="padding: 8px 0; color: #166534; font-weight: bold; text-align: right;">${levelName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #166534; font-size: 14px;">Valid Until:</td>
              <td style="padding: 8px 0; color: #166534; font-weight: bold; text-align: right;">${expiryDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #166534; font-size: 14px;">Status:</td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                  ✅ Active
                </span>
              </td>
            </tr>
          </table>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/subjects/${levelName
      .toLowerCase()
      .replace("ca ", "")}"
               style="display: inline-block; background: #22c55e; color: white; padding: 14px 32px;
                      border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Start Practicing Now 🚀
            </a>
          </div>
        </td>
      </tr>
    `),
  }),

  paymentRejected: (userName, planName, reason) => ({
    subject: "Payment Could Not Be Verified ❌",
    html: baseTemplate(`
      <tr>
        <td style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Not Verified</h1>
        </td>
      </tr>
      <tr>
        <td style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #1f2937; margin: 0 0 15px;">Hi ${userName},</h2>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px;">
            Unfortunately, we couldn't verify your payment for <strong>${planName}</strong>.
          </p>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="color: #991b1b; margin: 0; font-size: 14px;">
              <strong>Reason:</strong> ${
                reason ||
                "Payment details could not be verified. Please ensure you provided the correct transaction ID."
              }
            </p>
          </div>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px;">
            Please try submitting your payment again with the correct details, or contact our support team for help.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/subscriptions"
               style="display: inline-block; background: #2563eb; color: white; padding: 14px 32px;
                      border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Try Again
            </a>
          </div>
        </td>
      </tr>
    `),
  }),

  subscriptionExpiring: (userName, levelName, daysLeft) => ({
    subject: `Your ${levelName} subscription expires in ${daysLeft} days ⏰`,
    html: baseTemplate(`
      <tr>
        <td style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Subscription Expiring Soon!</h1>
        </td>
      </tr>
      <tr>
        <td style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #1f2937; margin: 0 0 15px;">Hi ${userName},</h2>
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px;">
            Your <strong>${levelName}</strong> subscription expires in 
            <strong style="color: #d97706;">${daysLeft} days</strong>. 
            Renew now to continue your uninterrupted preparation.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}/subscriptions"
               style="display: inline-block; background: #f59e0b; color: white; padding: 14px 32px;
                      border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Renew Subscription
            </a>
          </div>
        </td>
      </tr>
    `),
  }),
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CaQuest" <${
        process.env.EMAIL_FROM ||
        process.env.EMAIL_USER ||
        "noreply@caquest.com"
      }>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️  Email sent to ${to}: ${info.messageId}`);

    // In development, log the preview URL (Ethereal)
    if (process.env.NODE_ENV !== "production") {
      console.log(`   Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    // Don't throw - email failure shouldn't break the app
    return null;
  }
};

module.exports = { sendEmail, emailTemplates };
