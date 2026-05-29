const { pool } = require('../config/database')

const TIPOS_VALIDOS = ['llamada', 'email', 'reunion', 'tarea']

const parseTimestamp = (value) => {
  if (!value) return null
  const d = new Date(value)
  // date inválida
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

const getUpcomingAgenda = async (req, res) => {
  const { from, to, limit } = req.query
  const lim = limit ? Number(limit) : 10

  const fromIso = parseTimestamp(from)
  const toIso = parseTimestamp(to)

  const fromParam = fromIso || new Date().toISOString()
  const toParam = toIso || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()

  try {
    const result = await pool.query(
      `
        SELECT
          a.id,
          a.contacto_id,
          c.nombre_negocio,
          a.producto_id,
          p.nombre AS producto_nombre,
          a.fecha,
          a.tipo,
          a.notas,
          a.completado,
          a.updated_at
        FROM seguimientos_agenda a
        LEFT JOIN contactos c ON a.contacto_id = c.id
        LEFT JOIN productos p ON a.producto_id = p.id
        WHERE a.completado = FALSE
          AND a.fecha >= $1
          AND a.fecha <= $2
          AND c.usuario_id = $3
        ORDER BY a.fecha ASC
        LIMIT $4
      `,
      [fromParam, toParam, req.user.id, lim]
    )

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getAgendaByContacto = async (req, res) => {
  const { contacto_id } = req.params
  try {
    const result = await pool.query(
      `
        SELECT
          a.id,
          a.contacto_id,
          c.nombre_negocio,
          a.producto_id,
          p.nombre AS producto_nombre,
          a.fecha,
          a.tipo,
          a.notas,
          a.completado,
          a.updated_at
        FROM seguimientos_agenda a
        LEFT JOIN contactos c ON a.contacto_id = c.id
        LEFT JOIN productos p ON a.producto_id = p.id
        WHERE a.contacto_id = $1 AND c.usuario_id = $2
        ORDER BY a.fecha ASC
      `,
      [contacto_id, req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const createAgenda = async (req, res) => {
  const { contacto_id, producto_id, fecha, tipo, notas } = req.body

  if (!contacto_id) {
    return res.status(400).json({ error: 'contacto_id es obligatorio' })
  }

  const fechaIso = parseTimestamp(fecha)
  if (!fechaIso) {
    return res.status(400).json({ error: 'fecha es obligatoria y debe ser válida' })
  }

  if (!tipo || !TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ error: 'tipo no válido' })
  }

  try {
    const check = await pool.query('SELECT id FROM contactos WHERE id = $1 AND usuario_id = $2', [contacto_id, req.user.id]);
    if (check.rows.length === 0) return res.status(403).json({ error: 'No autorizado' });

    const result = await pool.query(
      `
        INSERT INTO seguimientos_agenda
          (contacto_id, producto_id, fecha, tipo, notas, completado, updated_at, usuario_id)
        VALUES
          ($1, $2, $3, $4, $5, FALSE, NOW(), $6)
        RETURNING *
      `,
      [contacto_id, producto_id || null, fechaIso, tipo, notas || '', req.user.id]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateAgenda = async (req, res) => {
  const { id } = req.params
  const { fecha, tipo, notas, completado, producto_id } = req.body

  const fechaIso = fecha ? parseTimestamp(fecha) : null

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ error: 'tipo no válido' })
  }

  try {
    const result = await pool.query(
      `
        UPDATE seguimientos_agenda
        SET
          fecha = COALESCE($1, fecha),
          tipo = COALESCE($2, tipo),
          notas = COALESCE($3, notas),
          completado = COALESCE($4, completado),
          producto_id = COALESCE($5, producto_id),
          updated_at = NOW()
        WHERE id = $6 AND usuario_id = $7
        RETURNING *
      `,
      [
        fechaIso,
        tipo || null,
        typeof notas === 'string' ? notas : null,
        typeof completado === 'boolean' ? completado : null,
        producto_id || null,
        id,
        req.user.id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Seguimiento no encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deleteAgenda = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM seguimientos_agenda WHERE id = $1 AND usuario_id = $2', [id, req.user.id])
    res.json({ message: 'Seguimiento eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getUpcomingAgenda,
  getAgendaByContacto,
  createAgenda,
  updateAgenda,
  deleteAgenda
}

