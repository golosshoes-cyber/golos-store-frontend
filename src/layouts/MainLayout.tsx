import React, { useEffect, useState } from 'react'
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
  Menu,
  MenuItem,
  Divider,
  Breadcrumbs,
  Link,
  alpha,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  ShoppingCart,
  Store,
  AccountCircle,
  Logout,
  AddShoppingCart,
  Business as BusinessIcon,
  Assessment,
  NotificationsActive,
  Download,
  AdminPanelSettings,
  GroupWork,
  DarkMode,
  LightMode,
  Storefront,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCommonPermissions } from '../hooks/auth/usePermissions'
import { useThemeMode } from '../contexts/ThemeModeContext'
import { storeService } from '../services/storeService'

const drawerWidth = 220

const menuSections = [
  {
    label: 'General',
    items: [
      { text: 'Dashboard', icon: <Dashboard />, path: 'dashboard' },
      { text: 'Productos', icon: <Store />, path: 'products' },
      { text: 'Ventas', icon: <ShoppingCart />, path: 'sales' },
      { text: 'Compras', icon: <AddShoppingCart />, path: 'purchases' },
      { text: 'Inventario', icon: <Inventory />, path: 'inventory' },
    ]
  },
  {
    label: 'Análisis',
    items: [
      { text: 'Reportes', icon: <Assessment />, path: 'reports' },
      { text: 'Exportaciones', icon: <Download />, path: 'exports' },
    ]
  },
  {
    label: 'Config',
    items: [
      { text: 'Proveedores', icon: <BusinessIcon />, path: 'suppliers' },
      { text: 'Notificaciones', icon: <NotificationsActive />, path: 'notifications' },
    ]
  }
]

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [brandingLogoUrl, setBrandingLogoUrl] = useState('')
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

  useEffect(() => {
    let mounted = true
    const loadBrandingLogo = async () => {
      try {
        const response = await storeService.getBranding()
        if (!mounted) return
        setBrandingLogoUrl(response.branding.logo_url || '')
      } catch {
        // Silently fail
      }
    }
    void loadBrandingLogo()
    return () => { mounted = false }
  }, [])

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
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
    sales: 'Ventas',
    inventory: 'Inventario',
    reports: 'Reportes',
    notifications: 'Notificaciones',
    exports: 'Exportaciones',
    profile: 'Perfil',
    admin: 'Administración',
    users: 'Usuarios',
    groups: 'Grupos',
  }

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: breadcrumbLabels[segment] || segment,
    to: `/${pathSegments.slice(0, index + 1).join('/')}`,
    isLast: index === pathSegments.length - 1,
  }))

  const navItemSx = (selected: boolean) => ({
    borderRadius: 1.5,
    mx: 1,
    my: 0.2,
    px: 1.5,
    py: 0.7,
    transition: 'all 0.1s ease',
    '& .MuiListItemIcon-root': {
      minWidth: 32,
      color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
      opacity: selected ? 1 : 0.7,
    },
    '& .MuiListItemText-primary': {
      fontSize: '0.8125rem',
      fontWeight: selected ? 500 : 400,
      color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
    },
    '&.Mui-selected': {
      backgroundColor: mode === 'light' ? alpha('#000', 0.04) : alpha('#fff', 0.04),
      '&:hover': {
        backgroundColor: mode === 'light' ? alpha('#000', 0.06) : alpha('#fff', 0.06),
      },
    },
    '&:hover': {
      backgroundColor: mode === 'light' ? alpha('#000', 0.03) : alpha('#fff', 0.03),
    },
  })

  const getVisibleItems = (items: any[]) => items.filter((item) => {
    if (['reports', 'notifications', 'exports'].includes(item.path)) return canViewReports
    if (item.path === 'sales') return canCreateSale
    if (['products', 'purchases', 'suppliers', 'inventory'].includes(item.path)) {
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
          letterSpacing: '-1px'
        }}>
          GS
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 500, letterSpacing: '-0.3px' }}>
          Golos Store
        </Typography>
      </Box>

      <Box sx={{ flex: 1, py: 1, overflowY: 'auto' }}>
        {visibleSections.map((section) => (
          <Box key={section.label} sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ 
              px: 2.5, 
              py: 1, 
              display: 'block',
              fontSize: '10px', 
              fontWeight: 500, 
              color: 'text.secondary',
              opacity: 0.5,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {section.label}
            </Typography>
            <List sx={{ px: 0, py: 0 }}>
              {section.items.map((item: any) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.2 }}>
                  <ListItemButton
                    selected={location.pathname.includes(item.path)}
                    onClick={() => navigate(item.path)}
                    sx={navItemSx(location.pathname.includes(item.path))}
                  >
                    <ListItemIcon>
                      {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}

        {canAccessAdmin && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ 
              px: 2.5, 
              py: 1, 
              display: 'block',
              fontSize: '10px', 
              fontWeight: 500, 
              color: 'text.secondary',
              opacity: 0.5,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Administración
            </Typography>
            <List sx={{ px: 0, py: 0 }}>
              <ListItem disablePadding sx={{ mb: 0.2 }}>
                <ListItemButton
                  selected={location.pathname.includes('admin/users')}
                  onClick={() => navigate('admin/users')}
                  sx={navItemSx(location.pathname.includes('admin/users'))}
                >
                  <ListItemIcon>
                    <AdminPanelSettings sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.2 }}>
                <ListItemButton
                  selected={location.pathname.includes('admin/groups')}
                  onClick={() => navigate('admin/groups')}
                  sx={navItemSx(location.pathname.includes('admin/groups'))}
                >
                  <ListItemIcon>
                    <GroupWork sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary="Grupos" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box 
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
        <Toolbar sx={{ minHeight: 52, px: { xs: 2, sm: 3 }, gap: 1.5 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
              separator={<Typography sx={{ color: 'text.disabled', fontSize: 10 }}>›</Typography>}
            >
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Panel</Typography>
              {breadcrumbs.map((crumb) => (
                <Typography 
                  key={crumb.to} 
                  sx={{ 
                    fontSize: '13px', 
                    fontWeight: crumb.isLast ? 500 : 400,
                    color: crumb.isLast ? 'text.primary' : 'text.secondary'
                  }}
                >
                  {crumb.label}
                </Typography>
              ))}
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleColorMode} size="small" sx={{ 
              width: 32, 
              height: 32, 
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary'
            }}>
              {mode === 'dark' ? <LightMode sx={{ fontSize: 16 }} /> : <DarkMode sx={{ fontSize: 16 }} />}
            </IconButton>

            {canSwitchToStore && (
              <Button
                onClick={() => navigate('/store')}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: '12px', 
                  py: 0.4, 
                  px: 1.5,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              >
                Tienda
              </Button>
            )}

            <Button
              variant="contained"
              size="small"
              sx={{ 
                fontSize: '12px', 
                py: 0.4, 
                px: 1.5,
              }}
            >
              + Acción rápida
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

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

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar sx={{ minHeight: 52 }} />
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 180,
            boxShadow: theme.palette.mode === 'light' ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 10px 15px -3px rgba(0,0,0,0.5)',
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
          <ListItemText primary="Mi Perfil" primaryTypographyProps={{ fontSize: '13px' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontSize: '13px' }} />
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default MainLayout
