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

  if (!transporter) {
    console.warn('SMTP is not configured. Reset email content:');
    console.warn(`To: ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn(text);
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
