const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Determine if it's Gmail based on the user's email or host
    const isGmail = 
      (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail')) || 
      process.env.SMTP_USER.includes('@gmail.com');
      
    if (isGmail) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  } else {
    // Ethereal email for testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || 'FixMyHome'} <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@fixmyhome.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  if (!process.env.SMTP_USER) {
    console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } else {
    console.log("Email sent successfully to:", options.email);
  }
};

module.exports = sendEmail;
