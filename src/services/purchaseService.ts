import { api } from './api'

import type { Purchase, PurchaseFilters } from '../types/purchases'

export const purchaseService = {
  getPurchases: async (page: number = 1, filters: PurchaseFilters = {}): Promise<{ count: number, results: Purchase[] }> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    const response = await api.get(`/api/purchases/?${params}`)
    return response.data
  },

  getPurchase: async (id: number): Promise<Purchase> => {
    const response = await api.get(`/api/purchases/${id}/`)
    return response.data
  },

  getPurchaseStats: async (filters: PurchaseFilters = {}): Promise<any> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    const response = await api.get(`/api/purchases/purchase_stats/?${params}`)
    return response.data
  },

  getSupplierPurchases: async (supplierId: number): Promise<Purchase[]> => {
    const response = await api.get(`/api/purchases/supplier_purchases/?supplier_id=${supplierId}`)
    return response.data
  },

  reversePurchase: async (id: number, reason: string = 'Anulación desde el dashboard') => {
    const response = await api.post(`/api/purchases/${id}/reverse_purchase/`, { reason })
    return response.data
  }
}
