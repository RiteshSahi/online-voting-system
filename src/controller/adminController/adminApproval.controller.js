import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";
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

export {
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin
};