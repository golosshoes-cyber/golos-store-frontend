import { api } from './api'
import { LoginCredentials, AuthResponse, User } from '../types'

// TODO: Implementar servicios de autenticación
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/token/', credentials)
    return response.data
  },

  refreshToken: async (refresh: string): Promise<AuthResponse> => {
    const response = await api.post('/api/token/refresh/', { refresh })
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/users/me/')
    return response.data
  },

  getCurrentUserGroups: async (): Promise<any[]> => {
    const response = await api.get('/api/users/me/groups/')
    return response.data
  },

  updateCurrentUser: async (payload: Partial<User>): Promise<User> => {
    const response = await api.patch('/api/users/me/', payload)
    return response.data
  },

  changeMyPassword: async (old_password: string, new_password: string): Promise<void> => {
    await api.post('/api/users/me/change-password/', { old_password, new_password })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}
