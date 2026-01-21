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
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    // Try to fetch user's profile by user_id if column exists, otherwise get latest profile
    let profile = null;
    try {
      const profileResult = await db.query("SELECT * FROM profile WHERE user_id = $1", [user.id]);
      profile = profileResult.rows[0] || null;
    } catch (e) {
      // If user_id column doesn't exist, get the first profile (fallback)
      const profileResult = await db.query("SELECT * FROM profile LIMIT 1");
      profile = profileResult.rows[0] || null;
    }

    res.json({ token, user: { id: user.id, username: user.username }, profile });
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: error.message || "Login failed" });
  }
});

// Signup
router.post("/signup", async (req: Request, res: Response) => {
  const { username, password, name, email, education } = req.body;

  if (!username || !password || !name || !email) {
    return res.status(400).json({ error: "Username, password, name, and email are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const userResult = await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    const newUser = userResult.rows[0];

    try {
      // Try to insert profile with user_id if column exists
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
    } catch (profileError: any) {
      // If user_id column doesn't exist, insert without it
      if (profileError.message.includes('column "user_id"')) {
        const profileResult = await db.query(
          "INSERT INTO profile (name, email, education) VALUES ($1, $2, $3) RETURNING *",
          [name, email, education || null]
        );
        const newProfile = profileResult.rows[0];

        // Generate token
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

        res.status(201).json({
          token,
          user: { id: newUser.id, username: newUser.username },
          profile: newProfile,
        });
      } else {
        throw profileError;
      }
    }
  } catch (error: any) {
    console.error("Signup error:", error.message);
    res.status(400).json({ error: error.message || "Failed to create user" });
  }
});

export default router;