const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.ifbqoyxmfefflxomctqf:StevenKonnex2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
pool.on('connect', client => {
  client.query('SET search_path TO public;');
});
async function run() {
  try {
    const result = await pool.query(
      `INSERT INTO categorias (nombre) VALUES ($1) RETURNING *`,
      ['Test Cat']
    );
    console.log("Success Cat:", result.rows[0]);
  } catch(e) {
    console.error("Error Cat:", e.message);
  } finally {
    pool.end();
  }
}
run();
