const { Pool } = require('pg');
const fs = require('fs');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedData = async () => {
  try {
    // ===== COMMENTED OUT SECTIONS =====
    // All other seeding is commented out
    // Uncomment the sections below if you need to seed other tables

    /*
    // Insert sample user
    const hashedPassword = await bcrypt.hash('password', 10);
    await pool.query(`
      INSERT INTO users (username, password_hash)
      VALUES ('admin', $1)
      ON CONFLICT (username) DO NOTHING
    `, [hashedPassword]);

    // Insert sample profile
    await pool.query(`
      INSERT INTO profile (name, email, education)
      VALUES ('Pankaj Jaiswal', '231210083@nitdelhi.ac.in', 'Bachelor of Computer Science')
      ON CONFLICT DO NOTHING
    `);

    // Insert sample skills
    const skills = ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'machine learning', 'Python'];
    for (const skill of skills) {
      await pool.query(`
        INSERT INTO skills (name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
      `, [skill]);
    }

    // Insert sample projects with URLs
    const projects = [
      { title: 'E-commerce Website', description: 'Full-stack e-commerce platform', url: 'https://github.com/pankajjaiswal/ecommerce' },
      { title: 'Task Management App', description: 'React-based task manager', url: 'https://github.com/pankajjaiswal/task-manager' },
      { title: 'API Playground', description: 'Interactive API testing tool', url: 'https://github.com/pankajjaiswal/api-playground' },
      { title: 'Dream Island', description: 'Application to complete your dreams', url: 'https://github.com/pankajjaiswal/dream-island' },
      { title: 'Business Dealing', description: 'Business dealings App', url: 'https://github.com/pankajjaiswal/business-dealing' },
      { title: 'Attendance System App', description: 'Mark your attendance online', url: 'https://github.com/pankajjaiswal/attendance-system' }
    ];

    for (const project of projects) {
      // Check if project exists
      const existingProject = await pool.query(`
        SELECT id FROM projects WHERE title = $1
      `, [project.title]);

      let projectId;
      if (existingProject.rows.length > 0) {
        projectId = existingProject.rows[0].id;
      } else {
        const projectResult = await pool.query(`
          INSERT INTO projects (title, description)
          VALUES ($1, $2)
          RETURNING id
        `, [project.title, project.description]);
        projectId = projectResult.rows[0].id;
      }

      // Check if project link exists, if not insert
      const existingLink = await pool.query(`
        SELECT id FROM project_links WHERE project_id = $1
      `, [projectId]);

      if (existingLink.rows.length === 0) {
        await pool.query(`
          INSERT INTO project_links (project_id, url)
          VALUES ($1, $2)
        `, [projectId, project.url]);
      }
    }

    // Link projects to skills (many-to-many)
    await pool.query(`
      INSERT INTO project_skills (project_id, skill_id)
      SELECT p.id, s.id
      FROM projects p, skills s
      WHERE p.title = 'E-commerce Website' AND s.name IN ('JavaScript', 'React', 'Node.js')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO project_skills (project_id, skill_id)
      SELECT p.id, s.id
      FROM projects p, skills s
      WHERE p.title = 'Task Management App' AND s.name IN ('JavaScript', 'React', 'TypeScript')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO project_skills (project_id, skill_id)
      SELECT p.id, s.id
      FROM projects p, skills s
      WHERE p.title = 'API Playground' AND s.name IN ('Node.js', 'PostgreSQL', 'TypeScript')
      ON CONFLICT DO NOTHING
    `);

    // Insert sample work experience
    const profile = await pool.query('SELECT id FROM profile LIMIT 1');
    const profileId = profile.rows[0]?.id;
    
    if (profileId) {
      const workExperiences = [
        { 
          profile_id: profileId,
          company: 'Tech Solutions Inc', 
          role: 'Senior Developer', 
          start_date: '2020-01-15',
          end_date: null,
          description: 'Led frontend development team, architected React applications, mentored junior developers'
        },
        { 
          profile_id: profileId,
          company: 'StartUp XYZ', 
          role: 'Full Stack Developer', 
          start_date: '2018-06-01',
          end_date: '2019-12-31',
          description: 'Developed full-stack web applications using Node.js and React'
        },
        { 
          profile_id: profileId,
          company: 'Web Agency', 
          role: 'Junior Developer', 
          start_date: '2017-01-10',
          end_date: '2018-05-30',
          description: 'Built responsive websites using HTML, CSS, and JavaScript'
        }
      ];

      for (const exp of workExperiences) {
        await pool.query(`
          INSERT INTO work_experience (profile_id, company, role, start_date, end_date, description)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [exp.profile_id, exp.company, exp.role, exp.start_date, exp.end_date, exp.description]);
      }
    }
    */

    // ===== ONLY THIS SECTION RUNS: UPDATE PROFILE LINKS =====
    const profileId = 1; // Set this to your actual profile ID if different

    if (profileId) {
      // Update profile links with your new URLs
      await pool.query(`
        UPDATE profile_links
        SET github = $1, linkedin = $2, portfolio = $3
        WHERE profile_id = $4
      `, ['https://github.com/Pankaj52141', 'https://linkedin.com/in/pankaj-jaiswal101', 'https://pankajjaiswal.vercel.app', profileId]);

      console.log('Profile links updated successfully!');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    pool.end();
  }
};

seedData();