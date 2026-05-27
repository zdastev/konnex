const express = require('express')
const router = express.Router()
const { getEstadosPorProducto, getKanbanBoard, getTareasHoy } = require('../controllers/dashboardController')

router.get('/estados-por-producto', getEstadosPorProducto)
router.get('/kanban/:producto_id', getKanbanBoard)
router.get('/tareas-hoy', getTareasHoy)

module.exports = router

