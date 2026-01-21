import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

// GET all project links
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM project_links");
    res.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching project links:', error.message);
    res.status(500).json({ error: "Failed to fetch project links", details: error.message });
  }
});

// GET project link by project ID
router.get("/:projectId", async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const result = await db.query(
      "SELECT * FROM project_links WHERE project_id = $1",
      [projectId]
    );
    
    res.json(result.rows[0] || null);
  } catch (error: any) {
    console.error('Error fetching project link:', error.message);
    res.status(500).json({ error: "Failed to fetch project link", details: error.message });
  }
});

// POST create new project link
router.post("/", async (req: Request, res: Response) => {
  const { project_id, url } = req.body;

  if (!project_id || !url) {
    return res.status(400).json({ error: "project_id and url are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO project_links (project_id, url) VALUES ($1, $2) RETURNING *",
      [project_id, url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating project link:', error.message);
    res.status(500).json({ error: "Failed to create project link", details: error.message });
  }
});

// PUT update project link
router.put("/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  // Check if link exists for this project
  const existingLink = await db.query(
    "SELECT * FROM project_links WHERE project_id = $1",
    [projectId]
  );

  let result;
  if (existingLink.rows.length > 0) {
    // Update existing link
    result = await db.query(
      "UPDATE project_links SET url = $1 WHERE project_id = $2 RETURNING *",
      [url, projectId]
    );
  } else {
    // Create new link
    result = await db.query(
      "INSERT INTO project_links (project_id, url) VALUES ($1, $2) RETURNING *",
      [projectId, url]
    );
  }

  res.json(result.rows[0]);
});

// DELETE project link
router.delete("/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;
  
  const result = await db.query(
    "DELETE FROM project_links WHERE project_id = $1 RETURNING *",
    [projectId]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Project link not found" });
  }

  res.json({ message: "Project link deleted" });
});

export default router;
