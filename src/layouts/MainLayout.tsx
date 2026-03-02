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
  Paper,
  Button,
  Breadcrumbs,
  Link,
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
  AdminPanelSettings, // Icono para administración
  GroupWork,
  DarkMode,
  LightMode,
  NavigateNext,
  Storefront,
} from '@mui/icons-material'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCommonPermissions } from '../hooks/auth/usePermissions'
import { useThemeMode } from '../contexts/ThemeModeContext'
import { storeService } from '../services/storeService'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: 'dashboard' },
  { text: 'Productos', icon: <Store />, path: 'products' },
  { text: 'Compras', icon: <AddShoppingCart />, path: 'purchases' },
  { text: 'Proveedores', icon: <BusinessIcon />, path: 'suppliers' },
  { text: 'Ventas', icon: <ShoppingCart />, path: 'sales' },
  { text: 'Inventario', icon: <Inventory />, path: 'inventory' },
  { text: 'Reportes', icon: <Assessment />, path: 'reports' },
  { text: 'Notificaciones', icon: <NotificationsActive />, path: 'notifications' },
  { text: 'Exportaciones', icon: <Download />, path: 'exports' },
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

  // Los superadmins tienen acceso automático a administración
  const canAccessAdmin = canManageUsers || isAdmin
  const groupNames = (Array.isArray((user as any)?.groups) ? (user as any).groups : [])
    .map((group: any) => (typeof group === 'string' ? group : group?.name || ''))
    .filter(Boolean)

  const canSwitchToStore = Boolean(
    user && (
      isAdmin ||
      user.is_staff ||
      canCreateSale ||
      canCreateProduct ||
      canCreatePurchase ||
      canViewReports ||
      groupNames.some((name: string) => ['Managers', 'Sales', 'Inventory'].includes(name))
    ),
  )
  const visibleMenuItems = menuItems.filter((item) => {
    if (['reports', 'notifications', 'exports'].includes(item.path)) return canViewReports
    if (item.path === 'sales') return canCreateSale
    if (['products', 'purchases', 'suppliers', 'inventory'].includes(item.path)) {
      return canCreateProduct || canCreatePurchase
    }
    return true
  })

  useEffect(() => {
    let mounted = true
    const loadBrandingLogo = async () => {
      try {
        const response = await storeService.getBranding()
        if (!mounted) return
        setBrandingLogoUrl(response.branding.logo_url || '')
      } catch {
        // Si falla el branding, se usa el icono fallback.
      }
    }
    void loadBrandingLogo()
    return () => {
      mounted = false
    }
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    navigate('/profile')
    handleMenuClose()
  }

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
    variant: 'Variante',
  }

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const to = `/${pathSegments.slice(0, index + 1).join('/')}`
    return {
      label: breadcrumbLabels[segment] || segment,
      to,
      isLast: index === pathSegments.length - 1,
    }
  })

  const navItemSx = (selected: boolean) => ({
    borderRadius: 2.5,
    px: 1.5,
    py: 1.2,
    border: `1px solid ${selected ? alpha(theme.palette.primary.main, 0.28) : 'transparent'}`,
    transition: 'all 0.2s ease',
    '& .MuiListItemIcon-root': {
      minWidth: 36,
      color: selected ? 'white' : theme.palette.text.secondary,
      transition: 'all 0.2s ease',
    },
    '& .MuiListItemText-primary': {
      fontWeight: selected ? 700 : 500,
      color: selected ? 'white' : theme.palette.text.primary,
      letterSpacing: 0.1,
    },
    '&.Mui-selected': {
      background:
        mode === 'light'
          ? 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 120%)'
          : 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 120%)',
      boxShadow:
        mode === 'light'
          ? `0 8px 18px ${alpha(theme.palette.primary.dark, 0.28)}`
          : `0 8px 18px ${alpha('#000000', 0.46)}`,
      '&:hover': {
        background:
          mode === 'light'
            ? 'linear-gradient(135deg, #4338ca 0%, #0891b2 120%)'
            : 'linear-gradient(135deg, #1e40af 0%, #0e7490 120%)',
      },
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, mode === 'light' ? 0.1 : 0.2),
      transform: 'translateX(3px)',
    },
  })

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background:
          mode === 'light'
            ? `linear-gradient(180deg, ${alpha('#4f46e5', 0.16)} 0%, ${alpha('#06b6d4', 0.14)} 55%, ${alpha('#ec4899', 0.12)} 100%)`
            : `linear-gradient(180deg, ${alpha('#1d4ed8', 0.16)} 0%, ${alpha('#0e7490', 0.14)} 55%, ${alpha('#7e22ce', 0.1)} 100%)`,
      }}
    >
      {/* Header del Sidebar */}
      <Paper
        sx={{
          background:
            mode === 'light'
              ? 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 130%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 130%)',
          color: 'white',
          borderRadius: 0,
          boxShadow: 'none',
          borderBottom: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            right: -40,
            top: -40,
            background: alpha('#ffffff', 0.18),
          },
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            {brandingLogoUrl ? (
              <Box
                component="img"
                src={brandingLogoUrl}
                alt="Logo tienda"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: `1px solid ${alpha('#ffffff', 0.35)}`,
                  backgroundColor: alpha('#ffffff', 0.2),
                }}
              />
            ) : (
              <BusinessIcon sx={{ fontSize: 28 }} />
            )}
            <Typography variant="h6" noWrap component="div" fontWeight="bold">
              Golos Store
            </Typography>
          </Box>
        </Toolbar>
      </Paper>
      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.22) }} />
      <List sx={{ px: 1, py: 2 }}>
        {visibleMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname.endsWith(item.path)}
              onClick={() => navigate(item.path)}
              sx={navItemSx(location.pathname.endsWith(item.path))}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Sección de Administración - Solo para administradores */}
      {canAccessAdmin && (
        <>
          <Divider sx={{ my: 1, borderColor: alpha(theme.palette.divider, 0.22) }} />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>
              Administración
            </Typography>
          </Box>
          <List sx={{ px: 1, py: 0 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname.endsWith('admin/users')}
                onClick={() => navigate('admin/users')}
                sx={navItemSx(location.pathname.endsWith('admin/users'))}
              >
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary="Usuarios" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname.endsWith('admin/groups')}
                onClick={() => navigate('admin/groups')}
                sx={navItemSx(location.pathname.endsWith('admin/groups'))}
              >
                <ListItemIcon>
                  <GroupWork />
                </ListItemIcon>
                <ListItemText primary="Grupos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname.includes('/store/ops')}
                onClick={() => navigate('/store/ops')}
                sx={navItemSx(location.pathname.includes('/store/ops'))}
              >
                <ListItemIcon>
                  <Storefront />
                </ListItemIcon>
                <ListItemText primary="Store Ops" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background:
            mode === 'light'
              ? `linear-gradient(135deg, ${alpha('#4f46e5', 0.76)} 0%, ${alpha('#06b6d4', 0.7)} 58%, ${alpha('#ec4899', 0.62)} 140%)`
              : `linear-gradient(135deg, ${alpha('#1d4ed8', 0.56)} 0%, ${alpha('#0e7490', 0.52)} 58%, ${alpha('#7e22ce', 0.44)} 140%)`,
          color: '#ffffff',
          boxShadow:
            mode === 'light'
              ? `0 10px 24px ${alpha('#4338ca', 0.26)}`
              : `0 10px 24px ${alpha('#000000', 0.4)}`,
          border: `1px solid ${
            mode === 'light' ? alpha('#a5f3fc', 0.3) : alpha('#93c5fd', 0.22)
          }`,
          borderBottom: 'none',
          backdropFilter: 'blur(16px) saturate(145%)',
          WebkitBackdropFilter: 'blur(16px) saturate(145%)',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 0,
            height: 1,
            background:
              mode === 'light'
                ? `linear-gradient(90deg, transparent, ${alpha('#a5f3fc', 0.8)}, transparent)`
                : `linear-gradient(90deg, transparent, ${alpha('#93c5fd', 0.5)}, transparent)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 2 },
            gap: 0.5,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: { xs: 0.5, sm: 1.5 },
              display: { sm: 'none' },
              width: 38,
              height: 38,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 600,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '@media (max-width:360px)': {
                fontSize: '0.84rem',
              },
            }}
          >
            {brandingLogoUrl ? (
              <Box
                component="img"
                src={brandingLogoUrl}
                alt="Logo tienda"
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: `1px solid ${alpha('#ffffff', 0.35)}`,
                  backgroundColor: alpha('#ffffff', 0.2),
                  flexShrink: 0,
                }}
              />
            ) : null}
            Panel de Gestión
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
              flexShrink: 0,
              '@media (max-width:360px)': {
                gap: 0.35,
              },
            }}
          >
            <IconButton
              aria-label="alternar tema"
              onClick={toggleColorMode}
              color="inherit"
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                border: `1px solid ${alpha('#ffffff', 0.25)}`,
                bgcolor: alpha('#ffffff', 0.08),
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                },
              }}
            >
              {mode === 'dark' ? (
                <LightMode sx={{ fontSize: { xs: 20, sm: 22 } }} />
              ) : (
                <DarkMode sx={{ fontSize: { xs: 20, sm: 22 } }} />
              )}
            </IconButton>
            {canSwitchToStore && (
              <Button
                onClick={() => navigate('/store')}
                color="inherit"
                variant="outlined"
                startIcon={<Storefront sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                sx={{
                  minWidth: { xs: 0, sm: 110 },
                  px: { xs: 1, sm: 1.2 },
                  height: { xs: 36, sm: 40 },
                  borderRadius: 999,
                  borderColor: alpha('#ffffff', 0.32),
                  color: 'white',
                  bgcolor: alpha('#ffffff', 0.08),
                  '&:hover': {
                    borderColor: alpha('#ffffff', 0.5),
                    backgroundColor: alpha('#ffffff', 0.2),
                  },
                  '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Tienda
                </Box>
              </Button>
            )}
            <Button
              aria-label="account of current user"
              onClick={handleMenuOpen}
              color="inherit"
              variant="text"
              disableElevation
              disableRipple
              sx={{
                minWidth: 0,
                px: { xs: 0.6, sm: 0.9 },
                py: 0.25,
                height: { xs: 36, sm: 40 },
                borderRadius: 999,
                border: `1px solid ${alpha('#ffffff', 0.25)}`,
                bgcolor: alpha('#ffffff', 0.08),
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.4, sm: 0.8 },
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                },
              }}
            >
              <Avatar sx={{ 
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                bgcolor: alpha('#ffffff', 0.22),
                color: 'white',
                fontWeight: 'bold',
              }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  maxWidth: { xs: 52, sm: 110 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  '@media (max-width:360px)': {
                    maxWidth: 46,
                    fontSize: '0.72rem',
                  },
                }}
              >
                {user?.username}
              </Typography>
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.96),
                  backdropFilter: 'blur(8px)',
                },
              }}
            >
              <MenuItem onClick={handleProfileClick}>
                <AccountCircle sx={{ mr: 2 }} />
                Perfil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 2 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
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
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              background:
                mode === 'light'
                  ? `linear-gradient(180deg, ${alpha('#4f46e5', 0.2)} 0%, ${alpha('#06b6d4', 0.16)} 55%, ${alpha('#ec4899', 0.14)} 100%)`
                  : `linear-gradient(180deg, ${alpha('#1d4ed8', 0.2)} 0%, ${alpha('#0e7490', 0.16)} 55%, ${alpha('#7e22ce', 0.12)} 100%)`,
              backdropFilter: 'blur(16px) saturate(145%)',
              WebkitBackdropFilter: 'blur(16px) saturate(145%)',
              border: `1px solid ${
                mode === 'light' ? alpha('#a5f3fc', 0.28) : alpha('#93c5fd', 0.2)
              }`,
              boxShadow:
                mode === 'light'
                  ? `3px 0 18px ${alpha('#4338ca', 0.18)}`
                  : `3px 0 18px ${alpha('#000000', 0.34)}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              background:
                mode === 'light'
                  ? `linear-gradient(180deg, ${alpha('#4f46e5', 0.2)} 0%, ${alpha('#06b6d4', 0.16)} 55%, ${alpha('#ec4899', 0.14)} 100%)`
                  : `linear-gradient(180deg, ${alpha('#1d4ed8', 0.2)} 0%, ${alpha('#0e7490', 0.16)} 55%, ${alpha('#7e22ce', 0.12)} 100%)`,
              backdropFilter: 'blur(16px) saturate(145%)',
              WebkitBackdropFilter: 'blur(16px) saturate(145%)',
              border: `1px solid ${
                mode === 'light' ? alpha('#a5f3fc', 0.28) : alpha('#93c5fd', 0.2)
              }`,
              boxShadow:
                mode === 'light'
                  ? `3px 0 18px ${alpha('#4338ca', 0.18)}`
                  : `3px 0 18px ${alpha('#000000', 0.34)}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflowX: 'hidden',
          background:
            mode === 'light'
              ? `linear-gradient(180deg, ${alpha('#f8fafc', 0.96)} 0%, ${alpha('#eef2ff', 0.75)} 100%)`
              : `linear-gradient(180deg, ${alpha('#020617', 0.98)} 0%, ${alpha('#0f172a', 0.92)} 100%)`,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2, px: { xs: 0.5, sm: 1 } }}
          >
            {breadcrumbs.map((crumb) =>
              crumb.isLast ? (
                <Typography key={crumb.to} color="text.primary" fontWeight={600} variant="body2">
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={crumb.to}
                  component="button"
                  type="button"
                  underline="hover"
                  color="text.secondary"
                  onClick={() => navigate(crumb.to)}
                  sx={{ fontSize: '0.85rem' }}
                >
                  {crumb.label}
                </Link>
              ),
            )}
          </Breadcrumbs>
        )}
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout




