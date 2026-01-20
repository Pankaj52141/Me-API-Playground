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
  
  // Fetch user's profile
  const profileResult = await db.query("SELECT * FROM profile WHERE user_id = $1", [user.id]);
  const profile = profileResult.rows[0] || null;

  res.json({ token, user: { id: user.id, username: user.username }, profile });
});

// Signup
router.post("/signup", async (req: Request, res: Response) => {
  const { username, password, name, email, education } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const userResult = await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    const newUser = userResult.rows[0];

    // Insert profile linked to user
    const profileResult = await db.query(
      "INSERT INTO profile (user_id, name, email, education) VALUES ($1, $2, $3, $4) RETURNING *",
      [newUser.id, name, email, education || null]
    );
    const newProfile = profileResult.rows[0];

    // Generate token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

    res.status(201).json({
      token,
      user: { id: newUser.id, username: newUser.username },
      profile: newProfile,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

export default router;