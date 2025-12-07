import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decodedUser = {
      id: decoded.userId,
      role: decoded.role,
      shopId: decoded.shopId,
      language: decoded?.language,
    };

    try {
      if (!decodedUser?.id) return next();
      const user = await User.findById(decodedUser.id).select("-password");

      if (!user) return res.status(401).json({ message: "User not found." });

      req.userDoc = user;

      next();
    } catch (err) {
      console.error("attachUserFromDb error:", err.message);
      return res.status(500).json({ message: "Server error." });
    }
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
