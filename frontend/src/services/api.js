const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/* =========================
   CATEGORÍAS
========================= */

export const fetchCategorias = async () => {
  const response = await fetch(`${API_URL}/categorias`)

  if (!response.ok) {
    throw new Error('Error obteniendo categorías')
  }

  return response.json()
}

export const createCategoria = async (data) => {
  const response = await fetch(`${API_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error creando categoría')
  return response.json()
}

export const updateCategoria = async (id, data) => {
  const response = await fetch(`${API_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error actualizando categoría')
  return response.json()
}

export const deleteCategoria = async (id) => {
  const response = await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Error eliminando categoría')
  return response.json()
}

export const fetchProductosByCategoria = async (categoria_id) => {
  const response = await fetch(`${API_URL}/categorias/${categoria_id}/productos`)
  if (!response.ok) throw new Error('Error obteniendo productos de la categoría')
  return response.json()
}

export const setProductosByCategoria = async (categoria_id, producto_ids) => {
  const response = await fetch(`${API_URL}/categorias/${categoria_id}/productos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ producto_ids })
  })
  if (!response.ok) throw new Error('Error asignando productos a la categoría')
  return response.json()
}

/* =========================
   CONTACTOS
========================= */

export const fetchContactos = async (params = {}) => {
  let url = `${API_URL}/contactos`

  const searchParams = new URLSearchParams()

  if (params.categoria_id) {
    searchParams.append('categoria_id', params.categoria_id)
  }

  if (params.tiene_web !== undefined && params.tiene_web !== null) {
    searchParams.append('tiene_web', String(params.tiene_web))
  }

  if (params.q && params.q.trim() !== '') {
    searchParams.append('q', params.q.trim())
  }

  const queryString = searchParams.toString()
  if (queryString) {
    url += `?${queryString}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error obteniendo contactos')
  }

  return response.json()
}

export const createContacto = async (data) => {
  const response = await fetch(`${API_URL}/contactos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error creando contacto')
  }

  return response.json()
}

export const updateContacto = async (id, data) => {
  const response = await fetch(`${API_URL}/contactos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error actualizando contacto')
  }

  return response.json()
}

export const deleteContacto = async (id) => {
  const response = await fetch(`${API_URL}/contactos/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Error eliminando contacto')
  }

  return response.json()
}

/* =========================
   PRODUCTOS (AÚN EN TRANSICIÓN)
========================= */

export const fetchProductos = async (categoria_id = null) => {
  let url = `${API_URL}/productos`

  if (categoria_id) {
    url += `?categoria_id=${categoria_id}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error obteniendo productos')
  }

  return response.json()
}

export const createProducto = async (data) => {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error creando producto')
  return response.json()
}

export const updateProducto = async (id, data) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error actualizando producto')
  return response.json()
}

export const deleteProducto = async (id) => {
  const response = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Error eliminando producto')
  return response.json()
}

/* =========================
   🟢 SERVICIOS (NUEVO SISTEMA)
========================= */

export const fetchServicios = async (categoria) => {
  const response = await fetch(`${API_URL}/servicios/${categoria}`)

  if (!response.ok) {
    throw new Error('Error obteniendo servicios')
  }

  return response.json()
}

/* =========================
   ESTADOS
========================= */

export const fetchEstadosByContacto = async (contacto_id) => {
  const response = await fetch(`${API_URL}/estados/${contacto_id}`)

  if (!response.ok) {
    throw new Error('Error obteniendo estados')
  }

  return response.json()
}

export const upsertEstado = async (data) => {
  const response = await fetch(`${API_URL}/estados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error guardando estado')
  }

  return response.json()
}

export const deleteEstado = async (id) => {
  const response = await fetch(`${API_URL}/estados/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Error eliminando estado')
  }

  return response.json()
}

/* =========================
   DASHBOARD
========================= */
export const fetchEstadosPorProducto = async () => {
  const response = await fetch(`${API_URL}/dashboard/estados-por-producto`)

  if (!response.ok) {
    throw new Error('Error obteniendo estados por producto')
  }

  return response.json()
}

export const fetchKanbanBoard = async (producto_id) => {
  const response = await fetch(`${API_URL}/dashboard/kanban/${producto_id}`)
  if (!response.ok) {
    throw new Error('Error obteniendo Kanban')
  }
  return response.json()
}

export const fetchTareasHoy = async () => {
  const response = await fetch(`${API_URL}/dashboard/tareas-hoy`)
  if (!response.ok) {
    throw new Error('Error obteniendo tareas de hoy')
  }
  return response.json()
}

/* =========================
   AGENDA / SEGUIMIENTOS
========================= */
export const fetchAgendaUpcoming = async (params = {}) => {
  let url = `${API_URL}/agenda/upcoming`
  const searchParams = new URLSearchParams()

  if (params.from) searchParams.append('from', params.from)
  if (params.to) searchParams.append('to', params.to)
  if (params.limit) searchParams.append('limit', String(params.limit))

  const qs = searchParams.toString()
  if (qs) url += `?${qs}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error obteniendo agenda')
  }

  return response.json()
}

export const fetchAgendaByContacto = async (contacto_id) => {
  const response = await fetch(`${API_URL}/agenda/contacto/${contacto_id}`)

  if (!response.ok) {
    throw new Error('Error obteniendo agenda del contacto')
  }

  return response.json()
}

export const createAgendaItem = async (data) => {
  const response = await fetch(`${API_URL}/agenda`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error creando seguimiento')
  }

  return response.json()
}

export const updateAgendaItem = async (id, data) => {
  const response = await fetch(`${API_URL}/agenda/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error actualizando seguimiento')
  }

  return response.json()
}

export const deleteAgendaItem = async (id) => {
  const response = await fetch(`${API_URL}/agenda/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Error eliminando seguimiento')
  }

  return response.json()
}

/* =========================
   BACKUP
========================= */
export const fetchBackup = async () => {
  const response = await fetch(`${API_URL}/backup`)
  
  if (!response.ok) {
    throw new Error('Error obteniendo el backup')
  }

  return response.json()
}