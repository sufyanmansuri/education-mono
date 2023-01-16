const nodemailer = require("nodemailer");

const sendMail = async () => {
  // const account = await nodemailer.createTestAccount();
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `"Education system" <${SMTP_USER}>`,
      to: "sufyan8834@gmail.com",
      subject: "Test",
      text: "Test message",
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(error);
  }
};

const test = (recipient, token, ref) => {
  sendMail();
  console.log(
    `To: ${recipient} \nLink: http://192.168.102.126:5173/verification?token=${token}&ref=${ref}`
  );
};

module.exports = test;
