import React, { useState } from 'react'
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
  SystemUpdateAlt as ExportacionesIcon,
  StoreOutlined as ProveedoresIcon,
  NotificationsNone as NotificacionesIcon,
  ArrowForward as ArrowForwardIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import {
  TextField,
  Autocomplete,
  Popper,
} from '@mui/material'
import { productService } from '../services/productService'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCommonPermissions } from '../hooks/auth/usePermissions'
import { useThemeMode } from '../contexts/ThemeModeContext'

const drawerWidth = 220

const menuSections = [
  {
    label: 'General',
    items: [
      { text: 'Dashboard', icon: <GridViewIcon />, path: 'dashboard' },
      { text: 'Productos', icon: <AddBoxIcon />, path: 'products' },
      { text: 'Ventas', icon: <ShoppingCartIcon />, path: 'sales' },
      { text: 'Compras', icon: <ComprasIcon />, path: 'purchases' },
      { text: 'Inventario', icon: <InventarioIcon />, path: 'inventory' },
    ]
  },
  {
    label: 'Análisis',
    items: [
      { text: 'Reportes', icon: <ReportesIcon />, path: 'reports' },
      { text: 'Exportaciones', icon: <ExportacionesIcon />, path: 'exports' },
    ]
  },
  {
    label: 'Config',
    items: [
      { text: 'Proveedores', icon: <ProveedoresIcon />, path: 'suppliers' },
      { text: 'Notificaciones', icon: <NotificacionesIcon />, path: 'notifications' },
    ]
  }
]

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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

  // Get products for names in search
  const { data: productsData } = useQuery({
    queryKey: ['products-for-names'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
  })
  const getProductName = (productId: number | string) => {
    const products = productsData?.results || []
    const product = products.find(p => p.id === productId)
    return product ? product.name : `Producto #${productId}`
  }

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
    'store/ops': 'Operaciones',
    sales: 'Ventas',
    inventory: 'Inventario',
    reports: 'Reportes',
    notifications: 'Notificaciones',
    exports: 'Exportaciones',
    profile: 'Perfil',
    admin: 'Administración',
    users: 'Usuarios',
    groups: 'Grupos',
    ops: 'Operaciones',
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
      fontSize: '0.75rem',
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
          width: 24,
          height: 24,
          bgcolor: 'text.primary',
          color: 'background.default',
          borderRadius: 0.8, // More square
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '-0.5px'
        }}>
          GS
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', letterSpacing: '-0.3px' }}>
          Golos Store
        </Typography>
      </Box>

      <Box sx={{ flex: 1, py: 0.5, overflowY: 'auto' }}>
        {visibleSections.map((section) => (
          <Box key={section.label} sx={{ mb: 0.8 }}>
            <Typography variant="caption" sx={{
              px: 2,
              py: 0.2,
              display: 'block',
              fontSize: '9px',
              fontWeight: 600,
              color: 'text.secondary',
              opacity: 0.35,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              {section.label}
            </Typography>
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
                  selected={location.pathname.includes('admin/users')}
                  onClick={() => navigate('admin/users')}
                  sx={navItemSx(location.pathname.includes('admin/users'))}
                >
                  <ListItemIcon>
                    <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
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
                    <GroupWorkIcon sx={{ fontSize: 16 }} />
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
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>
              {breadcrumbLabels[pathSegments[0]] || 'Dashboard'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Autocomplete
              open={searchOpen && searchValue.length >= 2}
              onOpen={() => searchValue.length >= 2 && setSearchOpen(true)}
              onClose={() => setSearchOpen(false)}
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
                  placeholder="Buscar producto"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <SearchIcon sx={{ ml: 1, fontSize: 16, color: 'text.disabled' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02),
                      borderRadius: 1.5,
                      height: 32,
                      fontSize: '12px',
                      '& fieldset': { borderColor: theme.palette.divider },
                    },
                    minWidth: 160,
                  }}
                />
              )}
              renderOption={(props, option: any) => {
                const { key, ...other } = props
                return (
                  <li key={key} {...other}>
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px' }}>
                        {option.sku}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {getProductName(option.product)} {option.size} {option.color || ''}
                      </Typography>
                    </Box>
                  </li>
                )
              }}
              PopperComponent={(props) => <Popper {...props} sx={{ zIndex: 1400 }} />}
            />

            <Button
              onClick={() => window.open('https://tienda.golosshoes.shop', '_blank')}
              variant="outlined"
              size="small"
              startIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{
                fontSize: '11px',
                height: 32,
                px: 1.5,
                borderRadius: 1.5,
                color: 'text.secondary',
                borderColor: theme.palette.divider,
                textTransform: 'none',
                '&:hover': { borderColor: 'text.primary', bgcolor: 'transparent' }
              }}
            >
              Tienda
            </Button>

            <Button
              onClick={() => navigate('/products/new')}
              variant="contained"
              size="small"
              sx={{
                fontSize: '11px',
                height: 32,
                px: 1.5,
                borderRadius: 1.5,
                bgcolor: 'text.primary',
                color: 'background.default',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: 'text.secondary' }
              }}
            >
              + Producto
            </Button>

            <Button
              onClick={() => navigate('/sales/new')}
              variant="contained"
              size="small"
              sx={{
                fontSize: '11px',
                height: 32,
                px: 1.5,
                borderRadius: 1.5,
                bgcolor: 'text.primary',
                color: 'background.default',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: 'text.secondary' }
              }}
            >
              + Venta
            </Button>

            <IconButton onClick={toggleColorMode} size="small" sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary'
            }}>
              {mode === 'dark' ? <LightMode sx={{ fontSize: 16 }} /> : <DarkMode sx={{ fontSize: 16 }} />}
            </IconButton>
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
        disableScrollLock
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mb: 1, // Offset from bottom trigger
            minWidth: 160,
            boxShadow: theme.palette.mode === 'light' ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 10px 15px -3px rgba(0,0,0,0.5)',
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Mi Perfil" primaryTypographyProps={{ fontSize: '13px' }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontSize: '13px' }} />
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default MainLayout
