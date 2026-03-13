import axios from 'axios'

// Cliente separado para el refresh (sin interceptores)
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  headers: { 'Content-Type': 'application/json' },
})

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  headers: { 'Content-Type': 'application/json' },
})

// Helper para saber si un token expiró
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // ✅ 10 segundos de margen para evitar expiración en tránsito
    return payload.exp * 1000 < Date.now() + 10_000
  } catch {
    return true
  }
}

function redirectToLogin() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/login'
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken || isTokenExpired(refreshToken)) {
    redirectToLogin()
    return null
  }

  try {
    const response = await authApi.post('/api/token/refresh/', {
      refresh: refreshToken,
    })
    const { access } = response.data
    localStorage.setItem('access_token', access)
    return access
  } catch {
    redirectToLogin()
    return null
  }
}

// ✅ Interceptor request: renueva el access token ANTES de enviar la petición
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('access_token')

    // Si el access token expiró, intenta renovarlo antes de la petición
    if (token && isTokenExpired(token)) {
      token = await refreshAccessToken()
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor response: red de seguridad por si el servidor igual devuelve 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const newToken = await refreshAccessToken()
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      }
    }

    return Promise.reject(error)
  }
)