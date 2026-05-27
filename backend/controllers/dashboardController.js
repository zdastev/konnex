const { pool } = require('../config/database')

const getEstadosPorProducto = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id AS producto_id,
        p.nombre AS producto_nombre,
        COALESCE(SUM(CASE WHEN e.estado = 'sin_contactar' THEN 1 ELSE 0 END), 0) AS sin_contactar,
        COALESCE(SUM(CASE WHEN e.estado = 'interesado' THEN 1 ELSE 0 END), 0) AS interesado,
        COALESCE(SUM(CASE WHEN e.estado = 'pensandolo' THEN 1 ELSE 0 END), 0) AS pensandolo,
        COALESCE(SUM(CASE WHEN e.estado = 'no_interesa' THEN 1 ELSE 0 END), 0) AS no_interesa
      FROM productos p
      LEFT JOIN estados_contacto e
        ON e.producto_id = p.id
      GROUP BY p.id, p.nombre
      ORDER BY p.created_at ASC
    `)

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getKanbanBoard = async (req, res) => {
  const { producto_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        c.id as contacto_id, c.nombre_negocio, c.whatsapp, c.tiene_web,
        cat.nombre as categoria_nombre,
        e.id as estado_id, COALESCE(e.estado, 'sin_contactar') as estado, e.notas
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      LEFT JOIN estados_contacto e ON c.id = e.contacto_id AND e.producto_id = $1
      ORDER BY c.created_at DESC
    `, [producto_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getTareasHoy = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id, a.fecha, a.tipo, a.notas, a.completado,
        c.id as contacto_id, c.nombre_negocio, c.whatsapp,
        p.nombre as producto_nombre
      FROM seguimientos_agenda a
      JOIN contactos c ON a.contacto_id = c.id
      LEFT JOIN productos p ON a.producto_id = p.id
      WHERE a.completado = false AND DATE(a.fecha) <= CURRENT_DATE
      ORDER BY a.fecha ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getEstadosPorProducto, getKanbanBoard, getTareasHoy }

