import { prisma } from "../../config/db.js";
import { transporter } from "../../config/mailer.js";
import bcrypt from "bcrypt";

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    email = email.trim().toLowerCase();

    // Only allow college emails
    if (!email.endsWith("@khwopa.edu.np")) {
      return res.status(400).json({ message: "Invalid email. Use college email only." });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 5 minutes

    // Always create a new OTP record
    await prisma.Otp.create({
      data: { email, code: otpCode, expiresAt, isUsed: false },
    });

    console.log("OTP:", otpCode);

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otpCode}. It expires in 2 minutes.`,
    });

    res.json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    email = email.trim().toLowerCase();
    otp = otp.trim();

    // Get the latest OTP record for this email
    const record = await prisma.Otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.isUsed) {
      return res.status(400).json({ message: "OTP already used" });
    }

    if (new Date() > record.expiresAt) {
      // Mark as used even if expired
      await prisma.Otp.update({
        where: { id: record.id },
        data: { isUsed: true },
      });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid → mark as used
    await prisma.Otp.update({
      where: { id: record.id },
      data: { isUsed: true },
    });

    // Mark user as verified if they exist
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });
    }

    res.json({
      message: "OTP verified successfully!",
      otpVerified: true,
      user: user || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
