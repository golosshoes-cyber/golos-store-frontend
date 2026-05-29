import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  Button,
  alpha,
  useTheme,
  Menu,
  Badge,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  DarkMode,
  LightMode,
  GridView as GridViewIcon,
  AddBox as AddBoxIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  HexagonOutlined as ComprasIcon,
  Tune as InventarioIcon,
  AssessmentOutlined as ReportesIcon,
  StoreOutlined as ProveedoresIcon,
  NotificationsNone as NotificacionesIcon,
  Search as SearchIcon,
  NavigateNext as NavigateNextIcon,
  Payments as FinanzasIcon,
  AccountBalanceWallet as CxCIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material'
import {
  TextField,
  Autocomplete,
} from '@mui/material'
import { storeService } from '../services/storeService'
import { notificationService } from '../services/notificationService'
import { productService } from '../services/productService'
import ProductViewDialog from '../components/products/ProductViewDialog'
import type { Product } from '../types'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCommonPermissions } from '../hooks/auth/usePermissions'
import { useThemeMode } from '../contexts/ThemeModeContext'
import { useStockWebsocket } from '../hooks/useStockWebsocket'
import SidebarDrawer from '../components/layout/SidebarDrawer'

const drawerWidth = 220

const menuSections = [
  {
    label: '',
    items: [
      { text: 'Dashboard', icon: <GridViewIcon />, path: '/dashboard' },
    ]
  },
  {
    label: 'Inventario',
    items: [
      { text: 'Productos', icon: <AddBoxIcon />, path: '/inventory/products' },
      { text: 'Stock', icon: <InventarioIcon />, path: '/inventory/stock' },
      { text: 'Stock Bajo', icon: <InventarioIcon />, path: '/inventory/low-stock' },
      { text: 'Compras', icon: <ComprasIcon />, path: '/inventory/purchases' },
      { text: 'Proveedores', icon: <ProveedoresIcon />, path: '/inventory/suppliers' },
    ]
  },
  {
    label: 'Ventas',
    items: [
      { text: 'Órdenes', icon: <ShoppingCartIcon />, path: '/sales/orders' },
      { text: 'Cuentas x Cobrar', icon: <CxCIcon />, path: '/sales/receivables' },
    ]
  },
  {
    label: 'Análisis',
    items: [
      { text: 'Reportes', icon: <ReportesIcon />, path: '/analytics/reports' },
      { text: 'Exportaciones', icon: <FileDownloadIcon />, path: '/analytics/exports' },
      { text: 'Finanzas', icon: <FinanzasIcon />, path: '/analytics/finance' },
    ]
  },
  {
    label: 'Configuración',
    items: [
      { text: 'Ajustes tienda', icon: <InventarioIcon />, path: '/settings/store' },
    ]
  }
]

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const profileButtonRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { mode, toggleColorMode } = useThemeMode()
  const { user, logout, isAdmin } = useAuth()
  const {
    canManageUsers,
    canCreateSale,
    canCreateProduct,
    canCreatePurchase,
    canViewReports,
    canViewFinance,
  } = useCommonPermissions()

  const canAccessAdmin = canManageUsers || isAdmin

  // Quick View: fetch product and open dialog
  const handleSearchSelect = useCallback(async (productId: number) => {
    try {
      const product = await productService.getProduct(productId)
      setQuickViewProduct(product)
      setQuickViewOpen(true)
    } catch (err) {
      navigate(`/inventory/products`)
    }
  }, [navigate])

  // Search logic
  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ['global-variant-search', searchValue],
    queryFn: () => productService.getVariants({ search: searchValue, limit: 10 }),
    enabled: searchValue.length >= 2,
  })
  
  // Notification menu logic
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null)
  const notifOpen = Boolean(notifAnchorEl)

  // Query for user alerts
  const { data: userAlertsData, refetch: refetchUserAlerts } = useQuery({
    queryKey: ['header-user-alerts'],
    queryFn: () => notificationService.getUserAlerts(),
    refetchInterval: 60000,
  })

  // Listen to WebSockets for live notifications
  const { lastJsonMessage } = useStockWebsocket()
  useEffect(() => {
    if (lastJsonMessage && (lastJsonMessage as any).type === 'system_alert') {
      refetchUserAlerts()
    }
  }, [lastJsonMessage, refetchUserAlerts])

  const userAlerts = userAlertsData?.alerts || []
  const unreadCount = userAlertsData?.summary?.unread_count || 0

  // Query for alerts
  const { data: alertsData } = useQuery({
    queryKey: ['header-low-stock-alerts'],
    queryFn: () => notificationService.getLowStockAlerts(),
    refetchInterval: 60000, // Refresh every minute
  })

  const totalCritical = alertsData?.summary?.critical_count || 0
  const totalWarning = alertsData?.summary?.warning_count || 0
  const totalAlerts = totalCritical + totalWarning + unreadCount

  // Branding details
  const { data: brandingData } = useQuery({
    queryKey: ['store-branding-ops'],
    queryFn: () => storeService.getBranding(),
    staleTime: 5 * 60_000,
  })
  const branding = brandingData?.branding

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
  const handleMenuOpen = () => setAnchorEl(profileButtonRef.current)
  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleMenuClose()
  }

  const breadcrumbLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    products: 'Productos',
    stock: 'Inventario',
    purchases: 'Compras',
    suppliers: 'Proveedores',
    inventory: 'Inventario',
    sales: 'Ventas',
    orders: 'Órdenes',
    analytics: 'Análisis',
    reports: 'Reportes',
    finance: 'Finanzas',
    settings: 'Configuración',
    store: 'Tienda',
    users: 'Usuarios',
    groups: 'Grupos',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    receivables: 'Cuentas por Cobrar',
  }

  const pathSegments = location.pathname.split('/').filter(Boolean)

  const getVisibleItems = (items: any[]) => items.filter((item) => {
    if (['/analytics/reports', '/notifications'].includes(item.path)) return canViewReports
    if (item.path === '/analytics/finance') return canViewFinance
    if (item.path === '/sales/orders' || item.path === '/sales/receivables') return canCreateSale
    if (['/inventory/products', '/inventory/purchases', '/inventory/suppliers', '/inventory/stock', '/settings/store'].includes(item.path)) {
      return canCreateProduct || canCreatePurchase
    }
    return true
  })

  const visibleSections = menuSections.map(section => ({
    ...section,
    items: getVisibleItems(section.items)
  })).filter(section => section.items.length > 0)

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.default',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          zIndex: (theme) => ({ xs: theme.zIndex.appBar, md: theme.zIndex.drawer + 1 }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 'auto', md: 52 },
            px: { xs: 1.5, md: 3 },
            py: { xs: 1.5, md: 0 },
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 0, md: 2 }
          }}
        >
          {/* TOP ROW: Menu toggle + Title + Mode toggle */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', md: 'auto' },
            minHeight: { xs: 32, md: 52 },
            gap: 1.5,
            flexGrow: 1,
            overflow: 'hidden'
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center',
              minWidth: 0, // Critical for text-overflow to work in flex
            }}>
              <Breadcrumbs 
                separator={<NavigateNextIcon sx={{ fontSize: 14, opacity: 0.5 }} />}
                aria-label="breadcrumb"
                sx={{ 
                  minWidth: 0,
                  width: '100%',
                  '& .MuiBreadcrumbs-ol': { 
                    alignItems: 'center', 
                    flexWrap: 'nowrap',
                    minWidth: 0,
                  },
                  '& .MuiBreadcrumbs-li': {
                    minWidth: 0,
                    display: 'flex',
                  },
                  '& .MuiBreadcrumbs-li:last-child': {
                    flexShrink: 1, // allow the last item to shrink most
                    minWidth: 0,
                  },
                  '& .MuiBreadcrumbs-separator': { mx: 0.5, flexShrink: 0 },
                }}
              >
                <MuiLink
                  component="button"
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    fontSize: { xs: '12px', md: '13px' }, 
                    fontWeight: 500, 
                    color: 'text.secondary',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'transparent',
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    '&:hover': { color: 'text.primary' },
                    flexShrink: 0
                  }}
                >
                  Golos
                </MuiLink>
                {pathSegments.map((segment, index) => {
                  const path = `/${pathSegments.slice(0, index + 1).join('/')}`
                  const label = breadcrumbLabels[segment] || breadcrumbLabels[pathSegments.slice(0, index + 1).join('/')] || segment
                  const isLast = index === pathSegments.length - 1

                  if (isLast) {
                    return (
                      <Typography 
                        key={path}
                        sx={{ 
                          fontSize: { xs: '12px', md: '13px' }, 
                          fontWeight: 600, 
                          color: 'text.primary',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}
                      >
                        {label}
                      </Typography>
                    )
                  }

                  return (
                    <MuiLink
                      key={path}
                      component="button"
                      onClick={() => navigate(path)}
                      sx={{ 
                        fontSize: { xs: '12px', md: '13px' }, 
                        fontWeight: 500, 
                        color: 'text.secondary',
                        textDecoration: 'none',
                        bgcolor: 'transparent',
                        border: 'none',
                        p: 0,
                        cursor: 'pointer',
                        '&:hover': { color: 'text.primary' },
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      {label}
                    </MuiLink>
                  )
                })}
              </Breadcrumbs>
            </Box>

            <IconButton onClick={toggleColorMode} size="small" sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              display: { xs: 'flex', md: 'none' }, // Only show mode toggle here on mobile
              '&:hover': { borderColor: theme.palette.text.disabled, color: 'text.primary' },
              flexShrink: 0
            }}>
              {mode === 'dark' ? <LightMode style={{ fontSize: 13 }} /> : <DarkMode style={{ fontSize: 13 }} />}
            </IconButton>
          </Box>

          {/* BOTTOM ROW (Mobile) / SAME ROW (Desktop): Search + Buttons + Mode toggle (desktop) */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', md: 'auto' },
            mt: { xs: 1.5, md: 0 },
            gap: 1,
            justifyContent: 'flex-end',
            flexShrink: 1, // Allow this container to shrink
            minWidth: 0,   // Crucial for flex shrinkage
            overflowX: { xs: 'auto', md: 'visible' },
            pb: { xs: 0.5, md: 0 },
            // Scrollbar styling for horizontal actions on mobile
            '&::-webkit-scrollbar': { height: 0 },
          }}>
            <Autocomplete
              open={searchOpen && searchValue.length >= 2}
              onOpen={() => searchValue.length >= 2 && setSearchOpen(true)}
              onClose={() => setSearchOpen(false)}
              clearOnBlur
              blurOnSelect
              disablePortal
              options={searchResults?.results || []}
              getOptionLabel={(option: any) =>
                `${option.product_name || ''} ${option.size || ''} ${option.color || ''}`
              }
              loading={searchLoading}
              onInputChange={(_, value) => setSearchValue(value)}
              onChange={(_, value: any) => {
                if (value) {
                  handleSearchSelect(value.product)
                  setSearchValue('')
                  setSearchOpen(false)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar producto..."
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <SearchIcon sx={{ ml: 1, fontSize: 14, color: 'text.disabled' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02),
                      borderRadius: 1.5,
                      height: 30,
                      fontSize: '11px',
                      '& fieldset': { borderColor: theme.palette.divider },
                    },
                    width: { xs: '100%', md: 280 }, // Let it be 280px by default
                    minWidth: { xs: 120, md: 130 }, // But allow it to shrink down to 130px on md
                    flexShrink: 1,
                  }}
                />
              )}
              renderOption={(props, option: any) => {
                const { key, ...other } = props
                const stockColor = option.stock <= 0 ? 'error.main' : option.stock <= 5 ? 'warning.main' : 'success.main'
                return (
                  <li key={key} {...other}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, py: 0.5, width: '100%' }}>
                      {/* Thumbnail */}
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                        bgcolor: alpha(theme.palette.text.primary, 0.04),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {option.image_url ? (
                          <img
                            src={option.image_url}
                            alt={option.product_name || ''}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <AddBoxIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        )}
                      </Box>

                      {/* Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '11px', lineHeight: 1.3 }}>
                          {option.product_name || 'Producto'}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block', fontSize: '10px', lineHeight: 1.2 }}>
                          {[option.size, option.color, option.gender].filter(Boolean).join(' · ')}
                          {option.product_brand ? ` — ${option.product_brand}` : ''}
                        </Typography>
                      </Box>

                      {/* Price & Stock */}
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, lineHeight: 1.3 }}>
                          ${Number(option.price || 0).toLocaleString('es-CO')}
                        </Typography>
                        <Typography sx={{
                          fontSize: '9px',
                          fontWeight: 600,
                          color: stockColor,
                          lineHeight: 1.2,
                        }}>
                          Stock: {option.stock ?? 0}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                )
              }}
              noOptionsText={searchValue.length >= 2 ? 'Sin resultados' : 'Escribe para buscar...'}
              slotProps={{
                popper: {
                  sx: { zIndex: 1400 },
                },
                paper: {
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    border: `1px solid ${theme.palette.divider}`,
                    mt: 0.5,
                  },
                },
              }}
            />

            <IconButton 
              size="small" 
              onClick={(e) => setNotifAnchorEl(e.currentTarget)}
              sx={{
                width: 30,
                height: 30,
                borderRadius: 1.5,
                border: `1px solid ${totalAlerts > 0 ? alpha(theme.palette.warning.main, 0.3) : theme.palette.divider}`,
                color: totalCritical > 0 ? 'error.main' : totalAlerts > 0 ? 'warning.main' : 'text.secondary',
                bgcolor: totalAlerts > 0 ? alpha(totalCritical > 0 ? theme.palette.error.main : theme.palette.warning.main, 0.04) : 'transparent',
                '&:hover': { borderColor: theme.palette.text.disabled, color: 'text.primary' }
              }}
            >
              <Badge 
                badgeContent={totalAlerts} 
                color={totalCritical > 0 ? 'error' : 'warning'}
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '9px', 
                    height: 14, 
                    minWidth: 14,
                    top: 2,
                    right: 2 
                  } 
                }}
              >
                <NotificacionesIcon sx={{ fontSize: 16 }} />
              </Badge>
            </IconButton>

            <Button
              onClick={() => navigate('/inventory/products?create=true')}
              variant="contained"
              size="small"
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                fontSize: '10px',
                height: 30,
                minWidth: 'auto',
                px: { md: 1, lg: 1.2 },
                borderRadius: 1.5,
                bgcolor: 'text.primary',
                color: 'background.default',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: 'text.secondary', boxShadow: 'none' }
              }}
            >
              <AddBoxIcon sx={{ fontSize: 16, mr: { lg: 0.5 } }} />
              <Box sx={{ display: { xs: 'none', lg: 'inline' } }}>Producto</Box>
            </Button>

            <Button
              onClick={() => navigate('/sales/orders?create=true')}
              variant="contained"
              size="small"
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                fontSize: '10px',
                height: 30,
                minWidth: 'auto',
                px: { md: 1, lg: 1.2 },
                borderRadius: 1.5,
                bgcolor: 'text.primary',
                color: 'background.default',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: 'text.secondary', boxShadow: 'none' }
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 16, mr: { lg: 0.5 } }} />
              <Box sx={{ display: { xs: 'none', lg: 'inline' } }}>Venta</Box>
            </Button>

            <IconButton onClick={toggleColorMode} size="small" sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              display: { xs: 'none', md: 'flex' },
              '&:hover': { borderColor: theme.palette.text.disabled, color: 'text.primary' }
            }}>
              {mode === 'dark' ? <LightMode style={{ fontSize: 13 }} /> : <DarkMode style={{ fontSize: 13 }} />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* NOTIFICATION MENU */}
      <Menu
        anchorEl={notifAnchorEl}
        open={notifOpen}
        onClose={() => setNotifAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              maxHeight: 400,
              overflowY: 'auto',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: `1px solid ${theme.palette.divider}`,
              mt: 1,
            }
          }
        }}
      >
        <Box sx={{ p: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Notificaciones</Typography>
          <Typography 
            onClick={() => {
              navigate('/analytics/reports?tab=3')
              setNotifAnchorEl(null)
            }}
            sx={{ fontSize: '11px', color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Ver todo
          </Typography>
        </Box>
        {totalAlerts === 0 && userAlerts.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>No hay alertas pendientes</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {/* System Notifications (Sales, etc) */}
            {userAlerts.slice(0, 5).map((alert: any) => (
              <ListItem key={`ua-${alert.id}`} 
                onClick={async () => {
                  if (!alert.is_read) {
                    await notificationService.markAlertAsRead(alert.id);
                    refetchUserAlerts();
                  }
                  if (alert.related_link) navigate(alert.related_link);
                  setNotifAnchorEl(null);
                }}
                sx={{ 
                  px: 1.5, 
                  py: 1, 
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.5) },
                  cursor: 'pointer',
                  opacity: alert.is_read ? 0.6 : 1
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 8, height: 8, borderRadius: '50%', mt: 0.5,
                    bgcolor: alert.is_read ? 'transparent' : 'error.main',
                    border: alert.is_read ? `1px solid ${theme.palette.divider}` : 'none',
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: alert.is_read ? 400 : 600, lineHeight: 1.2 }}>
                      {alert.title}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: 'text.secondary', mt: 0.2 }}>
                      {alert.message}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}

            {/* Low stock alerts fallback */}
            {[...(alertsData?.critical || []), ...(alertsData?.warning || [])].slice(0, 3).map((alert: any, idx: number) => (
              <ListItem key={`stock-${idx}`} 
                onClick={() => {
                  navigate(`/inventory/stock`)
                  setNotifAnchorEl(null)
                }}
                sx={{ 
                  px: 1.5, 
                  py: 1, 
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.5) },
                  cursor: 'pointer'
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 8, height: 8, borderRadius: '50%', mt: 0.5,
                    bgcolor: alert.urgency === 'critical' ? 'error.main' : 'warning.main',
                    flexShrink: 0
                  }} />
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 600, lineHeight: 1.2 }}>
                      {alert.product_name}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: 'text.secondary', mt: 0.2 }}>
                      {alert.message}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Menu>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <SidebarDrawer
  mode={mode}
  branding={branding}
  visibleSections={visibleSections}
  pathname={location.pathname}
  onNavigate={navigate}
  username={user?.username}
  isAdmin={isAdmin}
  canAccessAdmin={canAccessAdmin}
  anchorEl={anchorEl}
  onMenuOpen={handleMenuOpen}
  onMenuClose={handleMenuClose}
  onLogout={handleLogout}
  profileButtonRef={profileButtonRef}
  onMobileClose={() => setMobileOpen(false)}
/>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: `1px solid ${theme.palette.divider}` },
          }}
          open
        >
          <SidebarDrawer
  mode={mode}
  branding={branding}
  visibleSections={visibleSections}
  pathname={location.pathname}
  onNavigate={navigate}
  username={user?.username}
  isAdmin={isAdmin}
  canAccessAdmin={canAccessAdmin}
  anchorEl={anchorEl}
  onMenuOpen={handleMenuOpen}
  onMenuClose={handleMenuClose}
  onLogout={handleLogout}
  profileButtonRef={profileButtonRef}
  onMobileClose={() => setMobileOpen(false)}
/>
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        width: { md: `calc(100% - ${drawerWidth}px)` },
        // Adjust for taller header on mobile
        pt: { xs: '110px !important', md: '75px !important' }
      }}>
        {children}
      </Box>
      {/* Product Quick View from Search */}
      <ProductViewDialog
        open={quickViewOpen}
        product={quickViewProduct}
        onClose={() => { setQuickViewOpen(false); setQuickViewProduct(null); }}
      />
    </Box>
  )
}

export default MainLayout
