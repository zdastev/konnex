const { pool } = require('../config/database')

const getEstadosByContacto = async (req, res) => {
  const { contacto_id } = req.params
  try {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.estado,
        e.notas,
        e.updated_at,
        p.id AS producto_id,
        p.nombre AS producto_nombre
      FROM estados_contacto e
      LEFT JOIN productos p ON e.producto_id = p.id
      JOIN contactos c ON e.contacto_id = c.id
      WHERE e.contacto_id = $1 AND c.usuario_id = $2
      ORDER BY p.nombre ASC
    `, [contacto_id, req.user.id])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const upsertEstado = async (req, res) => {
  const { contacto_id, producto_id, estado, notas } = req.body

  if (!contacto_id || !producto_id) {
    return res.status(400).json({ error: 'contacto_id y producto_id son obligatorios' })
  }

  const estadosValidos = ['interesado', 'no_interesa', 'pensandolo', 'sin_contactar', 'contactado']
  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' })
  }

  try {
    // Check ownership
    const check = await pool.query('SELECT id FROM contactos WHERE id = $1 AND usuario_id = $2', [contacto_id, req.user.id]);
    if (check.rows.length === 0) return res.status(403).json({ error: 'No autorizado' });

    const result = await pool.query(`
      INSERT INTO estados_contacto (contacto_id, producto_id, estado, notas, updated_at, usuario_id)
      VALUES ($1, $2, $3, $4, NOW(), $5)
      ON CONFLICT (contacto_id, producto_id)
      DO UPDATE SET 
        estado = EXCLUDED.estado,
        notas = EXCLUDED.notas,
        updated_at = NOW()
      RETURNING *
    `, [contacto_id, producto_id, estado || 'sin_contactar', notas, req.user.id])

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deleteEstado = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM estados_contacto WHERE id = $1 AND usuario_id = $2', [id, req.user.id])
    res.json({ message: 'Estado eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getEstadosByContacto, upsertEstado, deleteEstado }