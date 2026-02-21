import { prisma } from '../../config/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken.js';

const parseStudentEmail = (email) => {
  const localPart = email.split("@")[0];
  const batch = localPart.substring(0, 3);
  const department = localPart.substring(3, 6).toUpperCase();
  return { batch, department };
};

const getStudyYear = (batch) => {
  const currentYear = 82;
  return currentYear - parseInt(batch) + 1;
};

// ------------------ LOGIN ------------------
const userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    email = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify OTP first." });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken({ id: user.id, email: user.email, batch: user.batch, department: user.department }, res);

    return res.status(200).json({ message: "Login successful", user: userWithoutPassword, token });

  } catch (error) {
    console.error('userLogin error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ REGISTER ------------------
const userRegister = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();

    if (!email.endsWith("@khwopa.edu.np")) {
      return res.status(400).json({ message: "Only Khwopa college emails allowed" });
    }

    const { batch, department } = parseStudentEmail(email);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "User already exists" });
const otpRecord = await prisma.Otp.findFirst({
  where: { email },
  orderBy: { createdAt: "desc" },
});

console.log("✅ OTP record in register:", otpRecord);

// ✅ Must exist, be verified, and not yet used
if (!otpRecord || !otpRecord.isVerified || otpRecord.isUsed) {
  return res.status(400).json({ message: "Email not verified. Please verify OTP first." });
}

if (new Date() > otpRecord.expiresAt) {
  await prisma.Otp.update({ where: { id: otpRecord.id }, data: { isUsed: true } });
  return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
}
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, batch, department, isVerified: true },
    });

    await prisma.Otp.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    const token = generateToken({ id: newUser.id, email: newUser.email, batch: newUser.batch, department: newUser.department }, res);
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ LOGOUT ------------------
const userLogout = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ status: "success", message: "Logout successful" });
};

export { userLogin, userRegister, userLogout };