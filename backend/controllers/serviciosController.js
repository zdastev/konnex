const serviciosPorCategoria = require('../config/serviciosPorCategoria')

const getServiciosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params

    const servicios = serviciosPorCategoria[categoria]

    if (!servicios) {
      return res.status(404).json({
        error: 'Categoría no encontrada'
      })
    }

    res.json(servicios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getServiciosPorCategoria }