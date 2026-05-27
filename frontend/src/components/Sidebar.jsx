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
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
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
      
      <div className="mt-auto pt-6 border-t border-[#1F2937]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-200">Admin</div>
            <div className="text-xs text-gray-500">Plan Pro</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
