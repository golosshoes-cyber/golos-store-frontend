import { api } from './api'
import type {
  CustomerEntity,
  AccountReceivable,
  ReceivableSummary,
  ApiResponse,
} from '../types'

export const receivableService = {
  // ─── Customers ──────────────────────────────────────────────────────────────
  getCustomers: async (params?: Record<string, any>): Promise<ApiResponse<CustomerEntity>> => {
    const response = await api.get('/api/customers/', { params })
    return response.data
  },

  getCustomer: async (id: number): Promise<CustomerEntity> => {
    const response = await api.get(`/api/customers/${id}/`)
    return response.data
  },

  createCustomer: async (data: Partial<CustomerEntity>): Promise<CustomerEntity> => {
    const response = await api.post('/api/customers/', data)
    return response.data
  },

  updateCustomer: async (id: number, data: Partial<CustomerEntity>): Promise<CustomerEntity> => {
    const response = await api.patch(`/api/customers/${id}/`, data)
    return response.data
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await api.delete(`/api/customers/${id}/`)
  },

  getCustomerBalance: async (id: number): Promise<any> => {
    const response = await api.get(`/api/customers/${id}/balance/`)
    return response.data
  },

  // ─── Accounts Receivable ──────────────────────────────────────────────────
  getReceivables: async (params?: Record<string, any>): Promise<ApiResponse<AccountReceivable>> => {
    const response = await api.get('/api/accounts-receivable/', { params })
    return response.data
  },

  getReceivable: async (id: number): Promise<AccountReceivable> => {
    const response = await api.get(`/api/accounts-receivable/${id}/`)
    return response.data
  },

  createReceivable: async (data: {
    sale_id: number
    customer_id: number
    due_date?: string | null
    notes?: string
  }): Promise<AccountReceivable> => {
    const response = await api.post('/api/accounts-receivable/', data)
    return response.data
  },

  registerPayment: async (
    receivableId: number,
    data: {
      amount: number
      payment_method?: string
      payment_reference?: string
      notes?: string
    }
  ): Promise<any> => {
    const response = await api.post(
      `/api/accounts-receivable/${receivableId}/register-payment/`,
      data
    )
    return response.data
  },

  writeOff: async (receivableId: number, reason: string): Promise<any> => {
    const response = await api.post(
      `/api/accounts-receivable/${receivableId}/write-off/`,
      { reason }
    )
    return response.data
  },

  getSummary: async (): Promise<ReceivableSummary> => {
    const response = await api.get('/api/accounts-receivable/summary/')
    return response.data
  },
}
