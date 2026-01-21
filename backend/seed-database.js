const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://apiplaygrounddb_y0a8_user:SMJCDscHRVNvnKOgjyJHpmqpi8lGPzpX@dpg-d5lninsoud1c738s09m0-a.oregon-postgres.render.com/apiplaygrounddb_y0a8',
  ssl: { rejectUnauthorized: false }
});

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    
    // First check the profile table structure
    const tableInfo = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name='profile'`
    );
    console.log('Profile table columns:', tableInfo.rows.map(r => r.column_name));
    
    // Insert default user
    const userResult = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password_hash = $2 RETURNING id",
      ['default_user', 'hashed_password_placeholder']
    );
    const userId = userResult.rows[0].id;
    console.log(`✓ User inserted with id: ${userId}`);

    // Insert default profile - use the actual column name based on schema
    const profileResult = await pool.query(
      "INSERT INTO profile (id, name, email, education) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, education = $4 RETURNING id",
      [1, 'Pankaj Jaiswal', '231210083@nitdelhi.ac.in', 'Bachelor of Computer Science']
    );
    const profileId = profileResult.rows[0].id;
    console.log(`✓ Profile inserted with id: ${profileId}`);

    // Insert profile links
    await pool.query(
      "INSERT INTO profile_links (profile_id, github, linkedin, portfolio) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
      [profileId, 'https://github.com/pankaj', 'https://linkedin.com/in/pankaj', 'https://pankaj.dev']
    );
    console.log('✓ Profile links inserted');

    // Insert skills
    const skills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Database Management System', 'Data Structures And Algorithms', 'Full Stack Web Development', 'Python', 'Express.js'];
    for (const skill of skills) {
      await pool.query(
        "INSERT INTO skills (name) VALUES ($1) ON CONFLICT DO NOTHING",
        [skill]
      );
    }
    console.log('✓ Skills inserted');

    // Insert projects
    const projects = [
      ['Monexa', 'A single place to manage all your businesses'],
      ['XYZ Project', 'This is not a project'],
      ['AI move Recommender', 'Hybrid content and collaborative filtering based movie recommendation web app'],
      ['Billmate', 'A bill management system'],
      ['Dream Island', 'An island vacation planning app'],
      ['Trading System', 'A stock trading simulation platform']
    ];
    for (const [title, desc] of projects) {
      await pool.query(
        "INSERT INTO projects (title, description) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [title, desc]
      );
    }
    console.log('✓ Projects inserted');

    console.log('\n✅ All seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
};

seedData();
