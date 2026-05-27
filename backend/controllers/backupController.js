const { pool } = require('../config/database')

const getFullBackup = async (req, res) => {
  try {
    const contactosRes = await pool.query(`
      SELECT 
        c.id, c.nombre_negocio, c.whatsapp, c.ubicacion, c.tiene_web, 
        cat.nombre as categoria_nombre, c.created_at
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      ORDER BY c.id ASC
    `)

    const agendaRes = await pool.query(`
      SELECT 
        a.id, c.nombre_negocio, p.nombre as producto_nombre,
        a.tipo, a.fecha, a.notas, a.completado, a.created_at
      FROM seguimientos_agenda a
      LEFT JOIN contactos c ON a.contacto_id = c.id
      LEFT JOIN productos p ON a.producto_id = p.id
      ORDER BY a.fecha DESC
    `)

    const estadosRes = await pool.query(`
      SELECT 
        e.id, c.nombre_negocio, p.nombre as producto_nombre,
        e.estado, e.notas, e.updated_at
      FROM estados_contacto e
      LEFT JOIN contactos c ON e.contacto_id = c.id
      LEFT JOIN productos p ON e.producto_id = p.id
      ORDER BY e.updated_at DESC
    `)

    res.json({
      contactos: contactosRes.rows,
      agenda: agendaRes.rows,
      estados: estadosRes.rows
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getFullBackup }
