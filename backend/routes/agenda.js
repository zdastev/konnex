const express = require('express')
const router = express.Router()
const {
  getUpcomingAgenda,
  getAgendaByContacto,
  createAgenda,
  updateAgenda,
  deleteAgenda
} = require('../controllers/agendaController')

router.get('/upcoming', getUpcomingAgenda)
router.get('/contacto/:contacto_id', getAgendaByContacto)
router.post('/', createAgenda)
router.put('/:id', updateAgenda)
router.delete('/:id', deleteAgenda)

module.exports = router

