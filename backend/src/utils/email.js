import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
const EMAIL_LOGO_BASE64 = process.env.EMAIL_LOGO_BASE64;

const isConfigured = Boolean(EMAIL_USER && EMAIL_PASS && EMAIL_FROM);

const logoAttachment = EMAIL_LOGO_BASE64
  ? [
      {
        filename: 'logo.webp',
        content: EMAIL_LOGO_BASE64.split('base64,').pop(),
        encoding: 'base64',
        cid: 'logo',
      },
    ]
  : [];

const mailer = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const mailTransporter = {
  async sendMail({ from = EMAIL_FROM, to, subject, html, text }) {
    if (!isConfigured) {
      throw new Error('Email credentials are not fully configured');
    }

    if (!to) {
      throw new Error('Recipient email address is required');
    }

    return mailer.sendMail({
      from,
      to,
      subject,
      html,
      text,
      attachments: logoAttachment,
    });
  },
};

export const isEmailConfigured = isConfigured;

export const sendOtpEmail = async (email, otp) => {
  const subject = 'Your OTP Verification Code';

  const htmlBody = `
        <div>
          <p>Dear Valued Customer,</p>
          <p>Great to see you aboard! Let's quickly verify your email to get you started.</p>
          <p>One Time Password (OTP): <strong>${otp}</strong></p>
          <p>Remember, this code is valid only for the next 10 minutes.</p>
          <p>We can't wait for you to explore all the amazing features we have to offer! If you have any questions or need further assistance, please do not hesitate to contact us.</p>
          <p>Thank you and have a great day!</p>
          <p>VEDX Security Team</p>
          ${logoAttachment.length ? '<img src="cid:logo" style="width: 100%; height: auto; border-radius: 10px;"/>' : ''}
        </div>
      `;

  if (!isEmailConfigured) {
    console.warn('Email credentials are not configured. Skipping OTP email send.');
    return false;
  }

  try {
    await mailTransporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject,
      html: htmlBody,
    });

    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (err) {
    console.error('Failed to send OTP email:', err.message || err);
    return false;
  }
};
