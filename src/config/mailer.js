import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

transporter.verify((err, success) => {
  if (err) console.error("❌ Transporter login failed:", err);
  else console.log("✅ Transporter ready!");
});
