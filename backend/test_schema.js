const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.ifbqoyxmfefflxomctqf:StevenKonnex2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
async function run() {
  try {
    const res = await pool.query(`SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'contactos'`);
    console.table(res.rows);
  } catch(e) {
    console.error(e);
  } finally { pool.end(); }
}
run();
