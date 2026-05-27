function ContactosTable({
  contactos,
  loading,
  busqueda,
  filtroWeb,
  onBusquedaChange,
  onFiltroWeb,
  onSelectContacto,
  contactoSeleccionadoId,
  onEditar,
  onEliminar,
  titulo = 'Contactos'
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-lg font-semibold">{titulo}</h3>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 text-xs">
            <button
              type="button"
              onClick={() => onFiltroWeb('todas')}
              className={`px-3 py-1.5 rounded-l-xl ${
                filtroWeb === 'todas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => onFiltroWeb('con')}
              className={`px-3 py-1.5 ${
                filtroWeb === 'con' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Con web
            </button>
            <button
              type="button"
              onClick={() => onFiltroWeb('sin')}
              className={`px-3 py-1.5 rounded-r-xl ${
                filtroWeb === 'sin' ? 'bg-white text-yellow-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sin web
            </button>
          </div>

          <input
            type="text"
            value={busqueda}
            onChange={onBusquedaChange}
            placeholder="Buscar por nombre, WhatsApp o ubicación..."
            className="border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-gray-300 text-sm min-w-[260px]"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500">Cargando contactos...</div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="p-4">Negocio</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">WhatsApp</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4">Página web</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-500">
                  No hay contactos registrados
                </td>
              </tr>
            ) : (
              contactos.map((contacto) => (
                <tr
                  key={contacto.id}
                  onClick={() => onSelectContacto(contacto)}
                  className={`border-t border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                    contactoSeleccionadoId === contacto.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="p-4 font-medium">{contacto.nombre_negocio}</td>
                  <td className="p-4 text-gray-600">{contacto.categoria_nombre}</td>
                  <td className="p-4 text-gray-600">{contacto.whatsapp}</td>
                  <td className="p-4 text-gray-600">{contacto.ubicacion}</td>
                  <td className="p-4">
                    {contacto.tiene_web ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        Tiene web
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                        No tiene
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => onEditar(e, contacto)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onEliminar(e, contacto.id)}
                        className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ContactosTable
