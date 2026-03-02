import { api } from './api'

export interface Purchase {
  id: number
  movement_type: string
  quantity: number
  unit_cost: number
  total_cost: number
  observation?: string
  created_at: string
  variant: {
    id: number
    product: {
      id: number
      name: string
      sku: string
    }
    size: string
    color: string
    gender: string
  }
  supplier: {
    id: number
    name: string
    nit: string
  } | null
}

export interface PurchaseFilters {
  supplier?: string
  product?: string
  start_date?: string
  end_date?: string
  ordering?: string
  page?: number
  search?: string
}

export const purchaseService = {
  getPurchases: async (filters: PurchaseFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    const response = await api.get(`/api/purchases/?${params}`)
    return response.data
  },

  getPurchase: async (id: number) => {
    const response = await api.get(`/api/purchases/${id}/`)
    return response.data
  },

  getPurchaseStats: async (filters: PurchaseFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    const response = await api.get(`/api/purchases/purchase_stats/?${params}`)
    return response.data
  },

  getSupplierPurchases: async (supplierId: number) => {
    const response = await api.get(`/api/purchases/supplier_purchases/?supplier_id=${supplierId}`)
    return response.data
  },

  reversePurchase: async (id: number, reason: string) => {
    const response = await api.post(`/api/purchases/${id}/reverse_purchase/`, { reason })
    return response.data
  }
}
