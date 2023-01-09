// const nodemailer = require('nodemailer');

// const sendMail = async () => {
//   const account = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//       user: account.user,
//       pass: account.pass,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: `"Education system" <${account.user}>`,
//     to: 'sufyan8834@gmail.com',
//     subject: 'Test',
//     text: 'Test message',
//   });

//   console.log('Message sent: %s', info.messageId);

//   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// };

const test = (recipient, token) => {
  console.log(
    `To: ${recipient} \nLink: http://192.168.102.126:5173/verification?token=${token}`
  );
};

module.exports = test;
