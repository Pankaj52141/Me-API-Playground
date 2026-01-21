import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.warn('No token provided in request');
    return res.status(401).json({ error: "No token provided. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token structure" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired. Please login again." });
    }
    return res.status(401).json({ error: "Invalid or malformed token" });
  }
};