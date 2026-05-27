const { pool } = require('./database')

const ensureAgendaTables = async () => {
  // Tabla para agendar/registrar seguimientos comerciales.
  // Se crea si no existe para que el sistema sea auto-contenido en dev.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS seguimientos_agenda (
      id SERIAL PRIMARY KEY,
      contacto_id INTEGER NOT NULL REFERENCES contactos(id) ON DELETE CASCADE,
      producto_id INTEGER NULL REFERENCES productos(id) ON DELETE SET NULL,
      fecha TIMESTAMPTZ NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      notas TEXT,
      completado BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT chk_tipo_seguimiento
        CHECK (tipo IN ('llamada', 'email', 'reunion', 'tarea'))
    );

    CREATE INDEX IF NOT EXISTS idx_seguimientos_agenda_fecha
      ON seguimientos_agenda (fecha);

    CREATE INDEX IF NOT EXISTS idx_seguimientos_agenda_contacto
      ON seguimientos_agenda (contacto_id);

    CREATE INDEX IF NOT EXISTS idx_seguimientos_agenda_producto
      ON seguimientos_agenda (producto_id);
  `)

  // Nota: updated_at se actualiza desde la API (no usamos triggers por simplicidad).
}

module.exports = { ensureAgendaTables }

