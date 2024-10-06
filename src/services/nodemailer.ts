import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

export const generateOTP = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export const sendOTP = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: email,
      subject: "OTP for Password Reset",
      text: `Your OTP for Password Reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Error sending OTP email: ${error.message}`);
  }
};
