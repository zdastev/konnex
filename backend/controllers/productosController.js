const { pool } = require('../config/database')

const normalizeText = (value = '') => (
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
)

const DEFAULT_SERVICES_BY_CATEGORY = {
  peluqueria: ['Página web', 'Agendamiento de citas'],
  'peluqueria canina': ['Página web', 'Agendamiento de citas']
}

const ensureProductExists = async (nombre) => {
  const existing = await pool.query(
    'SELECT id FROM productos WHERE LOWER(nombre) = LOWER($1) LIMIT 1',
    [nombre]
  )

  if (existing.rows.length > 0) {
    return existing.rows[0].id
  }

  const created = await pool.query(
    'INSERT INTO productos (nombre, descripcion) VALUES ($1, $2) RETURNING id',
    [nombre, 'Servicio comercial de Konnex']
  )

  return created.rows[0].id
}

const ensureCategoryProductRelation = async (categoriaId, productoId) => {
  await pool.query(
    `
      INSERT INTO categoria_productos (categoria_id, producto_id)
      SELECT $1, $2
      WHERE NOT EXISTS (
        SELECT 1
        FROM categoria_productos
        WHERE categoria_id = $1
          AND producto_id = $2
      )
    `,
    [categoriaId, productoId]
  )
}

const ensureDefaultProductsForCategory = async (categoriaId) => {
  const categoryResult = await pool.query(
    'SELECT nombre FROM categorias WHERE id = $1 LIMIT 1',
    [categoriaId]
  )

  if (categoryResult.rows.length === 0) return

  const normalizedCategoryName = normalizeText(categoryResult.rows[0].nombre)
  const defaults = DEFAULT_SERVICES_BY_CATEGORY[normalizedCategoryName]

  if (!defaults || defaults.length === 0) return

  for (const productName of defaults) {
    const productId = await ensureProductExists(productName)
    await ensureCategoryProductRelation(categoriaId, productId)
  }
}

const getProductos = async (req, res) => {
  const { categoria_id } = req.query

  try {

    // Si viene categoría -> traer productos relacionados
    if (categoria_id) {
      // Auto-asigna servicios por defecto para categorías estratégicas.
      await ensureDefaultProductsForCategory(categoria_id)

      const result = await pool.query(`
        SELECT 
          p.*
        FROM categoria_productos cp
        INNER JOIN productos p 
          ON cp.producto_id = p.id
        WHERE cp.categoria_id = $1 AND p.usuario_id = $2
        ORDER BY p.created_at ASC
      `, [categoria_id, req.user.id])

      return res.json(result.rows)
    }

    // Si no viene categoría -> traer todos
    const result = await pool.query(`
      SELECT * 
      FROM productos
      WHERE usuario_id = $1
      ORDER BY created_at ASC
    `, [req.user.id])

    res.json(result.rows)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const createProducto = async (req, res) => {
  const { nombre, descripcion } = req.body

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, descripcion, usuario_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, req.user.id]
    )

    res.status(201).json(result.rows[0])

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateProducto = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion } = req.body

  try {

    const result = await pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2 WHERE id = $3 AND usuario_id = $4 RETURNING *',
      [nombre, descripcion, id, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(result.rows[0])

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deleteProducto = async (req, res) => {
  const { id } = req.params

  try {

    await pool.query(
      'DELETE FROM productos WHERE id = $1 AND usuario_id = $2',
      [id, req.user.id]
    )

    res.json({ message: 'Producto eliminado' })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
}