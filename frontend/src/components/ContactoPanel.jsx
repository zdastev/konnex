import { useEffect, useState } from 'react'
import {
  fetchEstadosByContacto,
  fetchProductos,
  upsertEstado,
  fetchAgendaByContacto,
  createAgendaItem,
  updateAgendaItem
} from '../services/api'

const ESTADOS = ['sin_contactar', 'interesado', 'pensandolo', 'no_interesa']

const ESTADO_STYLES = {
  sin_contactar: 'bg-gray-100 text-gray-700 border-gray-300',
  interesado: 'bg-green-100 text-green-700 border-green-300',
  pensandolo: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  no_interesa: 'bg-red-100 text-red-700 border-red-300'
}

function ContactoPanel({ contacto, onClose }) {
  const [productos, setProductos] = useState([])
  const [estados, setEstados] = useState({})
  const [notas, setNotas] = useState({})
  const [guardando, setGuardando] = useState(null)

  const [agendaItems, setAgendaItems] = useState([])
  const [agendaLoading, setAgendaLoading] = useState(false)
  const [guardandoAgenda, setGuardandoAgenda] = useState(false)

  const [productoIdSeguimiento, setProductoIdSeguimiento] = useState(null)
  const [tipoSeguimiento, setTipoSeguimiento] = useState('llamada')
  const [fechaSeguimiento, setFechaSeguimiento] = useState('')
  const [notasSeguimiento, setNotasSeguimiento] = useState('')

  const toDatetimeLocal = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  useEffect(() => {
    if (contacto) {
      loadData()
    }
  }, [contacto])

  const loadData = async () => {
    try {
      setAgendaLoading(true)
      const [productosCategoria, estadosData, agendaData] = await Promise.all([
        fetchProductos(contacto.categoria_id),
        fetchEstadosByContacto(contacto.id),
        fetchAgendaByContacto(contacto.id)
      ])

      let productosData = productosCategoria
      if (!productosData.length) {
        productosData = await fetchProductos()
      }
      setProductos(productosData)

      const mapaEstados = {}
      const mapaNotas = {}
      estadosData.forEach(e => {
        mapaEstados[e.producto_id] = e.estado
        mapaNotas[e.producto_id] = e.notas || ''
      })
      setEstados(mapaEstados)
      setNotas(mapaNotas)

      setAgendaItems(agendaData)
      setProductoIdSeguimiento(productosData[0]?.id ?? null)
      setFechaSeguimiento(toDatetimeLocal(new Date(Date.now() + 60 * 60 * 1000)))
    } catch (error) {
      console.error(error)
    } finally {
      setAgendaLoading(false)
    }
  }

  const handleGuardarProducto = async (productoId, nuevoEstado = null) => {
    setGuardando(productoId)

    try {
      const estadoActual = estados[productoId] || 'sin_contactar'
      const estadoGuardar = nuevoEstado || estadoActual

      await upsertEstado({
        contacto_id: contacto.id,
        producto_id: productoId,
        estado: estadoGuardar,
        notas: notas[productoId] || ''
      })

      if (nuevoEstado) {
        setEstados(prev => ({ ...prev, [productoId]: nuevoEstado }))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setGuardando(null)
    }
  }

  const handleCrearSeguimiento = async (e) => {
    e.preventDefault()

    if (!productoIdSeguimiento) return
    if (!fechaSeguimiento) return
    if (!tipoSeguimiento) return

    setGuardandoAgenda(true)
    try {
      await createAgendaItem({
        contacto_id: contacto.id,
        producto_id: productoIdSeguimiento,
        fecha: fechaSeguimiento,
        tipo: tipoSeguimiento,
        notas: notasSeguimiento || ''
      })

      const agendaData = await fetchAgendaByContacto(contacto.id)
      setAgendaItems(agendaData)

      setNotasSeguimiento('')
    } catch (error) {
      console.error(error)
      alert('Error creando seguimiento')
    } finally {
      setGuardandoAgenda(false)
    }
  }

  const handleMarcarHecho = async (id) => {
    setGuardandoAgenda(true)
    try {
      await updateAgendaItem(id, { completado: true })
      const agendaData = await fetchAgendaByContacto(contacto.id)
      setAgendaItems(agendaData)
    } catch (error) {
      console.error(error)
      alert('Error actualizando seguimiento')
    } finally {
      setGuardandoAgenda(false)
    }
  }

  if (!contacto) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 z-50 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold leading-tight">
                {contacto.nombre_negocio}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {contacto.categoria_nombre}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-black">
              ✕
            </button>
          </div>
        </div>

        {/* Servicios */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
            Productos del negocio
          </p>

          <div className="space-y-6">
            {productos.map(producto => {
              const estadoActual = estados[producto.id] || 'sin_contactar'
              const estaGuardando = guardando === producto.id

              return (
                <div key={producto.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-semibold text-gray-800">
                      {producto.nombre}
                    </span>

                    {estaGuardando && (
                      <span className="text-xs text-gray-400 italic">
                        Guardando...
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ESTADOS.map(e => (
                      <button
                        key={e}
                        onClick={() => handleGuardarProducto(producto.id, e)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          estadoActual === e
                            ? ESTADO_STYLES[e]
                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <textarea
                      value={notas[producto.id] || ''}
                      onChange={(event) => {
                        const value = event.target.value
                        setNotas(prev => ({ ...prev, [producto.id]: value }))
                      }}
                      placeholder="Notas de seguimiento..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                    />

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleGuardarProducto(producto.id)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        Guardar nota
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {productos.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay productos disponibles para este contacto
              </p>
            )}
          </div>

          {/* Agenda / Seguimientos */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Agenda y seguimiento
                </p>
                <h3 className="text-base font-semibold">Próximos de {contacto.nombre_negocio}</h3>
              </div>
              {agendaLoading ? (
                <span className="text-xs text-gray-400 italic">Cargando...</span>
              ) : (
                <span className="text-xs text-gray-500">
                  {agendaItems.filter((a) => !a.completado).length} pendientes
                </span>
              )}
            </div>

            <form onSubmit={handleCrearSeguimiento} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Producto</label>
                <select
                  value={productoIdSeguimiento ?? ''}
                  onChange={(e) => setProductoIdSeguimiento(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  required
                  disabled={productos.length === 0}
                >
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={tipoSeguimiento}
                  onChange={(e) => setTipoSeguimiento(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  required
                >
                  <option value="llamada">Llamada</option>
                  <option value="email">Email</option>
                  <option value="reunion">Reunión</option>
                  <option value="tarea">Tarea</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha</label>
                <input
                  type="datetime-local"
                  value={fechaSeguimiento}
                  onChange={(e) => setFechaSeguimiento(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notas</label>
                <textarea
                  value={notasSeguimiento}
                  onChange={(e) => setNotasSeguimiento(e.target.value)}
                  rows={3}
                  placeholder="Qué vas a hacer y por qué..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={guardandoAgenda}
                className="w-full bg-[#111827] text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {guardandoAgenda ? 'Guardando...' : 'Crear seguimiento'}
              </button>
            </form>

            <div className="mt-6">
              {agendaItems.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No hay seguimientos registrados para este contacto.
                </p>
              ) : (
                <div className="space-y-3">
                  {agendaItems
                    .filter((a) => !a.completado)
                    .slice(0, 6)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl p-3 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">
                            {item.producto_nombre || 'Producto'} • {item.tipo}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(item.fecha).toLocaleString()}
                          </div>
                          {item.notas ? (
                            <div className="text-sm text-gray-600 mt-2 break-words">
                              {item.notas}
                            </div>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleMarcarHecho(item.id)}
                          className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-100 transition whitespace-nowrap"
                        >
                          Hecho
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default ContactoPanel