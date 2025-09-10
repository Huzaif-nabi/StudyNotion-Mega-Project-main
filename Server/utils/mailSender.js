const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // Important for port 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    let info = await transporter.sendMail({
      from: 'StudyNotion <no-reply@studynotion.com>', // A more standard "from" format
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;

  } catch (error) {
    // Log the full error object for more details
    console.log("Error in mailSender", error);
  }
};

module.exports = mailSender;