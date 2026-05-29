import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function AuthView({ onLogin }) {
  const [modo, setModo] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const endpoint = modo === 'login' ? '/auth/login' : '/auth/register'
      const body = modo === 'login'
        ? { email: form.email, password: form.password }
        : { nombre: form.nombre, email: form.email, password: form.password }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')

      localStorage.setItem('konnex_token', data.token)
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Konnex</h1>
        <p className="text-gray-500 mb-8">{modo === 'login' ? 'Iniciá sesión para continuar' : 'Creá tu cuenta'}</p>

        {modo === 'register' && (
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
        )}
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Registrarse'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          {modo === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => { setModo(modo === 'login' ? 'register' : 'login'); setError('') }}
          >
            {modo === 'login' ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}