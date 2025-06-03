import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ succ: false, msg: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ succ: false, msg: "Invalid token" });
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res
      .status(403)
      .json({ succ: false, msg: "Access denied: Admin only" });
  next();
};
