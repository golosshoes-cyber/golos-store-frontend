import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials } from '../types'
import { authService } from '../services/authService'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error('Error fetching current user:', error)
          authService.logout()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: (user?.is_superuser === true) || false,
    isStaff: user?.is_staff || false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
