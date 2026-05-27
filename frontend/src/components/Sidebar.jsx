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
    <aside className="w-64 h-screen bg-[#0B0F19] border-r border-[#1F2937] p-6 flex-shrink-0 sticky top-0 text-white shadow-2xl flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Konnex
        </h1>
      </div>

      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menú Principal</div>

      <nav className="space-y-1.5 flex-1">
        {VISTAS.map((item) => {
          const activa = vistaActiva === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-medium flex items-center gap-3 ${
                activa
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-inner'
                  : 'text-gray-400 hover:bg-[#1F2937]/50 hover:text-gray-200 border border-transparent'
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
