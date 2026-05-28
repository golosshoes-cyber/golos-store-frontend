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
  },

  createPurchase: async (items: {variantId: number, quantity: number, unitCost: number, supplierId?: number}[], paymentMethod: string = 'none') => {
    const itemsBySupplier: Record<number, any[]> = {}

    for (const item of items) {
      const supplierId = item.supplierId || 1
      if (!itemsBySupplier[supplierId]) {
        itemsBySupplier[supplierId] = []
      }
      itemsBySupplier[supplierId].push({
        variant: item.variantId,
        quantity: item.quantity
      })
    }

    let lastResponse = null
    for (const [supplierIdStr, supplierItems] of Object.entries(itemsBySupplier)) {
      const supplierId = parseInt(supplierIdStr)
      lastResponse = await api.post('/api/purchases/bulk_purchase/', {
        supplier: supplierId,
        items: supplierItems,
        payment_method: paymentMethod
      })
    }

    return lastResponse?.data
  },
}
