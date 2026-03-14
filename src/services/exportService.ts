import { api } from './api'
import * as XLSX from 'xlsx'

/**
 * Helper to fetch all pages of data from a paginated DRF endpoint
 */
const fetchAll = async (endpoint: string, params: Record<string, any> = {}) => {
  let results: any[] = []
  let page = 1
  let hasNext = true

  while (hasNext) {
    const response = await api.get(endpoint, {
      params: { ...params, page, limit: 100 },
    })
    
    // DRF standard response structure
    const data = response.data
    results = [...results, ...(data.results || [])]
    hasNext = !!data.next
    page++
  }
  return results
}

/**
 * Triggers browser download of an XLSX or CSV file
 */
const saveFile = (data: any[], filename: string, format: 'csv' | 'excel', sheetName: string) => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  
  if (format === 'excel') {
    XLSX.writeFile(wb, `${filename}.xlsx`)
  } else {
    XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' })
  }
}

export const exportService = {
  exportSales: async (format: 'csv' | 'excel', startDate?: string, endDate?: string) => {
    const filters: any = {}
    if (startDate) filters.start_date = startDate
    if (endDate) filters.end_date = endDate
    
    const results = await fetchAll('/api/sales/', filters)
    
    const exportData = results.map(sale => ({
      'ID Venta': sale.id,
      'Cliente': sale.customer,
      'Fecha': new Date(sale.created_at).toLocaleString(),
      'Estado': sale.status,
      'Total': sale.total,
      'Metodo Pago': sale.payment_method,
      'Vendedor': sale.created_by
    }))
    
    saveFile(exportData, 'ventas', format, 'Ventas')
  },

  exportPurchases: async (format: 'csv' | 'excel', startDate?: string, endDate?: string) => {
    // Switch to /api/purchases/ which uses PurchaseSerializer (rich data)
    const results = await fetchAll('/api/purchases/', { 
      start_date: startDate,
      end_date: endDate
    })
    
    const exportData = results.map(p => ({
      'ID': p.id,
      'Proveedor': p.supplier?.name || 'N/A',
      'Producto': p.variant?.product?.name || 'N/A',
      'Variante': `${p.variant?.color || ''} - ${p.variant?.size || ''}`,
      'Cantidad': p.quantity,
      'Costo Unit.': p.unit_cost,
      'Total': p.total_cost,
      'Fecha': new Date(p.created_at).toLocaleString(),
      'Observacion': p.observation
    }))
    
    saveFile(exportData, 'compras', format, 'Compras')
  },

  exportInventory: async (format: 'csv' | 'excel') => {
    const results = await fetchAll('/api/product-variants/')
    
    const exportData = results.map(v => ({
      'Producto': v.product_name,
      'Color': v.color,
      'Talla': v.size,
      'Género': v.gender,
      'Stock Actual': v.stock,
      'Precio Venta': v.price,
      'Costo': v.cost
    }))
    
    saveFile(exportData, 'inventario', format, 'Inventario')
  },

  exportProducts: async (format: 'csv' | 'excel') => {
    const results = await fetchAll('/api/products/')
    
    const exportData = results.map(p => ({
      'ID': p.id,
      'Nombre': p.name,
      'Marca': p.brand,
      'Tipo': p.product_type,
      'Descripción': p.description,
      'Estado': p.active ? 'Activo' : 'Inactivo',
      'Fecha Creación': new Date(p.created_at).toLocaleDateString()
    }))
    
    saveFile(exportData, 'productos', format, 'Productos')
  },

  exportMovements: async (format: 'csv' | 'excel', startDate?: string, endDate?: string) => {
    const filters: any = {}
    if (startDate) filters.start_date = startDate
    if (endDate) filters.end_date = endDate
    
    // Switch to /api/inventory-history/ which uses InventoryHistorySerializer
    const results = await fetchAll('/api/inventory-history/', filters)
    
    const exportData = results.map(m => ({
      'ID': m.id,
      'Tipo': m.movement_type_display || m.movement_type,
      'Producto': m.product,
      'Variante': `${m.variant_color} - ${m.variant_size}`,
      'Proveedor': m.supplier_name || 'N/A',
      'Cantidad': m.quantity,
      'Observación': m.observation,
      'Fecha': new Date(m.created_at).toLocaleString(),
      'Usuario': m.created_by
    }))
    
    saveFile(exportData, 'movimientos', format, 'Movimientos')
  },

  exportSuppliersReport: async (format: 'csv' | 'excel') => {
    const results = await fetchAll('/api/suppliers/')
    
    const exportData = results.map(s => ({
      'ID': s.id,
      'Nombre': s.name,
      'NIT': s.nit,
      'Celular': s.phone,
      'Email': s.email,
      'Dirección': s.address,
      'Estado': s.is_active ? 'Activo' : 'Inactivo'
    }))
    
    saveFile(exportData, 'reporte-proveedores', format, 'Proveedores')
  },
}
