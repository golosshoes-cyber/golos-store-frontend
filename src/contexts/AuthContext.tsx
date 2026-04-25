import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials } from '../types'
import { authService } from '../services/authService'

/**
 * Cookie compartida con el public store (golosshoes.com) para bypass del
 * modo mantenimiento. El public store la lee en SSR y, si esta presente,
 * renderiza la tienda normal aunque maintenance_mode=true.
 *
 * - Domain=.golosshoes.com → la comparten admin.golosshoes.com y golosshoes.com
 * - 7 dias de vigencia, refresh implicito en cada login
 * - Valor "1": no es un secreto, solo una bandera. Bypass = ver la tienda
 *   normalmente (que de todos modos es publica), no es informacion sensible.
 *
 * En desarrollo local (http://localhost) la cookie no se setea porque
 * `Secure` requiere HTTPS. No es un problema: el public store ya ignora
 * maintenance_mode cuando NODE_ENV === "development".
 */
const ADMIN_BYPASS_COOKIE = 'golos_admin_session'
const ADMIN_BYPASS_DOMAIN = '.golosshoes.com'
const ADMIN_BYPASS_MAX_AGE_S = 7 * 24 * 60 * 60

function setAdminBypassCookie() {
  if (typeof document === 'undefined') return
  // Solo en HTTPS prod (cookie con Secure no funciona en http localhost)
  if (window.location.protocol !== 'https:') return
  document.cookie = [
    `${ADMIN_BYPASS_COOKIE}=1`,
    `Domain=${ADMIN_BYPASS_DOMAIN}`,
    'Path=/',
    `Max-Age=${ADMIN_BYPASS_MAX_AGE_S}`,
    'Secure',
    'SameSite=Lax',
  ].join('; ')
}

function clearAdminBypassCookie() {
  if (typeof document === 'undefined') return
  if (window.location.protocol !== 'https:') return
  document.cookie = [
    `${ADMIN_BYPASS_COOKIE}=`,
    `Domain=${ADMIN_BYPASS_DOMAIN}`,
    'Path=/',
    'Max-Age=0',
    'Secure',
    'SameSite=Lax',
  ].join('; ')
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<any>
  verifyOtp: (username: string, otp_code: string) => Promise<void>
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
          // Refresh de la cookie de bypass — extiende su vida 7 dias mas en
          // cada apertura del admin con sesion valida.
          setAdminBypassCookie()
        } catch (error) {
          console.error('Error fetching current user:', error)
          authService.logout()
          clearAdminBypassCookie()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      
      // Si se requiere OTP (segundo factor), no establecemos el usuario todavía
      if (response.otp_required) {
        return response
      }

      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)

      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setAdminBypassCookie()
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const verifyOtp = async (username: string, otp_code: string) => {
    try {
      const response = await authService.verifyOtp(username, otp_code)

      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)

      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setAdminBypassCookie()
    } catch (error) {
      console.error('OTP verification error:', error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    clearAdminBypassCookie()
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
    verifyOtp,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: (user?.is_superuser === true) || false,
    isStaff: user?.is_staff || false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
