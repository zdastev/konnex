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
        // Buscamos columnas comunes por si las nombran diferente
        const nombre = row['Nombre'] || row['nombre'] || row['Nombre del negocio'] || row['Negocio']
        const whatsapp = row['WhatsApp'] || row['whatsapp'] || row['Telefono'] || row['telefono'] || row['Celular']
        const ubicacion = row['Ubicacion'] || row['Ubicación'] || row['ubicacion'] || row['Direccion']
        
        // Detectar página web
        const webRaw = row['Web'] || row['Página Web'] || row['Pagina Web'] || row['Tiene Web'] || row['Website'] || ''
        const webStr = String(webRaw).toLowerCase().trim()
        const tieneWeb = webStr === 'si' || webStr === 'sí' || webStr === 'true' || webStr === '1' || webStr.includes('http') || webStr.includes('www')

        // Detectar y procesar Categoría
        const catRaw = row['Categoria'] || row['Categoría'] || row['categoria'] || row['Giro'] || ''
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
          await createContacto({
            nombre_negocio: String(nombre),
            whatsapp: whatsapp ? String(whatsapp) : null,
            ubicacion: ubicacion ? String(ubicacion) : null,
            tiene_web: tieneWeb,
            categoria_id: finalCatId
          })
          creados++
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
