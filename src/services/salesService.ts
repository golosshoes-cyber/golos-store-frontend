import { Sale, ApiResponse } from '../types'
import { api } from './api'

const SALE_STATUS_MAP: Record<string, string> = {
  '': '',
  'pending': 'pending',
  'confirmed': 'active',
  'completed': 'completed',
  'canceled': 'canceled',
}

const mapParams = (params?: Record<string, any>): Record<string, any> =>
  Object.fromEntries(
    Object.entries(params || {})
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .map(([key, value]) =>
        key === 'status' && SALE_STATUS_MAP[value as string]
          ? [key, SALE_STATUS_MAP[value as string]]
          : [key, value]
      )
  )

export const salesService = {
  getSales: async (params?: any): Promise<ApiResponse<Sale>> => {
    const response = await api.get('/api/sales/', { params: mapParams(params) })
    return response.data
  },

  getRecentSales: async (limit: number = 10): Promise<Sale[]> => {
    const response = await api.get(`/api/sales/?limit=${limit}&ordering=-created_at`)
    return response.data
  },

  createSale: async (saleData: {
    customer: string;
    is_order?: boolean;
    payment_method: 'CASH' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'TRANSFER' | 'PSE' | 'OTHER';
    payment_reference?: string;
    invoice_required?: boolean;
    invoicing_method?: 'NONE' | 'AUTOMATIC' | 'MANUAL';
    created_by?: string;
  }): Promise<Sale> => {
    const response = await api.post('/api/sales/', saleData)
    return response.data
  },

  createSaleDetail: async (detailData: {
    sale: number;
    variant: number;
    quantity: number;
    price: number;
  }): Promise<any> => {
    const response = await api.post('/api/sale-details/', detailData)
    return response.data
  },

  confirmSale: async (saleId: number, options?: { invoicing_method?: string }): Promise<Sale> => {
    const response = await api.post(`/api/sales/${saleId}/confirm/`, options)
    return response.data
  },

  cancelSale: async (saleId: number): Promise<Sale> => {
    const response = await api.post(`/api/sales/${saleId}/cancel/`)
    return response.data
  },
}
