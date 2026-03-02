import { api } from './api'

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const toQueryParams = (params: Record<string, string | undefined>) => {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => Boolean(value)))
}

const download = async (
  endpoint: string,
  filename: string,
  params: Record<string, string | undefined>,
) => {
  const response = await api.get(endpoint, {
    params: toQueryParams(params),
    responseType: 'blob',
  })
  triggerDownload(response.data, filename)
}

export const exportService = {
  exportSales: async (format: 'csv' | 'excel', startDate?: string, endDate?: string) => {
    await download('/api/export/sales/', `ventas.${format === 'csv' ? 'csv' : 'xlsx'}`, {
      format,
      start_date: startDate,
      end_date: endDate,
    })
  },

  exportPurchases: async (format: 'csv' | 'excel', startDate?: string, endDate?: string) => {
    await download('/api/export/purchases/', `compras.${format === 'csv' ? 'csv' : 'xlsx'}`, {
      format,
      start_date: startDate,
      end_date: endDate,
    })
  },

  exportInventory: async (format: 'csv' | 'excel') => {
    await download('/api/export/inventory/', `inventario.${format === 'csv' ? 'csv' : 'xlsx'}`, {
      format,
    })
  },

  exportMovements: async (format: 'csv' | 'excel', startDate?: string, endDate?: string) => {
    await download('/api/export/movements/', `movimientos.${format === 'csv' ? 'csv' : 'xlsx'}`, {
      format,
      start_date: startDate,
      end_date: endDate,
    })
  },

  exportSuppliersReport: async (format: 'csv' | 'excel', days = '90') => {
    await download('/api/export/suppliers_report/', `reporte-proveedores.${format === 'csv' ? 'csv' : 'xlsx'}`, {
      format,
      days,
    })
  },
}
