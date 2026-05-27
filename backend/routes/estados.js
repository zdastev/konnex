const express = require('express')
const router = express.Router()
const { getEstadosByContacto, upsertEstado, deleteEstado } = require('../controllers/estadosController')

router.get('/:contacto_id', getEstadosByContacto)
router.post('/', upsertEstado)
router.delete('/:id', deleteEstado)

module.exports = router