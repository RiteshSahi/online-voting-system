import { prisma } from "../../config/db.js";
import { transporter } from "../../config/mailer.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// STEP 1 - Send OTP
export const sendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    email = email.trim().toLowerCase();

    if (!email.endsWith("@khwopa.edu.np")) {
      return res.status(400).json({ message: "Invalid email. Use college email only." });
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for testing

    await prisma.Otp.deleteMany({ where: { email } });
    
    const created = await prisma.Otp.create({
      data: { email, code: otpCode, expiresAt, isUsed: false },
    });
    console.log("✅ OTP saved to DB:", created); // confirm it saved

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otpCode}. It expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// STEP 2 - mark as verified
export const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    email = email.trim().toLowerCase();
    otp = otp.trim();

    const otpRecord = await prisma.Otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found. Please request a new OTP." });
    }
    if (otpRecord.isUsed) {
      return res.status(400).json({ message: "OTP already used. Please request a new OTP." });
    }
    if (new Date() > otpRecord.expiresAt) {
      await prisma.Otp.update({ where: { id: otpRecord.id }, data: { isUsed: true } });
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }
    if (otpRecord.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Mark as verified so register knows OTP was confirmed
    await prisma.Otp.update({
      where: { id: otpRecord.id },
      data: { isVerified: true },
    });

    res.json({ message: "OTP verified successfully!", otpVerified: true });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};