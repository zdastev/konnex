import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { createContacto, fetchCategorias, createCategoria } from '../services/api'

export default function ExcelImporter({ onImported }) {
  const fileInputRef = useRef(null)
  const [importing, setImporting] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImporting(true)
    try {
      // 1. Obtener categorías actuales de la BD
      let categoriasDB = []
      try {
        categoriasDB = await fetchCategorias()
      } catch (err) {
        console.warn("No se pudieron cargar las categorías, se continuará sin ellas.", err)
      }

      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convertimos a JSON. Esperamos que la primera fila tenga los títulos.
      const json = XLSX.utils.sheet_to_json(worksheet)

      let creados = 0
      for (const row of json) {
        const keys = Object.keys(row)
        const findKey = (words) => keys.find(k => words.some(w => k.toLowerCase().includes(w)))
        
        const nombreKey = findKey(['nombre', 'negocio', 'restaurante', 'empresa'])
        const nombre = nombreKey ? row[nombreKey] : null

        const wpKey = findKey(['whatsapp', 'teléfono', 'telefono', 'cel', 'movil'])
        const whatsapp = wpKey ? row[wpKey] : null

        const ubKey = findKey(['ubicación', 'ubicacion', 'dirección', 'direccion'])
        const ubicacion = ubKey ? row[ubKey] : null

        const webKey = findKey(['web', 'website', 'página', 'pagina', 'url', 'link', 'facebook', 'instagram', 'red social'])
        const webRaw = webKey ? row[webKey] : ''
        const webStr = String(webRaw).toLowerCase().trim()

        // También buscar URLs en CUALQUIER columna del Excel
        const tieneUrlEnAlgunaColumna = Object.values(row).some(val => {
          const v = String(val).toLowerCase().trim()
          return v.includes('http') || v.includes('www.') || v.includes('.com') || v.includes('.es') || v.includes('.net') || v.includes('.mx')
        })

        const tieneWeb = tieneUrlEnAlgunaColumna || webStr === 'si' || webStr === 'sí' || webStr === 'true' || webStr === '1'

        const catKey = findKey(['categoría', 'categoria', 'giro'])
        const catRaw = catKey ? row[catKey] : ''
        const catStr = String(catRaw).trim()
        let finalCatId = null

        if (catStr) {
          // Buscar si ya existe (ignorando mayúsculas/minúsculas)
          let catExistente = categoriasDB.find(c => c.nombre.toLowerCase() === catStr.toLowerCase())
          
          if (catExistente) {
            finalCatId = catExistente.id
          } else {
            // Si no existe, la creamos en la base de datos
            try {
              const nuevaCat = await createCategoria({ nombre: catStr })
              categoriasDB.push(nuevaCat) // Guardamos en memoria para no volver a crearla en la siguiente fila
              finalCatId = nuevaCat.id
            } catch (err) {
              console.error(`Error creando categoría ${catStr}:`, err)
            }
          }
        }

        if (nombre) {
          try {
            await upsertContacto({
              nombre_negocio: String(nombre),
              whatsapp: whatsapp ? String(whatsapp) : null,
              ubicacion: ubicacion ? String(ubicacion) : null,
              tiene_web: tieneWeb,
              categoria_id: finalCatId
            })
            creados++
          } catch (err) {
            console.error(`Error importando ${nombre}:`, err)
          }
        }
      }

      alert(`¡Éxito! Se importaron ${creados} contactos nuevos desde el Excel.`)
      if (onImported) onImported()

    } catch (error) {
      console.error(error)
      alert("Ocurrió un error al leer el archivo Excel.")
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      <button
        type="button"
        disabled={importing}
        onClick={() => fileInputRef.current?.click()}
        className="bg-green-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
      >
        {importing ? 'Importando...' : 'Importar Excel'}
      </button>
    </>
  )
}
