const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.ifbqoyxmfefflxomctqf:StevenKonnex2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
async function run() {
  try {
    await pool.query(`ALTER TABLE public.contactos ALTER COLUMN whatsapp TYPE VARCHAR(255);`);
    console.log("Altered successfully!");
  } catch(e) {
    console.error(e);
  } finally { pool.end(); }
}
run();
