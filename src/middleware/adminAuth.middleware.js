import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.adminId = decoded.id;
        req.adminRole = decoded.role;

        next();

    } catch (error) {
        res.status(401).json({
            message: "Auth failed"
        });
    }
};

export const superAdminOnly = (req, res, next) => {
    if (req.adminRole !== "SUPER_ADMIN") {
        return res.status(403).json({
            message: "Super admin access only"
        });
    }

    next();
};
