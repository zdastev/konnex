import { useEffect, useState } from 'react'
import {
  fetchCategorias,
  fetchProductos,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  fetchProductosByCategoria,
  setProductosByCategoria
} from '../services/api'

function CategoriasView() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [editando, setEditando] = useState(null)

  const [modalProductosOpen, setModalProductosOpen] = useState(false)
  const [categoriaConfig, setCategoriaConfig] = useState(null)
  const [productos, setProductos] = useState([])
  const [seleccion, setSeleccion] = useState(new Set())
  const [guardandoProductos, setGuardandoProductos] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await fetchCategorias()
      setCategorias(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const data = await fetchProductos()
        setProductos(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadProductos()
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
        await updateCategoria(editando.id, { nombre, descripcion })
      } else {
        await createCategoria({ nombre, descripcion })
      }
      resetForm()
      load()
    } catch (error) {
      console.error(error)
      alert('Error guardando categoría')
    }
  }

  const handleEditar = (categoria) => {
    setEditando(categoria)
    setNombre(categoria.nombre)
    setDescripcion(categoria.descripcion || '')
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return
    try {
      await deleteCategoria(id)
      if (editando?.id === id) resetForm()
      load()
    } catch (error) {
      console.error(error)
      alert('Error eliminando categoría')
    }
  }

  const openConfigProductos = async (categoria) => {
    setCategoriaConfig(categoria)
    setModalProductosOpen(true)
    try {
      const actuales = await fetchProductosByCategoria(categoria.id)
      setSeleccion(new Set(actuales.map((p) => p.id)))
    } catch (error) {
      console.error(error)
      setSeleccion(new Set())
    }
  }

  const closeConfigProductos = () => {
    setModalProductosOpen(false)
    setCategoriaConfig(null)
    setSeleccion(new Set())
  }

  const toggleProducto = (id) => {
    setSeleccion((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleGuardarProductos = async () => {
    if (!categoriaConfig) return
    setGuardandoProductos(true)
    try {
      await setProductosByCategoria(categoriaConfig.id, Array.from(seleccion))
      closeConfigProductos()
    } catch (error) {
      console.error(error)
      alert('Error guardando productos de la categoría')
    } finally {
      setGuardandoProductos(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Categorías</h2>
        <p className="text-gray-500 mt-1">Tipos de negocio (restaurante, peluquería, etc.)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-1 h-fit"
        >
          <h3 className="font-semibold mb-4">
            {editando ? 'Editar categoría' : 'Nueva categoría'}
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
          ) : categorias.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No hay categorías</div>
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
                {categorias.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="p-4 font-medium">{c.nombre}</td>
                    <td className="p-4 text-gray-600">{c.descripcion || '—'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openConfigProductos(c)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100"
                        >
                          Productos
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditar(c)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(c.id)}
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

      {modalProductosOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closeConfigProductos}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Productos por categoría</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {categoriaConfig?.nombre}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeConfigProductos}
                  className="text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {productos.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No hay productos creados todavía. Crea productos primero en la sección “Productos”.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productos.map((p) => {
                      const checked = seleccion.has(p.id)
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProducto(p.id)}
                          className={`text-left p-4 rounded-xl border transition ${
                            checked
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900">
                                {p.nombre}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {p.descripcion || '—'}
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                                checked ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'
                              }`}
                            >
                              {checked ? (
                                <span className="text-white text-xs font-bold">✓</span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeConfigProductos}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={guardandoProductos}
                  onClick={handleGuardarProductos}
                  className="px-4 py-2.5 rounded-xl bg-[#111827] text-white font-medium hover:opacity-90 disabled:opacity-60"
                >
                  {guardandoProductos ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CategoriasView
