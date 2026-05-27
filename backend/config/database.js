const { Pool } = require('pg')
require('dotenv').config()

const config = process.env.DATABASE_URL
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    }

const pool = new Pool(config)

pool.on('connect', (client) => {
  client.query('SET search_path TO public;');
})

pool.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message)
  } else {
    console.log('Conectado a PostgreSQL correctamente')
  }
})

module.exports = { pool }