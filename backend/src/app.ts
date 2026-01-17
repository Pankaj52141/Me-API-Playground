import express, { Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import profileRoutes from "./routes/profile";
import projectRoutes from "./routes/projects";
import skillRoutes from "./routes/skills";
import searchRoutes from "./routes/search";
import authRoutes from "./routes/auth";
import projectSkillsRoutes from "./routes/project-skills";
import workExperienceRoutes from "./routes/work-experience";
import profileLinksRoutes from "./routes/profile-links";
import projectLinksRoutes from "./routes/project-links";

const app = express();

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Strict limit for auth attempts
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true, // Don't count successful attempts
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Moderate limit for data modifications
  message: "Too many requests, please try again later.",
});

app.use(cors());
app.use(express.json());
app.use(globalLimiter); // Apply global limiter to all routes

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ 
    message: "API Playground Backend",
    version: "1.0.0",
    endpoints: [
      "GET /health - Health check",
      "GET /profile - Get profile",
      "POST /auth/login - Login",
      "POST /auth/logout - Logout",
      "GET /projects - Get projects",
      "GET /skills - Get skills",
      "GET /work-experience - Get work experience",
      "GET /profile-links - Get profile links",
      "GET /project-links - Get project links"
    ]
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authLimiter, authRoutes);
app.use("/profile", apiLimiter, profileRoutes);
app.use("/profile-links", apiLimiter, profileLinksRoutes);
app.use("/projects", apiLimiter, projectRoutes);
app.use("/project-links", apiLimiter, projectLinksRoutes);
app.use("/skills", apiLimiter, skillRoutes);
app.use("/search", searchRoutes); // Search can have more requests
app.use("/project-skills", apiLimiter, projectSkillsRoutes);
app.use("/work-experience", apiLimiter, workExperienceRoutes);

export default app;
