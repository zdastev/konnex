import { useEffect, useState } from 'react'
import {
  fetchContactos,
  deleteContacto,
  fetchEstadosPorProducto,
  fetchAgendaUpcoming,
  updateAgendaItem,
  fetchTareasHoy
} from './services/api'
import ContactModal from './components/ContactModal'
import ContactoPanel from './components/ContactoPanel'
import Sidebar from './components/Sidebar'
import ContactosTable from './components/ContactosTable'
import CategoriasView from './components/CategoriasView'
import ProductosView from './components/ProductosView'
import KanbanView from './components/KanbanView'
import ExcelImporter from './components/ExcelImporter'
import ExcelExporter from './components/ExcelExporter'

const ESTADO_LABELS = {
  sin_contactar: 'Sin contactar',
  interesado: 'Interesado',
  pensandolo: 'Pensándolo',
  no_interesa: 'No interesa'
}

const ESTADO_PILLS = {
  sin_contactar: 'bg-gray-100 text-gray-700 border-gray-300',
  interesado: 'bg-green-100 text-green-700 border-green-300',
  pensandolo: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  no_interesa: 'bg-red-100 text-red-700 border-red-300'
}

const TITULOS = {
  dashboard: { titulo: 'Dashboard', subtitulo: 'Gestión de clientes y oportunidades' },
  contactos: { titulo: 'Contactos', subtitulo: 'Listado completo de prospectos y clientes' },
  categorias: { titulo: 'Categorías', subtitulo: '' },
  productos: { titulo: 'Productos', subtitulo: '' },
  kanban: { titulo: 'Tablero Kanban', subtitulo: '' },
  sin_web: {
    titulo: 'Sin página web',
    subtitulo: 'Negocios detectados como oportunidad para vender web'
  }
}

