import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from './contexts/AuthContext'
import type { User } from './types'
import { storeService } from './services/storeService'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { useStockWebsocket } from './hooks/useStockWebsocket'

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'))
const SalesPage = lazy(() => import('./pages/sales/SalesPage'))
const InventoryPage = lazy(() => import('./pages/inventory/InventoryPage'))
const PurchasePage = lazy(() => import('./pages/purchases/PurchasePage'))
const SuppliersPage = lazy(() => import('./pages/suppliers/SuppliersPage'))
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'))
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'))
const GroupsManagement = lazy(() => import('./pages/admin/GroupsManagement'))
const FinancePage = lazy(() => import('./pages/admin/FinancePage'))
const ReceivablesPage = lazy(() => import('./pages/receivables/ReceivablesPage'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))
const StoreOpsPage = lazy(() => import('./pages/store-ops/StoreOpsPage'))

const extractGroupNames = (user: User | null): string[] => {
  if (!user || !Array.isArray(user.groups)) return []

  return user.groups
    .map((group: any) => {
      if (typeof group === 'string') return group
      if (group && typeof group === 'object' && typeof group.name === 'string') return group.name
      return ''
    })
    .filter(Boolean)
}

const canAccessManagement = (user: User | null): boolean => {
  if (!user) return false
  if (user.is_staff || user.is_superuser) return true

  const groupNames = extractGroupNames(user)
  return groupNames.some((name) => ['Managers', 'Sales', 'Inventory'].includes(name))
}

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const managementAccess = canAccessManagement(user)

  // Conectar WebSockets para actualizaciones de stock en tiempo real
  useStockWebsocket()

  useEffect(() => {
    let mounted = true

    const setFavicon = (faviconUrl: string) => {
      const resolvedUrl = faviconUrl.trim()
      if (!resolvedUrl) return
      let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null
      if (!faviconLink) {
        faviconLink = document.createElement('link')
        faviconLink.rel = 'icon'
        document.head.appendChild(faviconLink)
      }
      faviconLink.href = resolvedUrl
    }

    const loadBrandingForFavicon = async () => {
      try {
        const response = await storeService.getBranding()
        if (!mounted) return
        setFavicon(response.branding.favicon_url || response.branding.logo_url || '')
      } catch {
        // Si branding no está disponible, se mantiene el favicon actual.
      }
    }

    void loadBrandingForFavicon()

    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        Cargando...
      </Box>
    )
  }

  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          Cargando...
        </Box>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : managementAccess ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/*"
          element={
            isAuthenticated && managementAccess ? (
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="inventory/products" element={<ProductsPage />} />
                  <Route path="sales/orders" element={<SalesPage />} />
                  <Route path="sales/receivables" element={<ReceivablesPage />} />
                  <Route path="inventory/stock" element={<InventoryPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="inventory/purchases" element={<PurchasePage />} />
                  <Route path="inventory/suppliers" element={<SuppliersPage />} />

                  <Route
                    path="settings/store"
                    element={
                      <ProtectedRoute
                        requiredPermissions={['inventory.change_sale']}
                        fallback={<Navigate to="/dashboard" replace />}
                      >
                        <StoreOpsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="analytics/reports"
                    element={
                      <ProtectedRoute
                        requiredPermissions={['inventory.view_sale', 'auth.view_user']}
                        fallback={<Navigate to="/dashboard" replace />}
                      >
                        <ReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings/users"
                    element={
                      <ProtectedRoute
                        requiredPermissions={['auth.view_user']}
                        fallback={<Navigate to="/dashboard" replace />}
                      >
                        <UsersManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings/groups"
                    element={
                      <ProtectedRoute
                        requiredPermissions={['auth.view_group']}
                        fallback={<Navigate to="/dashboard" replace />}
                      >
                        <GroupsManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="analytics/finance"
                    element={
                      <ProtectedRoute
                        requiredPermissions={['inventory.view_financialtransaction']}
                        fallback={<Navigate to="/dashboard" replace />}
                      >
                        <FinancePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  )
}

export default App
