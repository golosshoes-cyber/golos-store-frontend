import { DashboardStats, Sale, ApiResponse } from '../types'
import { api } from './api'

const unwrap = <T extends Record<string, any>>(payload: T): T => {
  if (payload && typeof payload === 'object' && 'detail' in payload && 'code' in payload) {
    return payload
  }
  return payload
}

// TODO: Implementar servicios de dashboard
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/dashboard/overview/')
    return unwrap(response.data) as DashboardStats
  },

  getLowStockProducts: async () => {
    const response = await api.get('/api/dashboard/low_stock/')
    return unwrap(response.data)
  },

  getSales: async (params?: any): Promise<ApiResponse<Sale>> => {
    // Mapear los estados del frontend a los que el backend espera
    const statusMapping: { [key: string]: string } = {
      '': '', // Todas
      'pending': 'pending',
      'confirmed': 'active', // El backend no acepta 'confirmed'
      'completed': 'completed',
      'canceled': 'canceled',
    }
    
    // Filtrar y mapear parámetros
    const filteredParams = Object.fromEntries(
      Object.entries(params || {})
        .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        .map(([key, value]) => {
          // Mapear el status si existe en el mapeo
          if (key === 'status' && statusMapping[value as string]) {
            return [key, statusMapping[value as string]]
          }
          return [key, value]
        })
    )
    
    const response = await api.get('/api/sales/', { params: filteredParams })
    return response.data
  },

  getRecentSales: async (limit: number = 10): Promise<Sale[]> => {
    const response = await api.get(`/api/sales/?limit=${limit}&ordering=-created_at`)
    return response.data
  },

  getRecentMovements: async (limit: number = 20): Promise<any> => {
    const response = await api.get(`/api/dashboard/recent_movements/?limit=${limit}`)
    const data = unwrap(response.data)
    return {
      movements: data.movements || [],
      count: data.count || 0,
    }
  },

  getTopProducts: async (period: string = 'month'): Promise<any> => {
    const response = await api.get(`/api/dashboard/top_products/?period=${period}`)
    const data = unwrap(response.data)
    return {
      products: (data.by_quantity || []).map((item: any, index: number) => ({
        id: index + 1,
        product_name: item.variant__product__name || 'Producto',
        total_sold: Math.abs(Number(item.total_quantity || 0)),
        revenue: 0,
      })),
    }
  },

  getSupplierPerformance: async (days: number = 90): Promise<any> => {
    const response = await api.get(`/api/dashboard/supplier_performance/?days=${days}`)
    const data = unwrap(response.data)
    return {
      suppliers: data.suppliers || [],
      count: data.count || 0,
    }
  },

  getSalesChart: async (days: number = 30): Promise<any> => {
    const response = await api.get(`/api/dashboard/sales_chart/?days=${days}`)
    const data = unwrap(response.data)
    return {
      chart_data: (data.sales || []).map((item: any) => ({
        date: item.day,
        total: Number(item.total || 0),
      })),
    }
  },

  createSale: async (saleData: {
    customer: string;
    is_order?: boolean;
    payment_method: 'CASH' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'TRANSFER' | 'PSE' | 'OTHER';
    payment_reference?: string;
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

  confirmSale: async (saleId: number): Promise<Sale> => {
    const response = await api.post(`/api/sales/${saleId}/confirm/`)
    return response.data
  },

  cancelSale: async (saleId: number): Promise<Sale> => {
    const response = await api.post(`/api/sales/${saleId}/cancel/`)
    return response.data
  },
}
