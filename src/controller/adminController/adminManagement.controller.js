import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";

// CHANGE ADMIN PASSWORD
export const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.adminId; 
        // comes from auth middleware (recommended)

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current and new password required"
            });
        }

        // find admin
        const admin = await prisma.admin.findUnique({
            where: { id: adminId }
        });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        // verify old password
        const validPassword = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Current password incorrect"
            });
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update password
        await prisma.admin.update({
            where: { id: adminId },
            data: { password: hashedPassword }
        });

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("changeAdminPassword error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
