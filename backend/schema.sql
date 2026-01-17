-- Users Table for Authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

--Profile Table
CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  education TEXT
);
--Profile Links Table
CREATE TABLE profile_links (
  id SERIAL PRIMARY KEY,
  profile_id INT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  github TEXT,
  linkedin TEXT,
  portfolio TEXT
);
--Skills Table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
--Projects Table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT
);
-- Project Links Table(One to Many)
CREATE TABLE project_links (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL
);

-- Project ↔ Skills (M–N)
CREATE TABLE project_skills (
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- Work Experience (1–N)
CREATE TABLE work_experience (
  id SERIAL PRIMARY KEY,
  profile_id INT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  description TEXT
);
