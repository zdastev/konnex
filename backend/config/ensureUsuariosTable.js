const { pool } = require('./database')

const ensureUsuariosTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    ALTER TABLE categorias ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE;
    ALTER TABLE contactos ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE;
    ALTER TABLE productos ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE;
    ALTER TABLE estados_contacto ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE;
    ALTER TABLE seguimientos_agenda ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE;

    ALTER TABLE estados_contacto DROP CONSTRAINT IF EXISTS estados_contacto_estado_check;
    ALTER TABLE estados_contacto ADD CONSTRAINT estados_contacto_estado_check
      CHECK (estado IN ('interesado', 'no_interesa', 'pensandolo', 'sin_contactar', 'contactado'));

    CREATE UNIQUE INDEX IF NOT EXISTS idx_contactos_nombre_usuario
      ON contactos (nombre_negocio, usuario_id);
  `)
}

module.exports = { ensureUsuariosTable }
