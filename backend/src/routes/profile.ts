import { Router, Request, Response } from "express";
import db from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// READ profile
router.get("/", authMiddleware, async (req: any, res: Response) => {
  const userId = req.userId;
  const result = await db.query("SELECT * FROM profile WHERE user_id = $1", [userId]);
  res.json(result.rows[0]);
});

// READ public profile (first user's profile - ID 1)
router.get("/public/default", async (_req: Request, res: Response) => {
  const result = await db.query("SELECT * FROM profile WHERE user_id = $1", [1]);
  res.json(result.rows[0] || null);
});

// CREATE profile
router.post("/", async (req: Request, res: Response) => {
  const { name, email, education } = req.body;

  await db.query(
    "INSERT INTO profile (name, email, education) VALUES ($1, $2, $3)",
    [name, email, education]
  );

  res.status(201).json({ message: "Profile created" });
});

// UPDATE profile
router.put("/", authMiddleware, async (req: any, res: Response) => {
  const { name, email, education } = req.body;
  const userId = req.userId;

  const result = await db.query(
    "UPDATE profile SET name=$1, email=$2, education=$3 WHERE user_id=$4 RETURNING *",
    [name, email, education, userId]
  );

  res.json(result.rows[0]);
});

export default router;
