import { prisma } from '../../config/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken.js';
import { verifiedEmails } from "./otp.controller.js";

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



const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (!userExists) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, userExists.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Success - return user data (exclude password)
        const { password: _, ...userWithoutPassword } = userExists;

        //Generate JWT Token
        const token = generateToken({ id: userExists.id }, res);


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

const userRegister = async (req, res) => {
    try {
        const { name, email, password, otpVerified } = req.body;

        // 🔥 Extract student data from email
        const { batch, department } = parseStudentEmail(email);
        const year = getStudyYear(batch);


        // ✅ College email restriction
        if (!email.endsWith("@khwopa.edu.np")) {
            return res.status(400).json({
                message: "Only Khwopa college emails allowed"
            });
        }

        // ✅ OTP verification check - client side
        if (!otpVerified) {
            return res.status(403).json({
                message: "OTP verification required"
            });
        }

        // ✅ OTP verification check - server side
        if (!verifiedEmails.has(email)) {
            return res.status(403).json({
                message: "Please verify OTP first"
            });
        }

        // Check if user already exists
        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userExists) {
            return res.status(409).json({
                message: "User already exists with this email"
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //CREATE NEW USER
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });


        // ✅ OTP consumed
        verifiedEmails.delete(email);

        // Generate JWT
        const token = generateToken({ id: newUser.id }, res);

        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
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