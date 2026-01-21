import express, { Request, Response, ErrorRequestHandler } from "express";
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

// Rate limiters - only for auth (strict) and write operations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit for auth attempts
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true, // Don't count successful attempts
});

app.use(cors());
app.use(express.json());

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
app.use("/profile", profileRoutes);
app.use("/profile-links", profileLinksRoutes);
app.use("/projects", projectRoutes);
app.use("/project-links", projectLinksRoutes);
app.use("/skills", skillRoutes);
app.use("/search", searchRoutes);
app.use("/project-skills", projectSkillsRoutes);
app.use("/work-experience", workExperienceRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ 
    error: "Endpoint not found",
    message: "The requested endpoint does not exist",
    hint: "Check the / endpoint for available endpoints"
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "An unexpected error occurred",
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
