import { useEffect, useState } from 'react'
import { createContacto, updateContacto, fetchCategorias } from '../services/api'

function ContactModal({ open, onClose, onCreated, contacto }) {
  const [categorias, setCategorias] = useState([])

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
      loadCategorias()

      if (contacto) {
        setFormData({
          nombre_negocio: contacto.nombre_negocio || '',
          whatsapp: contacto.whatsapp || '',
          ubicacion: contacto.ubicacion || '',
          categoria_id: contacto.categoria_id || '',
          tiene_web: contacto.tiene_web || false
        })
      } else {
        setFormData(emptyForm)
      }
    }
  }, [open, contacto])

  const loadCategorias = async () => {
    try {
      const data = await fetchCategorias()
      setCategorias(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modoEdicion) {
        await updateContacto(contacto.id, formData)
      } else {
        await createContacto(formData)
      }

      setFormData(emptyForm)
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
      <div className="bg-white w-full max-w-xl rounded-2xl p-8">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {modoEdicion ? 'Editar contacto' : 'Nuevo contacto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
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
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

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
            className="w-full bg-[#111827] text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            {modoEdicion ? 'Guardar cambios' : 'Guardar contacto'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default ContactModal