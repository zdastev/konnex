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
      `INSERT INTO contactos (nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      ['Test', '123', 'Test', false, null]
    );
    console.log("Success:", result.rows[0]);
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    pool.end();
  }
}
run();
