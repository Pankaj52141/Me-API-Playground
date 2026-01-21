import { Router, Request, Response } from "express";
import db from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET all work experiences for logged-in user
router.get("/", authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const result = await db.query(
      `SELECT we.* FROM work_experience we
       JOIN profile p ON we.profile_id = p.id
       WHERE p.user_id = $1
       ORDER BY we.start_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch work experience" });
  }
});

// GET single work experience by ID - verify ownership
router.get("/:id", authMiddleware, async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const result = await db.query(
      `SELECT we.* FROM work_experience we
       JOIN profile p ON we.profile_id = p.id
       WHERE we.id = $1 AND p.user_id = $2`,
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Work experience not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch work experience" });
  }
});

// CREATE work experience
router.post("/", authMiddleware, async (req: any, res: Response) => {
  const userId = req.userId;
  const { company, role, start_date, end_date, description } = req.body;
  try {
    // Validate required fields
    if (!company || !role || !start_date) {
      return res.status(400).json({ error: "company, role, and start_date are required" });
    }

    // Get user's profile
    const profileResult = await db.query(
      "SELECT id FROM profile WHERE user_id = $1",
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const profileId = profileResult.rows[0].id;

    const result = await db.query(
      `INSERT INTO work_experience (profile_id, company, role, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [profileId, company, role, start_date, end_date || null, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating work experience:", error);
    res.status(500).json({ error: "Failed to create work experience" });
  }
});

// UPDATE work experience
router.put("/:id", authMiddleware, async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const { company, role, start_date, end_date, description } = req.body;
  try {
    // Validate required fields
    if (!company || !role || !start_date) {
      return res.status(400).json({ error: "Company, role, and start_date are required" });
    }

    // Check ownership
    const ownershipCheck = await db.query(
      `SELECT we.id FROM work_experience we
       JOIN profile p ON we.profile_id = p.id
       WHERE we.id = $1 AND p.user_id = $2`,
      [id, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const result = await db.query(
      `UPDATE work_experience
       SET company = $1, role = $2, start_date = $3, end_date = $4, description = $5
       WHERE id = $6
       RETURNING *`,
      [company, role, start_date, end_date || null, description || null, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating work experience:", error);
    res.status(500).json({ error: "Failed to update work experience" });
  }
});

// DELETE work experience
router.delete("/:id", authMiddleware, async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Check ownership
    const ownershipCheck = await db.query(
      `SELECT we.id FROM work_experience we
       JOIN profile p ON we.profile_id = p.id
       WHERE we.id = $1 AND p.user_id = $2`,
      [id, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const result = await db.query(
      "DELETE FROM work_experience WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Work experience not found" });
    }

    res.json({ message: "Work experience deleted" });
  } catch (error) {
    console.error("Error deleting work experience:", error);
    res.status(500).json({ error: "Failed to delete work experience" });
  }
});

export default router;