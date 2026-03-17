import { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { storeService } from '../../services/storeService'
import { useAuth } from '../../contexts/AuthContext'
import type { StoreBranding } from '../../types/store'
import MaintenancePage from '../../pages/store/MaintenancePage'

interface StoreMaintenanceGuardProps {
  children: ReactNode
}

export default function StoreMaintenanceGuard({ children }: StoreMaintenanceGuardProps) {
  const { isAdmin } = useAuth()
  const location = useLocation()
  
  const [branding, setBranding] = useState<StoreBranding | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const loadBranding = async () => {
      try {
        const response = await storeService.getBranding()
        if (mounted) {
          setBranding(response.branding)
        }
      } catch (error) {
        console.error('Failed to load branding in guard:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    void loadBranding()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={24} color="inherit" />
      </Box>
    )
  }

  // Si el modo mantenimiento esta activo y el usuario NO es staff/superuser
  // Permitimos bypass para administradores para que puedan ver los cambios
  const isMaintenanceActive = branding?.maintenance_mode === true
  
  // Evitar bucle infinito si ya estamos en una pagina legal o de login
  const isExcludedPath = ['/store/login', '/store/register', '/store/terms', '/store/privacy'].includes(location.pathname)

  if (isMaintenanceActive && !isAdmin && !isExcludedPath) {
    return <MaintenancePage branding={branding || undefined} />
  }

  return <>{children}</>
}
