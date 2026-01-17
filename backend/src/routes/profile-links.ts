import { Router, Request, Response } from "express";
import db from "../db";

const router = Router();

// GET profile links
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT github, linkedin, portfolio FROM profile_links LIMIT 1");
    res.json(result.rows);
  } catch (error) {
    res.json([{ github: "", linkedin: "", portfolio: "" }]);
  }
});

// POST/UPDATE profile links
router.post("/", async (req: Request, res: Response) => {
  const { github, linkedin, portfolio } = req.body;
  try {
    // Check if links exist
    const existing = await db.query("SELECT id FROM profile_links LIMIT 1");
    
    if (existing.rows.length > 0) {
      // Update
      const result = await db.query(
        "UPDATE profile_links SET github=$1, linkedin=$2, portfolio=$3 WHERE id=$4 RETURNING *",
        [github, linkedin, portfolio, existing.rows[0].id]
      );
      res.json(result.rows[0]);
    } else {
      // Insert
      const result = await db.query(
        "INSERT INTO profile_links (github, linkedin, portfolio) VALUES ($1, $2, $3) RETURNING *",
        [github, linkedin, portfolio]
      );
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save profile links" });
  }
});

export default router;
