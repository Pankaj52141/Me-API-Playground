# API Playground Backend

A comprehensive Node.js/Express backend API for managing personal portfolio data, including profile information, projects, skills, work experience, and authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [File Structure](#file-structure)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This backend application provides a RESTful API for a personal portfolio/profile management system. It handles:

- **User Authentication** - JWT-based login/logout
- **Profile Management** - Name, email, education, and social links
- **Projects** - Create, read, update, delete projects with multiple links
- **Skills** - Manage skills and link them to projects
- **Work Experience** - Track employment history with dates and descriptions
- **Search** - Filter projects by skills
- **Rate Limiting** - Protect API from abuse with request throttling

## 🔧 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)
- **npm** or **yarn** - Comes with Node.js
- Basic knowledge of REST APIs and PostgreSQL

## 📦 Installation & Setup

### 1. Clone/Navigate to Backend Folder

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create PostgreSQL Database

Open PostgreSQL command line or use a GUI tool like pgAdmin:

```sql
CREATE DATABASE me_api_playground;
```

### 4. Initialize Database Schema

Run the schema file to create all tables:

```bash
# Using psql
psql -U postgres -d me_api_playground -f schema.sql

# Or copy-paste schema.sql contents into your PostgreSQL tool
```

### 5. Seed Initial Data (Optional)

Run the seed script to populate sample data:

```bash
node seed-db.js
```

This will add:
- Sample profile data
- 7 sample projects
- 8 sample skills
- 3 sample work experiences
- Social media links

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend folder:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=me_api_playground
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Database Connection (db.ts)

The application connects to PostgreSQL using the `pg` package. Connection settings are read from environment variables or defaults to localhost.

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm start
```

This runs `ts-node-dev` which automatically reloads on file changes.

The server will start at: **http://localhost:3000**

You should see:
```
Server running on port 3000
```

### Check Server Health

```bash
curl http://localhost:3000/health
```

Response:
```json
{ "status": "ok" }
```

## 🗄️ Database Schema

### Tables Overview

#### 1. **users** - Authentication
```sql
id: SERIAL PRIMARY KEY
username: TEXT UNIQUE NOT NULL
password_hash: TEXT NOT NULL
```

#### 2. **profile** - Personal Information
```sql
id: SERIAL PRIMARY KEY
name: TEXT NOT NULL
email: TEXT NOT NULL
education: TEXT
```

#### 3. **profile_links** - Social Media Links
```sql
id: SERIAL PRIMARY KEY
profile_id: INT (Foreign Key → profile.id)
github: TEXT
linkedin: TEXT
portfolio: TEXT
```

#### 4. **skills** - Technical Skills
```sql
id: SERIAL PRIMARY KEY
name: TEXT UNIQUE NOT NULL
```

#### 5. **projects** - Portfolio Projects
```sql
id: SERIAL PRIMARY KEY
title: TEXT NOT NULL
description: TEXT
```

#### 6. **project_links** - Links for Projects
```sql
id: SERIAL PRIMARY KEY
project_id: INT (Foreign Key → projects.id)
url: TEXT NOT NULL
```

#### 7. **project_skills** - Many-to-Many: Projects ↔ Skills
```sql
project_id: INT (Foreign Key → projects.id)
skill_id: INT (Foreign Key → skills.id)
PRIMARY KEY (project_id, skill_id)
```

#### 8. **work_experience** - Employment History
```sql
id: SERIAL PRIMARY KEY
profile_id: INT (Foreign Key → profile.id)
company: TEXT NOT NULL
role: TEXT NOT NULL
start_date: DATE
end_date: DATE
description: TEXT
```

## 📡 API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Authentication Routes

#### Login
```
POST /auth/login
Content-Type: application/json

Body: {
  "username": "string",
  "password": "string"
}

Response: {
  "token": "jwt_token_here",
  "user": { "id": 1, "username": "user" }
}
```

#### Logout
```
POST /auth/logout
Headers: Authorization: Bearer {token}
Response: { "message": "Logged out successfully" }
```

### Profile Routes

#### Get Profile
```
GET /profile
Response: {
  "id": 1,
  "name": "Pankaj Jaiswal",
  "email": "pankaj@example.com",
  "education": "B.Tech Computer Science"
}
```

#### Create Profile
```
POST /profile
Content-Type: application/json

Body: {
  "name": "string",
  "email": "string",
  "education": "string"
}
```

#### Update Profile
```
PUT /profile
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "name": "string",
  "email": "string",
  "education": "string"
}
```

### Profile Links Routes

#### Get Profile Links
```
GET /profile-links
Response: [{
  "id": 1,
  "profile_id": 1,
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "portfolio": "https://example.com"
}]
```

#### Update Profile Links
```
PUT /profile-links/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "github": "url",
  "linkedin": "url",
  "portfolio": "url"
}
```

### Projects Routes

#### Get All Projects
```
GET /projects
Response: [{
  "id": 1,
  "title": "Project Name",
  "description": "Project description"
}]
```

#### Get Single Project
```
GET /projects/:id
```

#### Create Project
```
POST /projects
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "title": "string",
  "description": "string"
}
```

#### Update Project
```
PUT /projects/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "title": "string",
  "description": "string"
}
```

#### Delete Project
```
DELETE /projects/:id
Headers: Authorization: Bearer {token}
```

### Skills Routes

#### Get All Skills
```
GET /skills
Response: [{
  "id": 1,
  "name": "React"
}]
```

#### Create Skill
```
POST /skills
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "name": "string"
}
```

#### Delete Skill
```
DELETE /skills/:id
Headers: Authorization: Bearer {token}
```

### Work Experience Routes

#### Get All Work Experiences
```
GET /work-experience
Response: [{
  "id": 1,
  "profile_id": 1,
  "company": "Company Name",
  "role": "Job Title",
  "start_date": "2020-01-15",
  "end_date": "2021-12-31",
  "description": "Job description"
}]
```

#### Get Single Work Experience
```
GET /work-experience/:id
```

#### Create Work Experience
```
POST /work-experience
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "profile_id": 1,
  "company": "string",
  "role": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "description": "string"
}
```

#### Update Work Experience
```
PUT /work-experience/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "company": "string",
  "role": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "description": "string"
}
```

#### Delete Work Experience
```
DELETE /work-experience/:id
Headers: Authorization: Bearer {token}
```

### Project Skills Routes

#### Link Skill to Project
```
POST /project-skills
Headers: Authorization: Bearer {token}
Content-Type: application/json

