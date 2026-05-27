import { useEffect, useState } from 'react'
import {
  fetchProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '../services/api'

function ProductosView() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [editando, setEditando] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await fetchProductos()
      setProductos(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setNombre('')
    setDescripcion('')
    setEditando(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim()) return

    try {
      if (editando) {
        await updateProducto(editando.id, { nombre, descripcion })
      } else {
        await createProducto({ nombre, descripcion })
      }
      resetForm()
      load()
    } catch (error) {
      console.error(error)
      alert('Error guardando producto')
    }
  }

  const handleEditar = (producto) => {
    setEditando(producto)
    setNombre(producto.nombre)
    setDescripcion(producto.descripcion || '')
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await deleteProducto(id)
      if (editando?.id === id) resetForm()
      load()
    } catch (error) {
      console.error(error)
      alert('Error eliminando producto')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Productos</h2>
        <p className="text-gray-500 mt-1">Carta QR, Página web y otros servicios que vendes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-1 h-fit"
        >
          <h3 className="font-semibold mb-4">
            {editando ? 'Editar producto' : 'Nuevo producto'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#111827] text-white py-2.5 rounded-xl font-medium hover:opacity-90"
              >
                {editando ? 'Guardar' : 'Crear'}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden lg:col-span-2">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Cargando...</div>
          ) : productos.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No hay productos</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm text-gray-500">
                <tr>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="p-4 font-medium">{p.nombre}</td>
                    <td className="p-4 text-gray-600">{p.descripcion || '—'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditar(p)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(p.id)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductosView
