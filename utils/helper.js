require("dotenv").config();
function otp(n) {
  let otp = "";
  for (let index = 0; index < n; index++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
     user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS, 
  },
});
const sentOtp = async (email, otp) => {
  try {
    const data = await transporter.sendMail({
      from: "<vaishnavii8319@gmail.com>",
      to: email,
      subject: "OTP",
      text: "otp verification",
      html: `<b>your OTP is <br/> <h1>${otp}</h1> <b>`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { otp, sentOtp };



