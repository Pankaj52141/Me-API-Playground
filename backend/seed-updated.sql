-- Insert default user (ID will be 1)
INSERT INTO users (username, password_hash) 
VALUES ('default_user', 'hashed_password_placeholder')
ON CONFLICT (username) DO NOTHING;

-- Insert default profile for user_id = 1
INSERT INTO profile (user_id, name, email, education) 
VALUES (1, 'Pankaj Jaiswal', '231210083@nitdelhi.ac.in', 'Bachelor of Computer Science')
ON CONFLICT (user_id) DO NOTHING;

-- Get profile ID (should be 1 for user_id 1)
-- Insert profile links for the default user's profile
INSERT INTO profile_links (profile_id, github, linkedin, portfolio) 
VALUES (1, 'https://github.com/Pankaj52141', 'https://linkedin.com/in/pankaj-jaiswal101', 'https://pankajjaiswal.vercel.app')
ON CONFLICT DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name) VALUES 
('JavaScript')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('TypeScript')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('React')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('Node.js')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('PostgreSQL')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('Database Management System')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('Data Structures And Algorithms')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('Full Stack Web Development')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('Python')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES 
('Express.js')
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description) VALUES 
('Monexa', 'A single place to manage all your businesses')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description) VALUES 
('XYZ Project', 'This is not a project')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description) VALUES 
('AI move Recommender', 'Hybrid content and collaborative filtering based movie recommendation web app')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description) VALUES 
('Billmate', 'A bill management system')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description) VALUES 
('Dream Island', 'An island vacation planning app')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description) VALUES 
('Trading System', 'A stock trading simulation platform')
ON CONFLICT DO NOTHING;
