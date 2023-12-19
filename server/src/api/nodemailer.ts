import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendEmail(
  destination: string,
  subject: string,
  content: string
) {
  try {
    const data = await transporter.sendMail({
      from: "Misetec <soluciones.misetec@gmail.com>",
      to: destination,
      subject: subject,
      html: content,
    });

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export default transporter;
