import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

// GET top skills
router.get("/top", async (_req: Request, res: Response) => {
  try {
    const result = await db.query(`
      SELECT s.name, COUNT(*)::int AS count
      FROM skills s
      JOIN project_skills ps ON s.id = ps.skill_id
      GROUP BY s.name
      ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching top skills:', error.message);
    res.status(500).json({ error: "Failed to fetch top skills", details: error.message });
  }
});

// GET all skills
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM skills ORDER BY name");
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching skills:', error.message);
    res.status(500).json({ error: "Failed to fetch skills", details: error.message });
  }
});

// GET single skill by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM skills WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching skill:', error.message);
    res.status(500).json({ error: "Failed to fetch skill", details: error.message });
  }
});

// POST create new skill
router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO skills (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // unique constraint violation
      res.status(400).json({ error: "Skill already exists" });
    } else {
      console.error('Error creating skill:', error.message);
      res.status(500).json({ error: "Failed to create skill", details: error.message });
    }
  }
});

// PUT update skill
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  try {
    const result = await db.query(
      "UPDATE skills SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // unique constraint violation
      res.status(400).json({ error: "Skill name already exists" });
    } else {
      console.error('Error updating skill:', error.message);
      res.status(500).json({ error: "Failed to update skill", details: error.message });
    }
  }
});

// DELETE skill
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await db.query("DELETE FROM skills WHERE id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }
    
    res.json({ message: "Skill deleted" });
  } catch (error: any) {
    console.error('Error deleting skill:', error.message);
    res.status(500).json({ error: "Failed to delete skill", details: error.message });
  }
});

export default router;
