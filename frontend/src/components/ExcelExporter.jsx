import { useState } from 'react'
import * as XLSX from 'xlsx'
import { fetchBackup } from '../services/api'

export default function ExcelExporter() {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await fetchBackup()

      // Formatear Contactos
      const contactosData = data.contactos.map(c => ({
        'ID': c.id,
        'Nombre del Negocio': c.nombre_negocio,
        'WhatsApp': c.whatsapp || '',
        'Ubicación': c.ubicacion || '',
        'Categoría': c.categoria_nombre || '',
        'Tiene Web': c.tiene_web ? 'Sí' : 'No',
        'Fecha Registro': new Date(c.created_at).toLocaleString()
      }))

      // Formatear Agenda
      const agendaData = data.agenda.map(a => ({
        'Negocio': a.nombre_negocio || 'Desconocido',
        'Producto/Servicio': a.producto_nombre || '',
        'Tipo de Seguimiento': a.tipo,
        'Fecha Programada': new Date(a.fecha).toLocaleString(),
        'Estado': a.completado ? 'Completado' : 'Pendiente',
        'Notas': a.notas || ''
      }))

      // Formatear Estados (Kanban)
      const estadosData = data.estados.map(e => ({
        'Negocio': e.nombre_negocio || 'Desconocido',
        'Producto/Servicio': e.producto_nombre || '',
        'Estado en Pipeline': e.estado ? e.estado.replace('_', ' ').toUpperCase() : '',
        'Última Nota': e.notas || '',
        'Última Actualización': new Date(e.updated_at).toLocaleString()
      }))

      const workbook = XLSX.utils.book_new()
      
      const wsContactos = XLSX.utils.json_to_sheet(contactosData.length ? contactosData : [{'Mensaje': 'No hay contactos'}])
      XLSX.utils.book_append_sheet(workbook, wsContactos, 'Contactos')

      const wsAgenda = XLSX.utils.json_to_sheet(agendaData.length ? agendaData : [{'Mensaje': 'No hay agenda'}])
      XLSX.utils.book_append_sheet(workbook, wsAgenda, 'Agenda')

      const wsEstados = XLSX.utils.json_to_sheet(estadosData.length ? estadosData : [{'Mensaje': 'No hay estados'}])
      XLSX.utils.book_append_sheet(workbook, wsEstados, 'Estados (Kanban)')

      const today = new Date().toISOString().split('T')[0]
      const fileName = `Konnex_Backup_Completo_${today}.xlsx`

      XLSX.writeFile(workbook, fileName)
      
    } catch (error) {
      console.error("Error al exportar:", error)
      alert("Ocurrió un error al generar el backup.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
    >
      {exporting ? 'Exportando...' : 'Respaldo Excel'}
    </button>
  )
}
