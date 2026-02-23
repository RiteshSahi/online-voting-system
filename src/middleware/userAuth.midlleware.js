import jwt from "jsonwebtoken";

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
    };
    console.log("Authenticated user:", req.user);

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Auth failed" });
  }
};
