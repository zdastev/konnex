import { useEffect, useState } from 'react'
import { createContacto, updateContacto, fetchCategorias, fetchProductos, fetchEstadosByContacto, upsertEstado } from '../services/api'

function ContactModal({ open, onClose, onCreated, contacto }) {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [productosSeleccionados, setProductosSeleccionados] = useState([])

  const emptyForm = {
    nombre_negocio: '',
    whatsapp: '',
    ubicacion: '',
    categoria_id: '',
    tiene_web: false
  }

  const [formData, setFormData] = useState(emptyForm)
  const modoEdicion = !!contacto

  useEffect(() => {
    if (open) {
      fetchCategorias().then(setCategorias).catch(console.error)
      fetchProductos().then(data => {
        setProductos(data)
        if (!contacto) setProductosSeleccionados([])
      }).catch(console.error)

      if (contacto) {
        setFormData({
          nombre_negocio: contacto.nombre_negocio || '',
          whatsapp: contacto.whatsapp || '',
          ubicacion: contacto.ubicacion || '',
          categoria_id: contacto.categoria_id || '',
          tiene_web: contacto.tiene_web || false
        })
        fetchEstadosByContacto(contacto.id)
          .then(estados => setProductosSeleccionados(estados.map(e => e.producto_id)))
          .catch(console.error)
      } else {
        setFormData(emptyForm)
        setProductosSeleccionados([])
      }
    }
  }, [open, contacto])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleProducto = (id) => {
    setProductosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modoEdicion) {
        await updateContacto(contacto.id, formData)
        for (const producto_id of productosSeleccionados) {
          await upsertEstado({ contacto_id: contacto.id, producto_id, estado: 'sin_contactar' })
        }
      } else {
        await createContacto({ ...formData, producto_ids: productosSeleccionados })
      }
      setFormData(emptyForm)
      setProductosSeleccionados([])
      onCreated()
      onClose()
    } catch (error) {
      console.error(error)
      alert(modoEdicion ? 'Error actualizando contacto' : 'Error creando contacto')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {modoEdicion ? 'Editar contacto' : 'Nuevo contacto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">Nombre del negocio</label>
            <input
              type="text"
              name="nombre_negocio"
              value={formData.nombre_negocio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {productos.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Productos que necesita</label>
              <div className="space-y-2">
                {productos.map(p => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <input
                      type="checkbox"
                      checked={productosSeleccionados.includes(p.id)}
                      onChange={() => toggleProducto(p.id)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm font-medium">{p.nombre}</span>
                  </label>
                ))}
              </div>
              {productosSeleccionados.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Selecciona al menos un producto</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="tiene_web"
              checked={formData.tiene_web}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Tiene página web</label>
          </div>

          <button
            type="submit"
            disabled={productosSeleccionados.length === 0}
            className="w-full bg-[#111827] text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-40"
          >
            {modoEdicion ? 'Guardar cambios' : 'Guardar contacto'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default ContactModal
