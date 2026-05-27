const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json())

/* =========================
   RUTAS
========================= */

const categoriasRoutes = require('./routes/categorias')
const contactosRoutes = require('./routes/contactos')
const productosRoutes = require('./routes/productos')
const estadosRoutes = require('./routes/estados')
const serviciosRoutes = require('./routes/servicios') 
const dashboardRoutes = require('./routes/dashboard')
const agendaRoutes = require('./routes/agenda')
const { ensureAgendaTables } = require('./config/ensureAgendaTables')

app.use('/api/categorias', categoriasRoutes)
app.use('/api/contactos', contactosRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/estados', estadosRoutes)
app.use('/api/servicios', serviciosRoutes) 
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/agenda', agendaRoutes)

const backupRoutes = require('./routes/backup')
app.use('/api/backup', backupRoutes)

// Asegura que las tablas de agenda existan (modo dev / auto-contenido).
ensureAgendaTables().catch(err => {
  console.error('Error asegurando tablas de agenda:', err.message)
})

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Konnex API funcionando' })
})

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})