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
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// READ public profile (first user's profile - ID 1)
router.get("/public/default", async (_req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM profile WHERE user_id = $1", [1]);
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// CREATE profile
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, education } = req.body;

    await db.query(
      "INSERT INTO profile (name, email, education) VALUES ($1, $2, $3)",
      [name, email, education]
    );

    res.status(201).json({ message: "Profile created" });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

// UPDATE profile
router.put("/", authMiddleware, async (req: any, res: Response) => {
  try {
    const { name, email, education } = req.body;
    const userId = req.userId;

    const result = await db.query(
      "UPDATE profile SET name=$1, email=$2, education=$3 WHERE user_id=$4 RETURNING *",
      [name, email, education, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
