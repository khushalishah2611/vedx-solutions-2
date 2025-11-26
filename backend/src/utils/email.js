import tls from 'node:tls';

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 465);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

const sanitizeEhloDomain = (domain) => {
  if (!domain) return null;

  try {
    if (domain.includes('://')) {
      const parsed = new URL(domain);
      return parsed.hostname || null;
    }

    // Strip any port that might be present (e.g., "example.com:5000").
    return domain.split(':')[0];
  } catch (error) {
    console.warn('Invalid EMAIL_EHLO_DOMAIN provided, falling back to default domain.', error);
    return null;
  }
};

const EHLO_DOMAIN =
  sanitizeEhloDomain(process.env.EMAIL_EHLO_DOMAIN) ||
  (EMAIL_FROM ? sanitizeEhloDomain(EMAIL_FROM.split('@')[1]) : null) ||
  sanitizeEhloDomain(EMAIL_HOST) ||
  'localhost';

const waitForResponse = (socket) =>
  new Promise((resolve, reject) => {
    const cleanup = () => {
      socket.off('data', onData);
      socket.off('error', onError);
      socket.off('timeout', onTimeout);
    };

    const onData = (chunk) => {
      cleanup();
      resolve(chunk.toString());
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onTimeout = () => {
      cleanup();
      reject(new Error('SMTP connection timed out'));
    };

    socket.once('data', onData);
    socket.once('error', onError);
    socket.once('timeout', onTimeout);
  });

const sendCommand = async (socket, command, expectedCode) => {
  socket.write(`${command}\r\n`);
  const response = await waitForResponse(socket);

  if (!response.startsWith(String(expectedCode))) {
    throw new Error(`Unexpected SMTP response for ${command}: ${response.trim()}`);
  }

  return response;
};

const buildEmailHeaders = ({ from, to, subject }) =>
  [
    `Subject: ${subject}`,
    `From: ${from}`,
    `To: ${to}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
  ].join('\r\n');

const sendMail = async ({ from = EMAIL_FROM, to, subject, html, text }) => {
  if (!EMAIL_USER || !EMAIL_PASS || !from) {
    throw new Error('Email credentials are not fully configured');
  }

  if (!to) {
    throw new Error('Recipient email address is required');
  }

  const socket = tls.connect({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    rejectUnauthorized: true,
  });

  socket.setTimeout(10000);

  try {
    await waitForResponse(socket); // 220 greeting
    await sendCommand(socket, `EHLO ${EHLO_DOMAIN}`, 250);
    await sendCommand(socket, 'AUTH LOGIN', 334);
    await sendCommand(socket, Buffer.from(EMAIL_USER).toString('base64'), 334);
    await sendCommand(socket, Buffer.from(EMAIL_PASS).toString('base64'), 235);
    await sendCommand(socket, `MAIL FROM:<${from}>`, 250);
    await sendCommand(socket, `RCPT TO:<${to}>`, 250);
    await sendCommand(socket, 'DATA', 354);

    socket.write(`${buildEmailHeaders({ from, to, subject })}${html || text || ''}\r\n.\r\n`);
    const dataResponse = await waitForResponse(socket);

    if (!dataResponse.startsWith('250')) {
      throw new Error(`SMTP data was rejected: ${dataResponse.trim()}`);
    }

    await sendCommand(socket, 'QUIT', 221);
  } finally {
    socket.end();
  }
};

export const mailTransporter = { sendMail };
export const isEmailConfigured = Boolean(EMAIL_USER && EMAIL_PASS && EMAIL_FROM);

export const sendOtpEmail = async (email, otp) => {
  const subject = 'VEDX Admin Password Reset Code';

  const htmlBody = `
    <p>Hello,</p>
    <p>We received a request to reset your VEDX admin password.</p>
    <p><strong>Your OTP code is: ${otp}</strong></p>
    <p>This code expires in <strong>10 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br/>
    <p>Thanks,<br/>VEDX Security Team</p>
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
    console.error('Failed to send OTP email:', err);
    return false;
  }
};
