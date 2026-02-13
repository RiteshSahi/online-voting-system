import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
//ADMIN LOGIN
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password required"
            });
        }

        const admin = await prisma.admin.findUnique({
            where: { username }
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            admin.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (admin.status !== "APPROVED") {
            return res.status(403).json({ message: "Your admin request is not approved yet." });
        }

        const token = generateToken(admin.id, res);

        res.json({
            message: "Admin login successful",
            token
        });

    } catch (error) {
        console.error("adminLogin error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                status: "PENDING"
            }
        });

        res.json({ message: "Admin request submitted. Wait for approval by main admin." });
    } catch (error) {
        console.error("registerAdmin error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get pending admin requests
const getPendingAdmins = async (req, res) => {
    try {
        const pending = await prisma.admin.findMany({
            where: { status: "PENDING" }
        });
        res.json(pending);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Approve admin
const approveAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.admin.update({
            where: { id: Number(id) },
            data: { status: "APPROVED" }
        });

        res.json({ message: "Admin approved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// // Reject admin
const rejectAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.admin.update({
            where: { id: Number(id) },
            data: { status: "REJECTED" }
        });

        res.json({ message: "Admin rejected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//ADMIN LOGOUT
const adminLogout = (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });

    res.json({
        message: "Admin logout successful"
    });
};

export {
    adminLogin,
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin,
    adminLogout
};
