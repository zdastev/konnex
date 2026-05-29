const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/database') 

const register = async (req, res) => {
  const { nombre, email, password } = req.body

  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son requeridos' })

  try {
    // Verificar que el email no exista
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email])
    if (existe.rows.length > 0)
      return res.status(409).json({ error: 'El email ya está registrado' })

    const hash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hash]
    )

    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: `Error en el servidor: ${err.message}`, stack: err.stack })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' })

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const user = result.rows[0]
    const valida = await bcrypt.compare(password, user.password_hash)
    if (!valida)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado en el entorno')
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: `Error en el servidor: ${err.message}`, stack: err.stack })
  }
}

module.exports = { register, login }