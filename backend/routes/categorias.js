const express = require('express')
const router = express.Router()
const {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getProductosByCategoria,
  setProductosByCategoria
} = require('../controllers/categoriasController')

router.get('/', getCategorias)
router.post('/', createCategoria)
router.put('/:id', updateCategoria)
router.delete('/:id', deleteCategoria)
router.get('/:id/productos', getProductosByCategoria)
router.put('/:id/productos', setProductosByCategoria)

module.exports = router