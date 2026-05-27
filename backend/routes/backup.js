const express = require('express')
const router = express.Router()
const { getFullBackup } = require('../controllers/backupController')

router.get('/', getFullBackup)

module.exports = router
