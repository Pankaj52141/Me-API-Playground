import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

// GET skills for a specific project
router.get("/project/:projectId", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    const result = await db.query(`
      SELECT s.*
      FROM skills s
      JOIN project_skills ps ON s.id = ps.skill_id
      WHERE ps.project_id = $1
      ORDER BY s.name
    `, [projectId]);
    
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching project skills:', error.message);
    res.status(500).json({ error: "Failed to fetch project skills", details: error.message });
  }
});

// POST add skill to project
router.post("/project/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { skillId } = req.body;
  
  if (!projectId || !skillId) {
    return res.status(400).json({ error: "Project ID and Skill ID are required" });
  }

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
      console.error('Error adding skill to project:', error.message);
      res.status(500).json({ error: "Failed to add skill to project", details: error.message });
    }
  }
});

// DELETE remove skill from project
router.delete("/project/:projectId/skill/:skillId", async (req: Request, res: Response) => {
  try {
    const { projectId, skillId } = req.params;
    
    const result = await db.query(
      "DELETE FROM project_skills WHERE project_id = $1 AND skill_id = $2 RETURNING *",
      [projectId, skillId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not associated with this project" });
    }
    
    res.json({ message: "Skill removed from project" });
  } catch (error: any) {
    console.error('Error removing skill from project:', error.message);
    res.status(500).json({ error: "Failed to remove skill from project", details: error.message });
  }
});

export default router;