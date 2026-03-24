import { api } from './api'

export const notificationService = {
  getLowStockAlerts: async (threshold?: number) => {
    const response = await api.get('/api/notifications/low_stock_alerts/', {
      params: threshold ? { threshold } : undefined,
    })
    return response.data
  },

  getUserAlerts: async () => {
    const response = await api.get('/api/notifications/user_alerts/')
    return response.data
  },

  markAlertAsRead: async (id: number) => {
    const response = await api.post(`/api/notifications/${id}/mark_read/`)
    return response.data
  },

  getDailySummary: async () => {
    const response = await api.get('/api/notifications/daily_summary/')
    return response.data
  },

  getSupplierRecommendations: async () => {
    const response = await api.get('/api/notifications/supplier_recommendations/')
    return response.data
  },

  getMovementAnomalies: async (days = 7) => {
    const response = await api.get('/api/notifications/movement_anomalies/', {
      params: { days },
    })
    return response.data
  },

  getPerformanceMetrics: async () => {
    const response = await api.get('/api/notifications/performance_metrics/')
    return response.data
  },
}
