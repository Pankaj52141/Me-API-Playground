import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const q = req.query.q as string;

  const result = await db.query(
    `
    SELECT *
    FROM projects
    WHERE title ILIKE $1 OR description ILIKE $1
    `,
    [`%${q}%`]
  );

  res.json(result.rows);
});

export default router;
