import { api } from './api'
import type {
  DjangoUser,
  DjangoGroup,
  DjangoPermission,
  UserCreateRequest,
  UserUpdateRequest,
  UserListResponse,
  GroupListResponse,
  GroupCreateRequest,
  GroupUpdateRequest,
} from '../types/auth'

export const userService = {
  // Usuarios
  getUsers: async (params?: {
    page?: number
    search?: string
    groups?: string[]
    is_active?: boolean
  }): Promise<UserListResponse> => {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString())
    if (params?.groups?.length) {
      params.groups.forEach(group => searchParams.append('groups', group))
    }

    const response = await api.get(`/api/users/?${searchParams.toString()}`)
    return response.data
  },

  getUser: async (id: number): Promise<DjangoUser> => {
    const response = await api.get(`/api/users/${id}/`)
    return response.data
  },

  createUser: async (userData: UserCreateRequest): Promise<DjangoUser> => {
    const payload: any = { ...userData }
    if (userData.groups !== undefined) {
      payload.group_ids = userData.groups
      delete payload.groups
    }
    const response = await api.post('/api/users/', payload)
    return response.data
  },

  updateUser: async (id: number, userData: UserUpdateRequest): Promise<DjangoUser> => {
    const payload: any = { ...userData }
    if (userData.groups !== undefined) {
      payload.group_ids = userData.groups
      delete payload.groups
    }
    const response = await api.put(`/api/users/${id}/`, payload)
    return response.data
  },

  patchUser: async (id: number, userData: Partial<UserUpdateRequest>): Promise<DjangoUser> => {
    const payload: any = { ...userData }
    if (userData.groups !== undefined) {
      payload.group_ids = userData.groups
      delete payload.groups
    }
    const response = await api.patch(`/api/users/${id}/`, payload)
    return response.data
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/api/users/${id}/`)
  },

  activateUser: async (id: number): Promise<DjangoUser> => {
    const response = await api.patch(`/api/users/${id}/`, { is_active: true })
    return response.data
  },

  deactivateUser: async (id: number): Promise<DjangoUser> => {
    const response = await api.patch(`/api/users/${id}/`, { is_active: false })
    return response.data
  },

  // Grupos
  getGroups: async (): Promise<GroupListResponse> => {
    const response = await api.get('/api/groups/')
    return response.data
  },

  getGroup: async (id: number): Promise<DjangoGroup> => {
    const response = await api.get(`/api/groups/${id}/`)
    return response.data
  },

  createGroup: async (groupData: GroupCreateRequest): Promise<DjangoGroup> => {
    const payload = {
      name: groupData.name,
      permission_ids: groupData.permissions || [],
    }
    const response = await api.post('/api/groups/', payload)
    return response.data
  },

  updateGroup: async (id: number, groupData: GroupUpdateRequest): Promise<DjangoGroup> => {
    const payload: any = { ...groupData }
    if (groupData.permissions !== undefined) {
      payload.permission_ids = groupData.permissions
      delete payload.permissions
    }
    const response = await api.put(`/api/groups/${id}/`, payload)
    return response.data
  },

  patchGroup: async (id: number, groupData: GroupUpdateRequest): Promise<DjangoGroup> => {
    const payload: any = { ...groupData }
    if (groupData.permissions !== undefined) {
      payload.permission_ids = groupData.permissions
      delete payload.permissions
    }
    const response = await api.patch(`/api/groups/${id}/`, payload)
    return response.data
  },

  deleteGroup: async (id: number): Promise<void> => {
    await api.delete(`/api/groups/${id}/`)
  },

  getPermissions: async (): Promise<DjangoPermission[]> => {
    try {
      const response = await api.get('/api/permissions/')
      const data = response.data
      if (Array.isArray(data)) return data
      if (data?.results && Array.isArray(data.results)) return data.results
      return []
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  // Asignación de grupos a usuarios
  assignGroupsToUser: async (userId: number, groupIds: number[]): Promise<DjangoUser> => {
    const response = await api.post(`/api/users/${userId}/groups/`, { groups: groupIds })
    return response.data
  },

  removeGroupFromUser: async (userId: number, groupId: number): Promise<DjangoUser> => {
    const response = await api.delete(`/api/users/${userId}/groups/${groupId}/`)
    return response.data
  },

  // Obtener usuarios por grupo
  getUsersByGroup: async (groupName: string): Promise<DjangoUser[]> => {
    const response = await api.get(`/api/users/?groups=${groupName}`)
    return response.data.results
  },

  // Obtener grupos de un usuario
  getUserGroups: async (userId: number): Promise<DjangoGroup[]> => {
    const response = await api.get(`/api/users/${userId}/groups/`)
    return response.data
  },

  // Obtener permisos de un usuario
  getUserPermissions: async (userId: number): Promise<any[]> => {
    const response = await api.get(`/api/users/${userId}/permissions/`)
    return response.data
  },

  // Cambiar contraseña
  changePassword: async (userId: number, passwords: { old_password: string; new_password: string }): Promise<void> => {
    await api.post(`/api/users/${userId}/change_password/`, passwords)
  },

  // Resetear contraseña (admin)
  resetPassword: async (userId: number, new_password: string): Promise<void> => {
    await api.post(`/api/users/${userId}/reset_password/`, { new_password })
  }
}
