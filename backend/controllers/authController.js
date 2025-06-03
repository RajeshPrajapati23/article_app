import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);

const saltRounds = 10;

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(name, email, password, role);

  if (!email || !password || !name)
    return res
      .status(400)
      .json({ succ: false, msg: "Missing required fields" });

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("hash", hash);

    const result = await pool.query(
      "INSERT INTO tbl_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hash, role || "user"]
    );
    console.log("result", result);

    return res.status(201).json({ succ: true, user: result.rows[0] });
  } catch (err) {
    console.log("Error executing query:", err);
    console.error("Error executing query:", err.message);
    return res
      .status(500)
      .json({ succ: false, msg: "User already exists or DB error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ succ: false, msg: "Missing credentials" });

  try {
    const result = await pool.query(
      "SELECT * FROM tbl_users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ succ: false, msg: "User not found" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ succ: false, msg: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      succ: true,
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    console.log(err);

    res.status(500).json({ succ: false, msg: "Server error" });
  }
};
