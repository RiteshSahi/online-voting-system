import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";

//Admin login
const adminLogin = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);
        
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

        const token = generateToken(
            { id: admin.id, role: admin.role },
            res
        );


        res.json({
            message: "Admin login successful",
            role: admin.role,
            token
        });


    } catch (error) {
        console.error("adminLogin error:", error);
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
    adminLogout
};

