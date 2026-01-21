import { Router, Request, Response } from "express";
import db from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// READ profile
router.get("/", authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const result = await db.query("SELECT * FROM profile WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found for this user" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
});

// READ public profile (default user's profile)
router.get("/public/default", async (_req: Request, res: Response) => {
  try {
    const result = await db.query(
      "SELECT p.* FROM profile p JOIN users u ON p.user_id = u.id WHERE u.username = $1",
      ['default_user']
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Default profile not found" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error fetching public profile:", error.message);
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
});

// CREATE profile
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, education } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    await db.query(
      "INSERT INTO profile (name, email, education) VALUES ($1, $2, $3)",
      [name, email, education || null]
    );

    res.status(201).json({ message: "Profile created" });
  } catch (error: any) {
    console.error("Error creating profile:", error.message);
    res.status(500).json({ error: "Failed to create profile", details: error.message });
  }
});

// UPDATE profile
router.put("/", authMiddleware, async (req: any, res: Response) => {
  try {
    const { name, email, education } = req.body;
    const userId = req.userId;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const result = await db.query(
      "UPDATE profile SET name=$1, email=$2, education=$3 WHERE user_id=$4 RETURNING *",
      [name, email, education || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found for this user" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
});

export default router;
