import nodemailer from 'nodemailer';

/**
 * Send email utility
 * Supports SMTP transport with graceful fallback to console logging for development
 */
export const sendEmail = async (options) => {
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (hasSmtpConfig) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Atelier E-Commerce Platform'} <${process.env.FROM_EMAIL || 'no-reply@atelier-platform.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email dispatched to ${options.email}: ${info.messageId}`);
    return info;
  } else {
    // Development fallback logger
    console.log('====================================================');
    console.log(`[EMAIL DISPATCH - DEV SIMULATION]`);
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    if (options.link) {
      console.log(`Action Link: ${options.link}`);
    }
    console.log('====================================================');
    return { simulated: true };
  }
};

export default sendEmail;
