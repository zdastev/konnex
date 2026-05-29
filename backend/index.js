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

const authRoutes = require('./routes/auth')
const categoriasRoutes = require('./routes/categorias')
const contactosRoutes = require('./routes/contactos')
const productosRoutes = require('./routes/productos')
const estadosRoutes = require('./routes/estados')
const serviciosRoutes = require('./routes/servicios')
const dashboardRoutes = require('./routes/dashboard')
const agendaRoutes = require('./routes/agenda')
const backupRoutes = require('./routes/backup')
const authMiddleware = require('./middleware/auth')
const { ensureAgendaTables } = require('./config/ensureAgendaTables')
const { ensureUsuariosTable } = require('./config/ensureUsuariosTable')

// Ruta pública
app.use('/api/auth', authRoutes)

// Rutas protegidas
app.use('/api/categorias', authMiddleware, categoriasRoutes)
app.use('/api/contactos', authMiddleware, contactosRoutes)
app.use('/api/productos', authMiddleware, productosRoutes)
app.use('/api/estados', authMiddleware, estadosRoutes)
app.use('/api/servicios', authMiddleware, serviciosRoutes)
app.use('/api/dashboard', authMiddleware, dashboardRoutes)
app.use('/api/agenda', authMiddleware, agendaRoutes)
app.use('/api/backup', authMiddleware, backupRoutes)

// Asegura que las tablas necesarias existan (modo dev / auto-contenido).
ensureUsuariosTable().catch(err => {
  console.error('Error asegurando tabla de usuarios:', err.message)
})
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