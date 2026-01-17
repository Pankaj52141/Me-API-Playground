import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword]
    );
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

export default router;