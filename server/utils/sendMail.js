/* eslint-disable no-console */
const nodemailer = require("nodemailer");
const htmlTemplate = require("./htmlTemplate");

const sendMail = async (user, token, ref) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const mode = ref === "reset" ? `&ref=${ref}` : "";
  const link = `http://192.168.102.126:5173/auth/verification?token=${token}${mode}`;

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
      from: `Education Platform <${SMTP_USER}>`,
      to: [user.email, "sufyan8834@gmail.com"],
      subject:
        ref === "reset"
          ? "Reset Password | Education Platform"
          : "Verification | Education Platform",
      html: htmlTemplate(ref, user.firstName, link),
      attachDataUrls: true,
    });
    console.log("Message sent: ", info.messageId);
    console.log(link);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendMail;