Body: {
  "project_id": 1,
  "skill_id": 1
}
```

#### Remove Skill from Project
```
DELETE /project-skills/:projectId/:skillId
Headers: Authorization: Bearer {token}
```

### Search Routes

#### Search Projects by Skill
```
GET /search?skill=React
Response: [{
  "id": 1,
  "title": "Project Name",
  "description": "Project description"
}]
```

## 🔐 Authentication

### How JWT Authentication Works

1. **Login**: User sends credentials → Server returns JWT token
2. **Token Usage**: Client includes `Authorization: Bearer {token}` in request headers
3. **Validation**: Server verifies token signature before allowing modifications

### Middleware

Protected routes use `authMiddleware` which:
- Extracts token from Authorization header
- Verifies token signature
- Attaches user info to request
- Rejects invalid/expired tokens

Example:
```typescript
router.put("/", authMiddleware, async (req, res) => {
  // Only authenticated users can reach here
});
```

### Token Expiration

Tokens are JWT-based. Configure expiration in `middleware/auth.ts`.

## 🛡️ Rate Limiting

Rate limiting protects the API from abuse and DDoS attacks.

### Current Limits

| Route | Limit | Window |
|-------|-------|--------|
| **Global (all routes)** | 100 requests | 15 minutes |
| **Auth (/auth)** | 5 requests | 15 minutes |
| **Data Routes (CRUD)** | 50 requests | 15 minutes |
| **Search** | 100 requests | 15 minutes |

### How It Works

- Limits are tracked **per IP address**
- Returns **429 (Too Many Requests)** when exceeded
- Response headers include: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

Example Response When Limited:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

## 📁 File Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup, middleware, rate limiting
│   ├── index.ts            # Server entry point
│   ├── db.ts               # PostgreSQL connection configuration
│   ├── middleware/
│   │   └── auth.ts         # JWT authentication middleware
│   └── routes/
│       ├── auth.ts         # Login/logout endpoints
│       ├── profile.ts      # Profile CRUD endpoints
│       ├── profile-links.ts # Social links endpoints
│       ├── projects.ts     # Projects CRUD endpoints
│       ├── skills.ts       # Skills CRUD endpoints
│       ├── work-experience.ts # Work experience CRUD
│       ├── project-skills.ts  # Project-skill linking
│       ├── project-links.ts   # Project links management
│       └── search.ts       # Search functionality
├── schema.sql              # Database schema creation
├── seed-db.js              # Sample data population
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## ✨ Features

- ✅ **RESTful API** - Standard HTTP methods for CRUD operations
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **CORS Support** - Cross-origin requests allowed
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **Data Validation** - Required field validation
- ✅ **TypeScript** - Type-safe code
- ✅ **PostgreSQL** - Robust relational database

## 🆘 Troubleshooting

### "Cannot connect to database"
```
Error: Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Ensure PostgreSQL is running
- Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in `.env`
- Create database: `CREATE DATABASE me_api_playground;`

### "Table does not exist"
```
Error: relation "profile" does not exist
```
**Solution:**
- Run schema.sql to create tables
- `psql -U postgres -d me_api_playground -f schema.sql`

### "Port 3000 already in use"
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
- Change port in `.env`
- Or kill process using port 3000
- Windows: `netstat -ano | findstr :3000`

### "JWT token invalid"
```
Error: Invalid token
```
**Solution:**
- Ensure token is passed in header: `Authorization: Bearer {token}`
- Token may be expired, login again
- Check JWT_SECRET in `.env` matches between client/server

### "Rate limit exceeded"
```
Error: Too many requests from this IP
```
**Solution:**
- Wait 15 minutes for limit to reset
- Or change IP/proxy
- Modify rate limits in `src/app.ts` if needed

## 📝 Development Tips

### Adding New Endpoint

1. **Create route file**: `src/routes/new-feature.ts`
2. **Add to app.ts**: `app.use("/new-feature", newFeatureRoutes);`
3. **Add middleware**: Use `authLimiter` for auth, `apiLimiter` for data
4. **Test with curl** or Postman

### Testing API

```bash
# Health check
curl http://localhost:3000/health

# Get profile
curl http://localhost:3000/profile

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/profile-links
```

## 🚀 Production Deployment

Before deploying:

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Enable HTTPS
4. Configure database for production
5. Set appropriate rate limits
6. Use environment variables for sensitive data
7. Enable CORS for your frontend domain only

## 📞 Support

For issues or questions:
- Check error messages carefully
- Review API documentation above
- Check PostgreSQL logs: `pg_log`
- Test with simple curl commands first

## 📄 License

ISC License - Feel free to use and modify

---

**Last Updated:** January 18, 2026
