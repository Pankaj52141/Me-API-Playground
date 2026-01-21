import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const result = await db.query(
      `
      SELECT *
      FROM projects
      WHERE title ILIKE $1 OR description ILIKE $1
      `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (error: any) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: "Search failed", details: error.message });
  }
});

export default router;
