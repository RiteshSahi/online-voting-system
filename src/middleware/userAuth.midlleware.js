import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js"; // optional, if you want to fetch full user

export const protectUser = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user object (can include id, email, batch, department)
    req.user = {
      id: decoded.id,
      email: decoded.email,
      batch: decoded.batch,
      department: decoded.department,
      year: decoded.year
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Auth failed" });
  }
};
