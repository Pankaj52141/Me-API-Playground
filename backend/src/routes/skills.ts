import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

// GET top skills
router.get("/top", async (_req: Request, res: Response) => {
  const result = await db.query(`
    SELECT s.name, COUNT(*)::int AS count
    FROM skills s
    JOIN project_skills ps ON s.id = ps.skill_id
    GROUP BY s.name
    ORDER BY count DESC
  `);

  res.json(result.rows);
});

// GET all skills
router.get("/", async (_req: Request, res: Response) => {
  const result = await db.query("SELECT * FROM skills ORDER BY name");
  res.json(result.rows);
});

// GET single skill by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM skills WHERE id = $1", [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Skill not found" });
  }
  
  res.json(result.rows[0]);
});

// POST create new skill
router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;

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
      throw error;
    }
  }
});

// PUT update skill
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

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
      throw error;
    }
  }
});

// DELETE skill
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await db.query("DELETE FROM skills WHERE id = $1 RETURNING *", [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Skill not found" });
  }
  
  res.json({ message: "Skill deleted" });
});

export default router;
