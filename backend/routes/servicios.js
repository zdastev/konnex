const express = require('express')
const router = express.Router()

const { getServiciosPorCategoria } = require('../controllers/serviciosController')

router.get('/:categoria', getServiciosPorCategoria)

module.exports = router