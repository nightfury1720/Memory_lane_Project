const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transport;
  if (process.env.NODE_ENV === "production") {
    transport = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  } else {
    transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  const mailOptions = {
    from: "Chamber of Secrets <surajguava@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<p style="font-size:30px">${options.message}</p>`,
  };

  await transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
