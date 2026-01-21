import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

// GET all projects or filter by skill
router.get("/", async (req: Request, res: Response) => {
  try {
    const skill = req.query.skill as string;

    let query: string;
    let params: any[];

    if (skill) {
      // Filter by skill
      query = `
        SELECT DISTINCT p.*, pl.url as project_url
        FROM projects p
        LEFT JOIN project_links pl ON p.id = pl.project_id
        JOIN project_skills ps ON p.id = ps.project_id
        JOIN skills s ON s.id = ps.skill_id
        WHERE s.name ILIKE $1
      `;
      params = [`%${skill}%`];
    } else {
      // Return all projects
      query = `
        SELECT p.*, pl.url as project_url
        FROM projects p
        LEFT JOIN project_links pl ON p.id = pl.project_id
      `;
      params = [];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: "Failed to fetch projects", details: error.message });
  }
});

// GET single project by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT p.*, pl.url as project_url
       FROM projects p
       LEFT JOIN project_links pl ON p.id = pl.project_id
       WHERE p.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({ error: "Failed to fetch project", details: error.message });
  }
});

// POST create new project
router.post("/", async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Project title is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO projects (title, description) VALUES ($1, $2) RETURNING *",
      [title, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating project:', error.message);
    res.status(500).json({ error: "Failed to create project", details: error.message });
  }
});

// PUT update project
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Project title is required" });
  }

  try {
    const result = await db.query(
      "UPDATE projects SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating project:', error.message);
    res.status(500).json({ error: "Failed to update project", details: error.message });
  }
});

// DELETE project
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await db.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json({ message: "Project deleted" });
  } catch (error: any) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({ error: "Failed to delete project", details: error.message });
  }
});

export default router;
