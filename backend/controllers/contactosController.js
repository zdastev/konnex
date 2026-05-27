const { pool } = require('../config/database')

const getContactos = async (req, res) => {
  try {
    const { categoria_id, tiene_web, q } = req.query

    let query = `
      SELECT 
        c.id,
        c.nombre_negocio,
        c.whatsapp,
        c.ubicacion,
        c.tiene_web,
        c.categoria_id,
        cat.nombre AS categoria_nombre,
        c.created_at
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE 1=1
    `
    const params = []

    if (categoria_id) {
      params.push(categoria_id)
      query += ` AND c.categoria_id = $${params.length}`
    }

    if (tiene_web !== undefined) {
      params.push(tiene_web === 'false' ? false : true)
      query += ` AND c.tiene_web = $${params.length}`
    }

    if (q) {
      const search = `%${q}%`
      params.push(search, search, search)
      query += ` AND (
        c.nombre_negocio ILIKE $${params.length - 2}
        OR c.whatsapp ILIKE $${params.length - 1}
        OR c.ubicacion ILIKE $${params.length}
      )`
    }

    query += ' ORDER BY c.created_at DESC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getContactoById = async (req, res) => {
  const { id } = req.params
  try {
    const contacto = await pool.query(`
      SELECT 
        c.id,
        c.nombre_negocio,
        c.whatsapp,
        c.ubicacion,
        c.tiene_web,
        c.categoria_id,
        cat.nombre AS categoria_nombre,
        c.created_at
      FROM contactos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = $1
    `, [id])

    if (contacto.rows.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' })

    const estados = await pool.query(`
      SELECT 
        e.id,
        e.estado,
        e.notas,
        e.updated_at,
        p.id AS producto_id,
        p.nombre AS producto_nombre
      FROM estados_contacto e
      LEFT JOIN productos p ON e.producto_id = p.id
      WHERE e.contacto_id = $1
    `, [id])

    res.json({
      ...contacto.rows[0],
      estados: estados.rows
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const createContacto = async (req, res) => {
  const { nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id } = req.body
  if (!nombre_negocio) return res.status(400).json({ error: 'El nombre del negocio es obligatorio' })
  try {
    const result = await pool.query(
      `INSERT INTO contactos (nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre_negocio, whatsapp, ubicacion, tiene_web || false, categoria_id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateContacto = async (req, res) => {
  const { id } = req.params
  const { nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id } = req.body
  try {
    const result = await pool.query(
      `UPDATE contactos 
       SET nombre_negocio = $1, whatsapp = $2, ubicacion = $3, tiene_web = $4, categoria_id = $5
       WHERE id = $6 RETURNING *`,
      [nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deleteContacto = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM contactos WHERE id = $1', [id])
    res.json({ message: 'Contacto eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getContactos, getContactoById, createContacto, updateContacto, deleteContacto }