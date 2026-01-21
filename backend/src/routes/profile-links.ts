import { Router, Request, Response } from "express";
import db from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET profile links for logged-in user
router.get("/", authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const result = await db.query(
      `SELECT pl.* FROM profile_links pl
       JOIN profile p ON pl.profile_id = p.id
       WHERE p.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching profile links:', error.message);
    res.status(500).json({ error: "Failed to fetch profile links", details: error.message });
  }
});

// GET public profile links for default user (ID 1)
router.get("/public/default", async (_req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT pl.* FROM profile_links pl
       JOIN profile p ON pl.profile_id = p.id
       WHERE p.user_id = $1`,
      [1]
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching public profile links:', error.message);
    res.status(500).json({ error: "Failed to fetch profile links", details: error.message });
  }
});

// POST/UPDATE profile links for logged-in user
router.post("/", authMiddleware, async (req: any, res: Response) => {
  const { github, linkedin, portfolio } = req.body;
  const userId = req.userId;
  
  try {
    // Get user's profile
    const profileResult = await db.query(
      "SELECT id FROM profile WHERE user_id = $1",
      [userId]
    );
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }
    
    const profileId = profileResult.rows[0].id;
    
    // Check if links exist for this profile
    const existing = await db.query(
      "SELECT id FROM profile_links WHERE profile_id = $1",
      [profileId]
    );
    
    if (existing.rows.length > 0) {
      // Update
      const result = await db.query(
        "UPDATE profile_links SET github=$1, linkedin=$2, portfolio=$3 WHERE profile_id=$4 RETURNING *",
        [github, linkedin, portfolio, profileId]
      );
      res.json(result.rows[0]);
    } else {
      // Insert
      const result = await db.query(
        "INSERT INTO profile_links (profile_id, github, linkedin, portfolio) VALUES ($1, $2, $3, $4) RETURNING *",
        [profileId, github, linkedin, portfolio]
      );
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save profile links" });
  }
});

export default router;
