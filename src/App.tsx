import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Box } from '@mui/material'
import { useAuth } from './contexts/AuthContext'
import type { User } from './types'
import { storeService } from './services/storeService'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import PageTransition from './components/common/PageTransition'
import StoreMaintenanceGuard from './components/store/StoreMaintenanceGuard'

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const PostLoginChoicePage = lazy(() => import('./pages/auth/PostLoginChoicePage'))
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
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))
const StorePage = lazy(() => import('./pages/store/StorePage'))
const WishlistPage = lazy(() => import('./pages/store/WishlistPage'))
const ProductDetailPage = lazy(() => import('./pages/store/ProductDetailPage'))
const StoreLoginPage = lazy(() => import('./pages/store/StoreLoginPage'))
const StoreRegisterPage = lazy(() => import('./pages/store/StoreRegisterPage'))
const StoreAccountPage = lazy(() => import('./pages/store/StoreAccountPage'))
const CartPage = lazy(() => import('./pages/store/CartPage'))
const CheckoutPage = lazy(() => import('./pages/store/CheckoutPage'))
const OrderStatusPage = lazy(() => import('./pages/store/OrderStatusPage'))
const StoreOpsPage = lazy(() => import('./pages/store/StoreOpsPage'))
const TermsPage = lazy(() => import('./pages/store/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/store/PrivacyPage'))
const AttributionsPage = lazy(() => import('./pages/store/AttributionsPage'))

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
  const location = useLocation()

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
        // Si branding no esta disponible, se mantiene el favicon actual.
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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/store" replace />} />
          
          {/* Store Routes with Maintenance Guard */}
          <Route path="/store/*" element={
            <StoreMaintenanceGuard>
              <Routes>
                <Route path="" element={<PageTransition><StorePage /></PageTransition>} />
                <Route path="wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
                <Route path="product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
                <Route path="cart" element={<PageTransition><CartPage /></PageTransition>} />
                <Route path="checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
                <Route path="terms" element={<PageTransition><TermsPage /></PageTransition>} />
                <Route path="privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
                <Route path="attributions" element={<PageTransition><AttributionsPage /></PageTransition>} />
                <Route path="order-status" element={<PageTransition><OrderStatusPage /></PageTransition>} />
                <Route
                  path="login"
                  element={!isAuthenticated ? <PageTransition><StoreLoginPage /></PageTransition> : <Navigate to="/store/account" replace />}
                />
                <Route
                  path="register"
                  element={!isAuthenticated ? <PageTransition><StoreRegisterPage /></PageTransition> : <Navigate to="/store/account" replace />}
                />
                <Route
                  path="account"
                  element={isAuthenticated ? <PageTransition><StoreAccountPage /></PageTransition> : <Navigate to="/store/login" replace />}
                />
                <Route
                  path="ops"
                  element={
                    <ProtectedRoute
                      requiredGroups={['Managers']}
                      fallback={<Navigate to="/dashboard" replace />}
                    >
                      <MainLayout>
                        <StoreOpsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </StoreMaintenanceGuard>
          } />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : managementAccess ? (
              <Navigate to="/post-login-choice" replace />
            ) : (
              <Navigate to="/store" replace />
            )
          }
        />

        <Route
          path="/post-login-choice"
          element={
            isAuthenticated && managementAccess ? (
              <PostLoginChoicePage />
            ) : (
              <Navigate to="/store" replace />
            )
          }
        />

          <Route
            path="/*"
            element={
              isAuthenticated ? (
                managementAccess ? (
                  <MainLayout>
                    <Routes>
                      {/* Sub-routes don't need PageTransition as they are inside MainLayout */}
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="sales" element={<SalesPage />} />
                      <Route path="inventory" element={<InventoryPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="purchases" element={<PurchasePage />} />
                      <Route path="suppliers" element={<SuppliersPage />} />
                      <Route
                        path="reports"
                        element={
                          <ProtectedRoute
                            requiredGroups={['Managers']}
                            fallback={<Navigate to="/dashboard" replace />}
                          >
                            <ReportsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/users"
                        element={
                          <ProtectedRoute
                            requiredGroups={['Managers']}
                            fallback={<Navigate to="/dashboard" replace />}
                          >
                            <UsersManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/groups"
                        element={
                          <ProtectedRoute
                            requiredGroups={['Managers']}
                            fallback={<Navigate to="/dashboard" replace />}
                          >
                            <GroupsManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="admin/finance"
                        element={
                          <ProtectedRoute
                            requiredGroups={['Managers']}
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
                  <Navigate to="/store" replace />
                )
              ) : (
                <Navigate to="/store" replace />
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default App
