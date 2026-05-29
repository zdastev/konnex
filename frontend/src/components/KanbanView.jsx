import { useEffect, useState } from 'react'
import { fetchProductos, fetchKanbanBoard, upsertEstado } from '../services/api'

const ESTADO_LABELS = {
  sin_contactar: 'Sin contactar',
  contactado: 'Ya le escribí',
  interesado: 'Interesado',
  pensandolo: 'Pensándolo',
  no_interesa: 'No interesa'
}

const ESTADO_BG = {
  sin_contactar: 'bg-gray-100',
  contactado: 'bg-blue-100',
  interesado: 'bg-green-100',
  pensandolo: 'bg-yellow-100',
  no_interesa: 'bg-red-100'
}

const ESTADO_BORDER = {
  sin_contactar: 'border-gray-300',
  contactado: 'border-blue-300',
  interesado: 'border-green-300',
  pensandolo: 'border-yellow-300',
  no_interesa: 'border-red-300'
}

const ESTADO_HEADER = {
  sin_contactar: 'text-gray-700',
  contactado: 'text-blue-700',
  interesado: 'text-green-700',
  pensandolo: 'text-yellow-700',
  no_interesa: 'text-red-700'
}

export default function KanbanView() {
  const [productos, setProductos] = useState([])
  const [productoId, setProductoId] = useState('')
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProductos().then((res) => {
      setProductos(res)
      if (res.length > 0) setProductoId(res[0].id)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (!productoId) return
    setLoading(true)
    fetchKanbanBoard(productoId).then(res => {
      setBoard(res)
    }).catch(console.error).finally(() => setLoading(false))
  }, [productoId])

  const onDragStart = (e, contacto_id, estado_actual) => {
    e.dataTransfer.setData('contacto_id', contacto_id)
    e.dataTransfer.setData('estado_actual', estado_actual)
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const onDrop = async (e, nuevo_estado) => {
    e.preventDefault()
    const contacto_id = e.dataTransfer.getData('contacto_id')
    const estado_actual = e.dataTransfer.getData('estado_actual')

    if (estado_actual === nuevo_estado) return

    // Update optimistic UI
    setBoard(prev => prev.map(c => 
      c.contacto_id == contacto_id ? { ...c, estado: nuevo_estado } : c
    ))

    try {
      await upsertEstado({ contacto_id, producto_id: productoId, estado: nuevo_estado })
    } catch (error) {
      console.error(error)
      alert("Error al actualizar el estado")
      // Revertir (idealmente se hace un fetchKanbanBoard)
    }
  }

  const getColumna = (estado) => board.filter(c => c.estado === estado)

  const getWhatsAppLink = (contacto, estado) => {
    const numero = contacto.whatsapp.replace(/\D/g, '')
    const productoSelect = productos.find(p => p.id == productoId)
    const nombreProducto = productoSelect ? productoSelect.nombre : 'nuestros servicios'
    
    let mensaje = ''

    if (estado === 'sin_contactar') {
      const catNombre = contacto.categoria_nombre ? contacto.categoria_nombre.toLowerCase() : ''
      const isRestaurante = catNombre.includes('restaurant') || catNombre.includes('comida') || catNombre.includes('bar') || catNombre.includes('cafe') || catNombre.includes('gastronom')
      
      if (isRestaurante) {
        mensaje = `Hola ${contacto.nombre_negocio}, soy Steven. Vi su restaurante y me encantaría ayudarles a digitalizar su menú con un código QR interactivo.`
        if (!contacto.tiene_web) {
          mensaje += ` Además, noté que no cuentan con página web, también podemos hacerles una para atraer más clientes. ¿Tendrán unos minutos para platicar?`
        } else {
          mensaje += ` ¿Tendrán unos minutos para platicar sobre esto?`
        }
      } else {
        mensaje = `Hola ${contacto.nombre_negocio}, soy Steven. Me encantaría ofrecerles nuestro sistema de agendamiento de citas para simplificar sus reservas.`
        if (!contacto.tiene_web) {
          mensaje += ` También noté que no cuentan con página web, podemos crearles una súper profesional. ¿Tendrán unos minutos para platicar?`
        } else {
          mensaje += ` ¿Les interesaría platicar unos minutos sobre cómo podemos ayudarles?`
        }
      }
    } else {
      // Seguimiento normal
      mensaje = `Hola ${contacto.nombre_negocio}, soy Steven. Te escribo para dar seguimiento a nuestra plática sobre ${nombreProducto}. ¿Cómo estás?`
    }
    
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Tablero Kanban</h2>
          <p className="text-gray-500 mt-1">Arrastra prospectos por las etapas de venta</p>
        </div>
        <div>
          <select 
            className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white px-4 py-2"
            value={productoId}
            onChange={e => setProductoId(e.target.value)}
          >
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando tablero...</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ height: 'calc(100vh - 200px)' }}>
          {Object.entries(ESTADO_LABELS).map(([estadoKey, label]) => {
            const columna = getColumna(estadoKey)
            return (
              <div 
                key={estadoKey} 
                className={`flex-1 min-w-0 w-0 rounded-2xl p-3 flex flex-col border ${ESTADO_BG[estadoKey]} ${ESTADO_BORDER[estadoKey]}`}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, estadoKey)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold ${ESTADO_HEADER[estadoKey]}`}>{label}</h3>
                  <span className="bg-white rounded-full px-2 py-1 text-xs font-semibold shadow-sm text-gray-600">
                    {columna.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                  {columna.map(c => (
                    <div 
                      key={c.contacto_id}
                      draggable
                      onDragStart={(e) => onDragStart(e, c.contacto_id, estadoKey)}
                      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition"
                    >
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">{c.nombre_negocio}</h4>
                      {c.categoria_nombre && (
                        <span className="text-xs text-gray-400 block mt-0.5">{c.categoria_nombre}</span>
                      )}
                      {c.whatsapp && (
                        <a 
                          href={getWhatsAppLink(c, estadoKey)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            if (estadoKey === 'sin_contactar') {
                              upsertEstado({ contacto_id: c.contacto_id, producto_id: productoId, estado: 'contactado' })
                                .then(() => setBoard(prev => prev.map(x => x.contacto_id === c.contacto_id ? { ...x, estado: 'contactado' } : x)))
                                .catch(console.error)
                            }
                          }}
                          className="flex items-center gap-1 text-xs text-blue-500 hover:underline mt-2"
                        >
                          <span>📱</span> {c.whatsapp}
                        </a>
                      )}
                    </div>
                  ))}
                  {columna.length === 0 && (
                    <div className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                      Suelta un prospecto aquí
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
