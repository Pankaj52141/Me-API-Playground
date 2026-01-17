import { Router, Request, Response } from "express";
import db from "../db";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// READ profile
router.get("/", async (_req: Request, res: Response) => {
  const result = await db.query("SELECT * FROM profile LIMIT 1");
  res.json(result.rows[0]);
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
router.put("/", authMiddleware, async (req: Request, res: Response) => {
  const { name, email, education } = req.body;

  await db.query(
    "UPDATE profile SET name=$1, email=$2, education=$3",
    [name, email, education]
  );

  res.json({ message: "Profile updated" });
});

export default router;
