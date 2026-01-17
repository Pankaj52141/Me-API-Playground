import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

// GET skills for a specific project
router.get("/project/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;
  
  const result = await db.query(`
    SELECT s.*
    FROM skills s
    JOIN project_skills ps ON s.id = ps.skill_id
    WHERE ps.project_id = $1
    ORDER BY s.name
  `, [projectId]);
  
  res.json(result.rows);
});

// POST add skill to project
router.post("/project/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { skillId } = req.body;
  
  try {
    await db.query(
      "INSERT INTO project_skills (project_id, skill_id) VALUES ($1, $2)",
      [projectId, skillId]
    );
    res.status(201).json({ message: "Skill added to project" });
  } catch (error: any) {
    if (error.code === '23505') { // unique constraint violation
      res.status(400).json({ error: "Skill already associated with this project" });
    } else {
      throw error;
    }
  }
});

// DELETE remove skill from project
router.delete("/project/:projectId/skill/:skillId", async (req: Request, res: Response) => {
  const { projectId, skillId } = req.params;
  
  const result = await db.query(
    "DELETE FROM project_skills WHERE project_id = $1 AND skill_id = $2 RETURNING *",
    [projectId, skillId]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Skill not associated with this project" });
  }
  
  res.json({ message: "Skill removed from project" });
});

export default router;