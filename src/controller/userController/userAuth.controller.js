import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";

// CHANGE USER PASSWORD
export const changeUserPassword = async (req, res) => {
  try {
    const userId = req.userId; // comes from userAuth middleware

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password required"
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("changeUserPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
