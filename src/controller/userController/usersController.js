import { prisma } from '../../config/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken.js';

// 🔥 Parse student info from email
const parseStudentEmail = (email) => {
  const id = email.split("@")[0];

  return {
    batch: id.substring(3, 6),
    department: id.substring(6, 9)
  };
};

// 🔥 Calculate current study year
const getStudyYear = (batch) => {
  const currentYear = 82; // change later dynamically
  return currentYear - parseInt(batch) + 1;
};

// ------------------ LOGIN ------------------
const userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Ensure user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify OTP first." });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken({ id: user.id }, res);

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('userLogin error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ REGISTER ------------------
const userRegister = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.trim().toLowerCase();

    // College email restriction
    if (!email.endsWith("@khwopa.edu.np")) {
      return res.status(400).json({ message: "Only Khwopa college emails allowed" });
    }

    // Extract student data
    const { batch, department } = parseStudentEmail(email);
    const year = getStudyYear(batch);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    // // Check latest OTP
    const OTPRecord = await prisma.OTP.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" }
    });

    // if (!OTPRecord) return res.status(403).json({ message: "OTP not found" });
    // if (OTPRecord.isUsed) return res.status(403).json({ message: "OTP already used" });
    // if (new Date() > OTPRecord.expiresAt) {
    //   await prisma.OTP.update({ where: { id: OTPRecord.id }, data: { isUsed: true } });
    //   return res.status(403).json({ message: "OTP expired" });
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, batch, department, year, isVerified: true }
    });

    // Only mark OTP as used after successful user creation
    await prisma.OTP.update({
      where: { id: OTPRecord.id },
      data: { isUsed: true }
    });

    const token = generateToken({ id: newUser.id }, res);
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token
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
    secure: process.env.NODE_ENV === "production"
  });

  res.status(200).json({
    status: "success",
    message: "Logout successful"
  });
};

export { userLogin, userRegister, userLogout };
