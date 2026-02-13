import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
