import { DashboardStats } from '../types'
import { api } from './api'

const unwrap = <T extends Record<string, any>>(payload: T): T => {
  if (payload && typeof payload === 'object' && 'detail' in payload && 'code' in payload) {
    return payload
  }
  return payload
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/dashboard/overview/')
    return unwrap(response.data) as DashboardStats
  },

  getLowStockProducts: async () => {
    const response = await api.get('/api/dashboard/low_stock/')
    return unwrap(response.data)
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

}
