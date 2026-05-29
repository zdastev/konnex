const express = require('express')
const router = express.Router()
const { getContactos, getContactoById, createContacto, updateContacto, deleteContacto, upsertContacto } = require('../controllers/contactosController')

router.get('/', getContactos)
router.get('/:id', getContactoById)
router.post('/', createContacto)
router.post('/upsert', upsertContacto)
router.put('/:id', updateContacto)
router.delete('/:id', deleteContacto)

module.exports = router