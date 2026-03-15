import { api } from './api'

export interface FinancialCategory {
  id: number
  name: string
  description?: string
  is_income: boolean
  is_active: boolean
}

export interface FinancialTransaction {
  id: number
  session?: number
  category?: number
  category_name?: string
  amount: string
  transaction_type: 'income' | 'expense'
  description: string
  sale?: number
  payment_method: string
  created_at: string
  created_by: string
}

export interface CashSession {
  id: number
  opened_at: string
  opened_by: string
  initial_balance: string
  closed_at?: string
  closed_by?: string
  expected_balance?: string
  actual_balance?: string
  difference?: string
  notes?: string
  status: 'open' | 'closed'
  transactions?: FinancialTransaction[]
}

export const financeService = {
  // Categorías
  getCategories: async (params = {}) => {
    const response = await api.get('/api/financial-categories/', { params })
    return response.data
  },
  createCategory: async (data: Partial<FinancialCategory>) => {
    const response = await api.post('/api/financial-categories/', data)
    return response.data
  },
  updateCategory: async (id: number, data: Partial<FinancialCategory>) => {
    const response = await api.patch(`/api/financial-categories/${id}/`, data)
    return response.data
  },
  deleteCategory: async (id: number) => {
    await api.delete(`/api/financial-categories/${id}/`)
  },

  // Transacciones
  getTransactions: async (params = {}) => {
    const response = await api.get('/api/financial-transactions/', { params })
    return response.data
  },
  createTransaction: async (data: Partial<FinancialTransaction>) => {
    const response = await api.post('/api/financial-transactions/', data)
    return response.data
  },

  // Sesiones de Caja
  getSessions: async (params = {}) => {
    const response = await api.get('/api/cash-sessions/', { params })
    return response.data
  },
  getSession: async (id: number) => {
    const response = await api.get(`/api/cash-sessions/${id}/`)
    return response.data
  },
  getCurrentSession: async () => {
    try {
      const response = await api.get('/api/cash-sessions/current/')
      return response.data || null
    } catch (error: any) {
      if (error.response?.status === 404) return null
      throw error
    }
  },
  openSession: async (data: { initial_balance: number; notes?: string }) => {
    const response = await api.post('/api/cash-sessions/open_session/', data)
    return response.data
  },
  closeSession: async (id: number, data: { actual_balance: number; notes?: string }) => {
    const response = await api.post(`/api/cash-sessions/${id}/close_session/`, data)
    return response.data
  }
}
