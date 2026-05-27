const VISTAS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'contactos', label: 'Contactos' },
  { id: 'categorias', label: 'Categorías' },
  { id: 'productos', label: 'Productos' },
  { id: 'sin_web', label: 'Sin página web' }
]

function Sidebar({ vistaActiva, onNavigate }) {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-6 flex-shrink-0 sticky top-0">
      <h1 className="text-2xl font-bold tracking-tight">Konnex</h1>

      <nav className="mt-10 space-y-2">
        {VISTAS.map((item) => {
          const activa = vistaActiva === item.id
          const esSinWeb = item.id === 'sin_web'

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
                activa
                  ? esSinWeb
                    ? 'bg-yellow-50 text-yellow-900 border border-yellow-200'
                    : 'bg-[#111827] text-white'
                  : esSinWeb
                    ? 'text-yellow-800 hover:bg-yellow-50 border border-transparent hover:border-yellow-200'
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
