import { api } from './api'
import { Supplier } from '../types'

// TODO: Implementar servicios de proveedores
export const supplierService = {
  // Servicios para Proveedores
  getSuppliers: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<{ count: number; next?: string; previous?: string; results: Supplier[] }> => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())
    if (params.search) query.append('search', params.search)
    const response = await api.get(`/api/suppliers/?${query.toString()}`)
    return response.data
  },

  getSupplier: async (id: number): Promise<Supplier> => {
    const response = await api.get(`/api/suppliers/${id}/`)
    return response.data
  },

  createSupplier: async (supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await api.post('/api/suppliers/', supplier)
    return response.data
  },

  updateSupplier: async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await api.put(`/api/suppliers/${id}/`, supplier)
    return response.data
  },

  deleteSupplier: async (id: number): Promise<void> => {
    await api.delete(`/api/suppliers/${id}/`)
  },
}
