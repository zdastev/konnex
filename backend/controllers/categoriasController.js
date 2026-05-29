const { pool } = require('../config/database')

const getCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY created_at ASC', [req.user.id])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateCategoria = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion } = req.body
  try {
    const result = await pool.query(
      'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deleteCategoria = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM categorias WHERE id = $1 AND usuario_id = $2', [id, req.user.id])
    res.json({ message: 'Categoría eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getProductosByCategoria = async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          p.nombre,
          p.descripcion
        FROM categoria_productos cp
        INNER JOIN productos p ON p.id = cp.producto_id
        WHERE cp.categoria_id = $1 AND p.usuario_id = $2
        ORDER BY p.created_at ASC
      `,
      [id, req.user.id]
    )

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const setProductosByCategoria = async (req, res) => {
  const { id } = req.params
  const { producto_ids } = req.body

  if (!Array.isArray(producto_ids)) {
    return res.status(400).json({ error: 'producto_ids debe ser un array' })
  }

  const cleanIds = producto_ids
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x))

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      'DELETE FROM categoria_productos WHERE categoria_id = $1',
      [id]
    )

    for (const pid of cleanIds) {
      await client.query(
        'INSERT INTO categoria_productos (categoria_id, producto_id) VALUES ($1, $2)',
        [id, pid]
      )
    }

    await client.query('COMMIT')
    res.json({ message: 'Productos asignados', categoria_id: id, producto_ids: cleanIds })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
}

module.exports = {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getProductosByCategoria,
  setProductosByCategoria
}