function App() {
  const [vistaActiva, setVistaActiva] = useState('dashboard')

  const [contactos, setContactos] = useState([])
  const [contactosTodos, setContactosTodos] = useState([])
  const [loading, setLoading] = useState(true)

  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [estadosPorProducto, setEstadosPorProducto] = useState([])
  const [tareasHoy, setTareasHoy] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [filtroWeb, setFiltroWeb] = useState('todas')

  const [openModal, setOpenModal] = useState(false)
  const [contactoEditar, setContactoEditar] = useState(null)
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null)

  const [agendaLoading, setAgendaLoading] = useState(false)
  const [agendaUpcoming, setAgendaUpcoming] = useState([])

  const buildParams = (extra = {}) => {
    const params = {}

    if (filtroWeb === 'con') params.tiene_web = true
    else if (filtroWeb === 'sin') params.tiene_web = false

    if (busqueda.trim() !== '') params.q = busqueda.trim()

    return { ...params, ...extra }
  }

  const loadContactosTodos = async () => {
    try {
      const data = await fetchContactos()
      setContactosTodos(data)
    } catch (error) {
      console.error(error)
    }
  }

  const loadContactos = async () => {
    try {
      setLoading(true)
      const data = await fetchContactos(buildParams())
      setContactos(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const refreshContactos = async () => {
    await Promise.all([loadContactosTodos(), loadContactos()])
  }

  useEffect(() => {
    loadContactos()
  }, [filtroWeb, busqueda])

  useEffect(() => {
    loadContactosTodos()
  }, [])

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setDashboardLoading(true)
        const data = await fetchEstadosPorProducto()
        setEstadosPorProducto(data)
        
        try {
          const tareas = await fetchTareasHoy()
          setTareasHoy(tareas)
        } catch (err) {
          console.error("Error cargando tareas de hoy:", err)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setDashboardLoading(false)
      }
    }

    loadDashboard()
  }, [vistaActiva])

  useEffect(() => {
    const loadUpcoming = async () => {
      try {
        setAgendaLoading(true)
        const data = await fetchAgendaUpcoming({ limit: 8 })
        setAgendaUpcoming(data)
      } catch (error) {
        console.error(error)
      } finally {
        setAgendaLoading(false)
      }
    }

    loadUpcoming()
  }, [])

  const handleNavigate = (vista, filtro = null) => {
    setVistaActiva(vista)
    if (filtro) {
      setFiltroWeb(filtro)
    } else if (vista === 'sin_web') {
      setFiltroWeb('sin')
    } else if (vista === 'contactos' || vista === 'dashboard') {
      setFiltroWeb('todas')
    }
  }

  const handleNuevoContacto = () => {
    setContactoEditar(null)
    setOpenModal(true)
  }

  const handleEditar = (e, contacto) => {
    e.stopPropagation()
    setContactoEditar(contacto)
    setOpenModal(true)
  }

  const handleEliminar = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('¿Eliminar este contacto?')) return

    try {
      await deleteContacto(id)
      if (contactoSeleccionado?.id === id) setContactoSeleccionado(null)
      refreshContactos()
    } catch (error) {
      console.error(error)
      alert('Error eliminando contacto')
    }
  }

  const handleCerrarModal = () => {
    setOpenModal(false)
    setContactoEditar(null)
  }

  const handleMarcarHechoGlobal = async (id) => {
    setAgendaLoading(true)
    try {
      await updateAgendaItem(id, { completado: true })
      const data = await fetchAgendaUpcoming({ limit: 8 })
      setAgendaUpcoming(data)
    } catch (error) {
      console.error(error)
      alert('Error marcando seguimiento como hecho')
    } finally {
      setAgendaLoading(false)
    }
  }

  const mostrarTablaContactos =
    vistaActiva === 'dashboard' ||
    vistaActiva === 'contactos' ||
    vistaActiva === 'sin_web'

  const meta = TITULOS[vistaActiva] || TITULOS.dashboard

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#1f2937]">
      <div className="flex">
        <Sidebar vistaActiva={vistaActiva} onNavigate={handleNavigate} />

        <main className="flex-1 p-10 min-w-0">
          {vistaActiva === 'categorias' ? (
            <CategoriasView />
          ) : vistaActiva === 'productos' ? (
            <ProductosView />
          ) : vistaActiva === 'kanban' ? (
            <KanbanView />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{meta.titulo}</h2>
                  {meta.subtitulo && (
                    <p className="text-gray-500 mt-1">{meta.subtitulo}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <ExcelExporter />
                  <ExcelImporter onImported={refreshContactos} />
                  <button
                    type="button"
                    onClick={handleNuevoContacto}
                    className="bg-[#111827] text-white px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
                  >
                    Nuevo contacto
                  </button>
                </div>
              </div>

              {vistaActiva === 'dashboard' && (
                <>
                  <div className="bg-red-50 rounded-2xl border border-red-100 p-6 shadow-sm mb-6 mt-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-red-900">🔔 Tareas para Hoy (y atrasadas)</h3>
                      <span className="bg-red-200 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        {tareasHoy.length} pendientes
                      </span>
                    </div>
                    {dashboardLoading ? (
                      <p className="text-red-700 text-sm">Cargando tareas...</p>
                    ) : tareasHoy.length === 0 ? (
                      <p className="text-red-700 text-sm">No tienes seguimientos pendientes para hoy. ¡A buscar nuevos prospectos!</p>
                    ) : (
                      <div className="space-y-3">
                        {tareasHoy.map(tarea => (
                          <div key={tarea.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-red-100">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900">{tarea.nombre_negocio}</span>
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md uppercase tracking-wider">{tarea.tipo}</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                {tarea.producto_nombre ? `Sobre: ${tarea.producto_nombre}` : 'Seguimiento general'}
                              </div>
                              {tarea.notas && <div className="text-xs text-gray-500 italic">"{tarea.notas}"</div>}
                              <div className="text-xs font-medium text-red-500 mt-1">Fecha programada: {new Date(tarea.fecha).toLocaleString()}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              {tarea.whatsapp && (
                                <a 
                                  href={`https://wa.me/${tarea.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${tarea.nombre_negocio}, soy Steven. Te escribo para dar seguimiento a nuestra plática. ¿Cómo estás?`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                                >
                                  WhatsApp
                                </a>
                              )}
                              <button 
                                onClick={async () => {
                                  await updateAgendaItem(tarea.id, { completado: true })
                                  loadDashboard()
                                }}
                                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                              >
                                Listo ✓
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                      <p className="text-gray-500 text-sm">Total contactos</p>
                      <h3 className="text-3xl font-bold mt-2">{contactosTodos.length}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigate('contactos', 'con')}
                      className="bg-white rounded-2xl p-6 border border-gray-200 text-left hover:border-gray-300 transition"
                    >
                      <p className="text-gray-500 text-sm">Con página web</p>
                      <h3 className="text-3xl font-bold mt-2 text-green-600">
                        {contactosTodos.filter((c) => c.tiene_web).length}
                      </h3>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('sin_web')}
                      className="bg-white rounded-2xl p-6 border border-gray-200 text-left hover:border-yellow-300 transition"
                    >
                      <p className="text-gray-500 text-sm">Sin página web</p>
                      <h3 className="text-3xl font-bold mt-2 text-yellow-500">
                        {contactosTodos.filter((c) => !c.tiene_web).length}
                      </h3>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigate('categorias')}
                      className="bg-white rounded-2xl p-6 border border-gray-200 text-left hover:border-gray-300 transition"
                    >
                      <p className="text-gray-500 text-sm">Categorías</p>
                      <h3 className="text-3xl font-bold mt-2 text-blue-600">
                        {[...new Set(contactosTodos.map((c) => c.categoria_nombre))].length}
                      </h3>
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Resumen por servicio</h3>
                      <span className="text-sm text-gray-500">
                        {estadosPorProducto.length || '—'} productos
                      </span>
                    </div>

                    {dashboardLoading ? (
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 text-center">
                        Cargando resumen...
                      </div>
                    ) : estadosPorProducto.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 text-center">
                        Todavía no hay productos con estados registrados.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {estadosPorProducto.map((p) => {
                          const total =
                            Number(p.sin_contactar || 0) +
                            Number(p.interesado || 0) +
                            Number(p.pensandolo || 0) +
                            Number(p.no_interesa || 0)

                          return (
                            <div
                              key={p.producto_id}
                              className="bg-white rounded-2xl border border-gray-200 p-5"
                            >
                              <div className="font-semibold text-gray-900">{p.producto_nombre}</div>
                              <div className="text-xs text-gray-500 mt-1">Contactos: {total}</div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {Object.keys(ESTADO_LABELS).map((estadoKey) => (
                                  <div
                                    key={estadoKey}
                                    className={`px-3 py-1 rounded-full text-xs border ${ESTADO_PILLS[estadoKey]}`}
                                  >
                                    <span className="font-medium">{ESTADO_LABELS[estadoKey]}</span>
                                    <span className="ml-2 font-semibold">{p[estadoKey] || 0}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Seguimiento comercial</h3>
                      <span className="text-sm text-gray-500">
                        Próximos {agendaUpcoming.length || '—'}
                      </span>
                    </div>

                    {agendaLoading ? (
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 text-center">
                        Cargando agenda...
                      </div>
                    ) : agendaUpcoming.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-gray-500 text-center">
                        No hay seguimientos próximos todavía.
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                          {agendaUpcoming.map((item) => (
                            <div key={item.id} className="p-4 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900">
                                  {item.nombre_negocio || 'Contacto'} •{' '}
                                  {item.producto_nombre || 'Producto'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.tipo} • {new Date(item.fecha).toLocaleString()}
                                </div>
                                {item.notas && (
                                  <div className="text-sm text-gray-600 mt-2 break-words">
                                    {item.notas}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleMarcarHechoGlobal(item.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-100 transition"
                              >
                                Hecho
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {mostrarTablaContactos && (
                <div className={vistaActiva === 'dashboard' ? 'mt-10' : 'mt-8'}>
                  <ContactosTable
                    contactos={contactos}
                    loading={loading}
                    busqueda={busqueda}
                    filtroWeb={filtroWeb}
                    onBusquedaChange={(e) => setBusqueda(e.target.value)}
                    onFiltroWeb={setFiltroWeb}
                    onSelectContacto={setContactoSeleccionado}
                    contactoSeleccionadoId={contactoSeleccionado?.id}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                    titulo={
                      vistaActiva === 'sin_web'
                        ? 'Contactos sin página web'
                        : 'Contactos'
                    }
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <ContactModal
        open={openModal}
        onClose={handleCerrarModal}
        onCreated={refreshContactos}
        contacto={contactoEditar}
      />

      <ContactoPanel
        contacto={contactoSeleccionado}
        onClose={() => setContactoSeleccionado(null)}
      />
    </div>
  )
}

export default App
