const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.ifbqoyxmfefflxomctqf:StevenKonnex2026@aws-1-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
pool.connect((err) => {
  if (err) console.error('Error 6543:', err.message);
  else console.log('Connected 6543!');
  process.exit();
});
