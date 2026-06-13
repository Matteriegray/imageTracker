const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
};

const sendResetPasswordEmail = async ({ to, resetUrl }) => {
  const transporter = createTransporter();
  const subject = 'SceneMap Password Reset Request';
  const text = `A password reset request was made for your SceneMap account.\n\nUse the following link to reset your password:\n${resetUrl}\n\nIf you did not request this, ignore this email.`;
  const html = `<p>A password reset request was made for your SceneMap account.</p><p><a href="${resetUrl}" target="_blank">Reset your password</a></p><p>If you did not request this, ignore this email.</p>`;
  // If dev ethereal mode is enabled, prefer it for free test email capture
  if (process.env.DEV_USE_ETHEREAL === 'true') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      const ethTransport = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
        
      });

      const info = await ethTransport.sendMail({
        from: process.env.SMTP_FROM || `SceneMap <${testAccount.user}>`,
        to,
        subject,
        text,
        html
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Ethereal preview URL (dev):', previewUrl);
      return { previewUrl };
    } catch (err) {
      console.error('Ethereal send error:', err);
      // fall through to other behaviors
    }
  }

  if (!transporter) {
    // Do not print full reset links/tokens by default to avoid leaking them in logs.
    // Enable verbose dev logging by setting DEV_MAIL_DEBUG=true in .env.
    if (process.env.DEV_MAIL_DEBUG === 'true') {
      console.warn('SMTP is not configured. Reset email content (DEV_MAIL_DEBUG=true):');
      console.warn(`To: ${to}`);
      console.warn(`Subject: ${subject}`);
      console.warn(text);
    } else {
      console.warn('SMTP is not configured. Reset token stored; email not sent. Set DEV_MAIL_DEBUG=true to log reset content for development.');
    }
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `SceneMap <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html
  });
};

module.exports = { sendResetPasswordEmail };
