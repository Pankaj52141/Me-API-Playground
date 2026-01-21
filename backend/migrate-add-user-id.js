const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://apiplaygrounddb_y0a8_user:SMJCDscHRVNvnKOgjyJHpmqpi8lGPzpX@dpg-d5lninsoud1c738s09m0-a.oregon-postgres.render.com/apiplaygrounddb_y0a8',
  ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
  try {
    console.log('Starting migration...');
    
    // Check if user_id column already exists
    const columnCheck = await pool.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name='profile' AND column_name='user_id'`
    );
    
    if (columnCheck.rows.length > 0) {
      console.log('✓ user_id column already exists');
      process.exit(0);
    }
    
    console.log('Adding user_id column to profile table...');
    
    // Add the user_id column as nullable first
    await pool.query(`
      ALTER TABLE profile 
      ADD COLUMN user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE
    `);
    
    console.log('✓ user_id column added successfully');
    
    // Now update existing profiles to match with users
    // This assumes first profile goes to first user, etc.
    const profiles = await pool.query('SELECT id FROM profile ORDER BY id');
    const users = await pool.query('SELECT id FROM users ORDER BY id');
    
    for (let i = 0; i < Math.min(profiles.rows.length, users.rows.length); i++) {
      await pool.query(
        'UPDATE profile SET user_id = $1 WHERE id = $2',
        [users.rows[i].id, profiles.rows[i].id]
      );
    }
    
    console.log('✓ Profiles linked to users');
    
    // Verify the migration
    const verify = await pool.query(`
      SELECT p.id, p.name, p.user_id, u.username 
      FROM profile p 
      LEFT JOIN users u ON p.user_id = u.id
    `);
    
    console.log('\n✅ Migration completed successfully!');
    console.log('Profile-User mappings:');
    verify.rows.forEach(row => {
      console.log(`  Profile ${row.id} (${row.name}) -> User ${row.user_id} (${row.username || 'NULL'})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
};

migrate();
