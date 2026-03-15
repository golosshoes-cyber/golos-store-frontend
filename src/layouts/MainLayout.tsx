import React, { useState, useRef } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  Button,
  alpha,
  useTheme,
  MenuItem,
  Menu,
  Badge,
  Breadcrumbs,
  Link as MuiLink,
  ClickAwayListener,
  Paper as PopoverPaper,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  GroupWork as GroupWorkIcon,
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
} from '@mui/icons-material'
import {
  TextField,
  Autocomplete,
} from '@mui/material'
import { storeService } from '../services/storeService'
import { notificationService } from '../services/notificationService'
import { productService } from '../services/productService'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCommonPermissions } from '../hooks/auth/usePermissions'
import { useThemeMode } from '../contexts/ThemeModeContext'

const drawerWidth = 220

const menuSections = [
  {
    label: '',
    items: [
      { text: 'Dashboard', icon: <GridViewIcon />, path: '/dashboard' },
      { text: 'Productos', icon: <AddBoxIcon />, path: '/products' },
      { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/sales' },
      { text: 'Compras', icon: <ComprasIcon />, path: '/purchases' },
      { text: 'Inventario', icon: <InventarioIcon />, path: '/inventory' },
    ]
  },
  {
    label: 'Análisis',
    items: [
      { text: 'Reportes', icon: <ReportesIcon />, path: '/reports' },
      { text: 'Finanzas', icon: <FinanzasIcon />, path: '/admin/finance' },
    ]
  },
  {
    label: 'Config',
    items: [
      { text: 'Proveedores', icon: <ProveedoresIcon />, path: '/suppliers' },
      { text: 'Gestionar tienda', icon: <InventarioIcon />, path: '/store/ops' },
    ]
  }
]

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const getProductName = (product: any) => {
    if (!product) return ''
    if (typeof product === 'string') return product
    return product.name || ''
  }

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const profileButtonRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
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
  } = useCommonPermissions()

  const canAccessAdmin = canManageUsers || isAdmin

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

  // Query for alerts
  const { data: alertsData } = useQuery({
    queryKey: ['header-low-stock-alerts'],
    queryFn: () => notificationService.getLowStockAlerts(),
    refetchInterval: 60000, // Refresh every minute
  })

  const totalCritical = alertsData?.summary?.critical_count || 0
  const totalWarning = alertsData?.summary?.warning_count || 0
  const totalAlerts = totalCritical + totalWarning

  // Branding details
  const { data: brandingData } = useQuery({
    queryKey: ['store-branding-ops'],
    queryFn: () => storeService.getBranding(),
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
    purchases: 'Compras',
    suppliers: 'Proveedores',
    'store/ops': 'Operaciones',
    sales: 'Ventas',
    inventory: 'Inventario',
    reports: 'Reportes',
    notifications: 'Notificaciones',
    profile: 'Perfil',
    admin: 'Administración',
    users: 'Usuarios',
    groups: 'Grupos',
    ops: 'Operaciones',
    finance: 'Finanzas',
  }

  const pathSegments = location.pathname.split('/').filter(Boolean)

  const navItemSx = (selected: boolean) => ({
    borderRadius: 0.8,
    mx: 0.8,
    my: 0,
    px: 1,
    py: 0.25,
    minHeight: 30, // Extremely compact
    transition: 'all 0.1s ease',
    '& .MuiListItemIcon-root': {
      minWidth: 24,
      color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
      opacity: selected ? 1 : 0.7,
    },
    '& .MuiListItemText-primary': {
      fontSize: '13px',
      fontWeight: selected ? 500 : 400,
      color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
    },
    '&.Mui-selected': {
      backgroundColor: mode === 'light' ? theme.palette.action.hover : alpha('#fff', 0.04),
      color: theme.palette.text.primary,
      fontWeight: 500,
      '&:hover': {
        backgroundColor: mode === 'light' ? theme.palette.action.selected : alpha('#fff', 0.06),
      },
    },
    '&:hover': {
      backgroundColor: mode === 'light' ? theme.palette.action.hover : alpha('#fff', 0.03),
      color: theme.palette.text.primary,
    },
  })

  const getVisibleItems = (items: any[]) => items.filter((item) => {
    if (['reports', 'notifications'].includes(item.path)) return canViewReports
    if (item.path === 'sales') return canCreateSale
    if (['products', 'purchases', 'suppliers', 'inventory', 'store/ops'].includes(item.path)) {
      return canCreateProduct || canCreatePurchase
    }
    return true
  })

  const visibleSections = menuSections.map(section => ({
    ...section,
    items: getVisibleItems(section.items)
  })).filter(section => section.items.length > 0)

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{
          width: 26,
          height: 26,
          bgcolor: 'text.primary',
          color: 'background.default',
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          overflow: 'hidden'
        }}>
          {branding?.logo_url ? (
            <img src={branding.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            (branding?.store_name || 'Golos Store').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          )}
        </Box>
        <Typography variant="body2" noWrap sx={{ fontWeight: 500, fontSize: '13px', letterSpacing: '-0.3px' }}>
          {branding?.store_name || 'Golos Store'}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, py: 0.5, overflowY: 'auto' }}>
        {visibleSections.map((section) => (
          <Box key={section.label} sx={{ mb: 0.8 }}>
            {section.label && (
              <Typography variant="caption" sx={{
                px: 2,
                py: 0.2,
                display: 'block',
                fontSize: '10px',
                fontWeight: 500,
                color: 'text.secondary',
                opacity: 0.5,
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                {section.label}
              </Typography>
            )}
            <List sx={{ px: 0, py: 0.1 }}>
              {section.items.map((item: any) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0 }}>
                  <ListItemButton
                    selected={location.pathname.includes(item.path)}
                    onClick={() => navigate(item.path)}
                    sx={navItemSx(location.pathname.includes(item.path))}
                  >
                    <ListItemIcon>
                      {React.cloneElement(item.icon, { sx: { fontSize: 16 } })}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}

        {canAccessAdmin && (
          <Box sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{
              px: 2,
              py: 0.3,
              display: 'block',
              fontSize: '8px',
              fontWeight: 600,
              color: 'text.secondary',
              opacity: 0.3,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              Administración
            </Typography>
            <List sx={{ px: 0, py: 0 }}>
              <ListItem disablePadding sx={{ mb: 0.2 }}>
                <ListItemButton
                  selected={location.pathname.includes('/admin/users')}
                  onClick={() => navigate('/admin/users')}
                  sx={navItemSx(location.pathname.includes('/admin/users'))}
                >
                  <ListItemIcon>
                    <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.2 }}>
                <ListItemButton
                  selected={location.pathname.includes('/admin/groups')}
                  onClick={() => navigate('/admin/groups')}
                  sx={navItemSx(location.pathname.includes('/admin/groups'))}
                >
                  <ListItemIcon>
                    <GroupWorkIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary="Grupos" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}`, position: 'relative' }}>
        {/* Inline dropdown - positioned relative to this box, no portal */}
        {Boolean(anchorEl) && (
          <ClickAwayListener onClickAway={handleMenuClose}>
            <PopoverPaper
              elevation={4}
              sx={{
                position: 'absolute',
                bottom: 'calc(100% + 4px)',
                left: 8,
                right: 8,
                zIndex: 9999,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1.5,
                overflow: 'hidden',
                boxShadow: theme.palette.mode === 'light' 
                  ? '0 -4px 20px rgba(0,0,0,0.1)'
                  : '0 -4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <MenuItem
                onClick={() => { navigate('/profile'); handleMenuClose(); }}
                sx={{ fontSize: '13px', py: 1, gap: 1 }}
              >
                <AccountCircleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                Mi Perfil
              </MenuItem>
              <Divider sx={{ my: 0 }} />
              <MenuItem
                onClick={handleLogout}
                sx={{ fontSize: '13px', py: 1, gap: 1, color: 'error.main' }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
                Cerrar Sesión
              </MenuItem>
            </PopoverPaper>
          </ClickAwayListener>
        )}

        <Box
          ref={profileButtonRef}
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            p: 1,
            borderRadius: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Avatar sx={{
            width: 28,
            height: 28,
            fontSize: '11px',
            fontWeight: 600,
            bgcolor: 'text.primary',
            color: 'background.default'
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 500 }} noWrap>
              {user?.username}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '11px', color: 'text.secondary', display: 'block' }}>
              {isAdmin ? 'Administrador' : 'Usuario'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.default',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 'auto', sm: 52 },
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 0 },
            flexDirection: 'column',
          }}
        >
          {/* TOP ROW: Menu toggle + Title + Mode toggle */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minHeight: { xs: 32, sm: 52 },
            gap: 1.5
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center',
              minWidth: 0, // Critical for text-overflow to work in flex
              mr: { sm: 20 }, // Reserve space for absolute actions on desktop
              overflow: 'hidden'
            }}>
              <Breadcrumbs 
                separator={<NavigateNextIcon sx={{ fontSize: 14, opacity: 0.5 }} />}
                aria-label="breadcrumb"
                sx={{ 
                  '& .MuiBreadcrumbs-ol': { alignItems: 'center' },
                  '& .MuiBreadcrumbs-separator': { mx: 0.5 }
                }}
              >
                <MuiLink
                  component="button"
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    fontSize: { xs: '12px', sm: '13px' }, 
                    fontWeight: 500, 
                    color: 'text.secondary',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'transparent',
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    '&:hover': { color: 'text.primary' }
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
                          fontSize: { xs: '12px', sm: '13px' }, 
                          fontWeight: 600, 
                          color: 'text.primary' 
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
                        fontSize: { xs: '12px', sm: '13px' }, 
                        fontWeight: 500, 
                        color: 'text.secondary',
                        textDecoration: 'none',
                        bgcolor: 'transparent',
                        border: 'none',
                        p: 0,
                        cursor: 'pointer',
                        '&:hover': { color: 'text.primary' }
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
              display: { xs: 'flex', sm: 'none' }, // Only show mode toggle here on mobile
              '&:hover': { borderColor: theme.palette.text.disabled, color: 'text.primary' }
            }}>
              {mode === 'dark' ? <LightMode style={{ fontSize: 13 }} /> : <DarkMode style={{ fontSize: 13 }} />}
            </IconButton>
          </Box>

          {/* BOTTOM ROW (Mobile) / SAME ROW (Desktop): Search + Buttons + Mode toggle (desktop) */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            mt: { xs: 1.5, sm: 0 },
            gap: 1,
            // In desktop it stays integrated with the row above via position absolute or flex layout
            // But here we use Toolbar flex-direction column to stack it
            position: { xs: 'relative', sm: 'absolute' },
            right: { sm: 24 },
            top: { sm: 0 },
            height: { sm: '100%' },
            justifyContent: 'flex-end',
            maxWidth: { xs: '100%', sm: 'auto' },
            overflowX: { xs: 'auto', sm: 'visible' },
            pb: { xs: 0.5, sm: 0 },
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
                `${option.sku} - ${getProductName(option.product)} ${option.size} ${option.color || ''}`
              }
              loading={searchLoading}
              onInputChange={(_, value) => setSearchValue(value)}
              onChange={(_, value: any) => {
                if (value) {
                  navigate(`/variant/${value.id}`)
                  setSearchValue('')
                  setSearchOpen(false)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar..."
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
                    minWidth: { xs: 120, sm: 160 },
                  }}
                />
              )}
              renderOption={(props, option: any) => {
                const { key, ...other } = props
                return (
                  <li key={key} {...other}>
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '11px' }}>
                        {option.sku}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '10px' }}>
                        {getProductName(option.product)} {option.size} {option.color || ''}
                      </Typography>
                    </Box>
                  </li>
                )
              }}
              slotProps={{
                popper: {
                  sx: { zIndex: 1400 },
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
              onClick={() => window.open('https://golosshoes.shop', '_blank')}
              variant="outlined"
              size="small"
              sx={{
                fontSize: '11px',
                height: 30,
                minWidth: 'auto',
                px: 1.2,
                borderRadius: 1.5,
                color: 'text.secondary',
                borderColor: theme.palette.divider,
                textTransform: 'none',
                fontWeight: 400,
                bgcolor: 'background.paper',
                whiteSpace: 'nowrap',
                '&:hover': { borderColor: theme.palette.text.disabled, bgcolor: 'background.paper', color: 'text.primary' }
              }}
            >
              Tienda
            </Button>

            <Button
              onClick={() => navigate('/products?create=true')}
              variant="contained"
              size="small"
              sx={{
                fontSize: '10px',
                height: 30,
                minWidth: 'auto',
                px: 1.2,
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
              + Producto
            </Button>

            <Button
              onClick={() => navigate('/sales?create=true')}
              variant="contained"
              size="small"
              sx={{
                fontSize: '10px',
                height: 30,
                minWidth: 'auto',
                px: 1.2,
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
              + Venta
            </Button>

            <IconButton onClick={toggleColorMode} size="small" sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              display: { xs: 'none', sm: 'flex' },
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
              navigate('/reports?tab=3')
              setNotifAnchorEl(null)
            }}
            sx={{ fontSize: '11px', color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Ver todo
          </Typography>
        </Box>
        {totalAlerts === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>No hay alertas pendientes</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {[...(alertsData?.critical || []), ...(alertsData?.warning || [])].slice(0, 5).map((alert: any, idx: number) => (
              <ListItem key={idx} 
                onClick={() => {
                  navigate(`/variant/${alert.id}`)
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
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: `1px solid ${theme.palette.divider}` },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        // Adjust for taller header on mobile
        pt: { xs: '110px !important', sm: '75px !important' }
      }}>
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout
