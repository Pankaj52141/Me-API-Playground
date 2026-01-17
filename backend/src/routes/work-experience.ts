import { Router, Request, Response } from "express";
import db from "../db";

const router = Router();

// GET all work experiences
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await db.query(
      "SELECT * FROM work_experience ORDER BY start_date DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch work experience" });
  }
});

// GET single work experience by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM work_experience WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Work experience not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch work experience" });
  }
});

// POST create new work experience
router.post("/", async (req: Request, res: Response) => {
  const { profile_id, company, role, start_date, end_date, description } = req.body;
  try {
    // Validate required fields
    if (!profile_id || !company || !role || !start_date) {
      return res.status(400).json({ error: "profile_id, company, role, and start_date are required" });
    }
    
    const result = await db.query(
      "INSERT INTO work_experience (profile_id, company, role, start_date, end_date, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [profile_id, company, role, start_date, end_date || null, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating work experience:", error);
    res.status(500).json({ error: "Failed to create work experience", details: error instanceof Error ? error.message : String(error) });
  }
});

// PUT update work experience
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { company, role, start_date, end_date, description } = req.body;
  try {
    // Validate required fields
    if (!company || !role || !start_date) {
      return res.status(400).json({ error: "Company, role, and start_date are required" });
    }
    
    const result = await db.query(
      "UPDATE work_experience SET company = $1, role = $2, start_date = $3, end_date = $4, description = $5 WHERE id = $6 RETURNING *",
      [company, role, start_date, end_date || null, description || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Work experience not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating work experience:", error);
    res.status(500).json({ error: "Failed to update work experience", details: error instanceof Error ? error.message : String(error) });
  }
});

// DELETE work experience
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM work_experience WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Work experience not found" });
    }
    res.json({ message: "Work experience deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete work experience" });
  }
});

export default router;