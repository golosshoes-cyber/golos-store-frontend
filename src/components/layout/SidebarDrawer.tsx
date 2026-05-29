import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Button,
  MenuItem,
  alpha,
  ClickAwayListener,
  Paper as PopoverPaper,
} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  GroupWork as GroupWorkIcon,
} from '@mui/icons-material'

interface NavItem {
  text: string
  icon: React.ReactElement
  path: string
}

interface MenuSection {
  label: string
  items: NavItem[]
}

interface SidebarDrawerProps {
  mode: 'light' | 'dark'
  branding: { store_name?: string; logo_url?: string | null } | undefined
  visibleSections: MenuSection[]
  pathname: string
  onNavigate: (path: string) => void
  username: string | undefined
  isAdmin: boolean
  canAccessAdmin: boolean
  anchorEl: HTMLElement | null
  onMenuOpen: () => void
  onMenuClose: () => void
  onLogout: () => void
  profileButtonRef: React.RefObject<HTMLElement | null>
  onMobileClose?: () => void
}

const navItemSx = (selected: boolean, mode: 'light' | 'dark') => ({
  borderRadius: 1.2,
  mx: 0.5,
  my: 0.1,
  py: 0.3,
  px: 1.2,
  minHeight: 34,
  '& .MuiListItemIcon-root': {
    minWidth: 24,
    color: selected ? 'text.primary' : 'text.secondary',
    opacity: selected ? 1 : 0.7,
  },
  '& .MuiListItemText-primary': {
    fontSize: '13px',
    fontWeight: selected ? 500 : 400,
    color: selected ? 'text.primary' : 'text.secondary',
  },
  '&.Mui-selected': {
    backgroundColor: mode === 'light' ? 'action.hover' : alpha('#fff', 0.04),
    color: 'text.primary',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: mode === 'light' ? 'action.selected' : alpha('#fff', 0.06),
    },
  },
  '&:hover': {
    backgroundColor: mode === 'light' ? 'action.hover' : alpha('#fff', 0.03),
    color: 'text.primary',
  },
})

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  mode, branding, visibleSections, pathname, onNavigate,
  username, isAdmin, canAccessAdmin,
  anchorEl, onMenuOpen, onMenuClose, onLogout, profileButtonRef, onMobileClose,
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 1.5,
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <Box sx={{
          width: 26, height: 26,
          bgcolor: 'text.primary',
          color: 'background.default',
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '-0.5px',
          overflow: 'hidden',
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

      <Box sx={{ flex: 1, minHeight: 0, py: 0.5, overflowY: 'auto' }}>
        {visibleSections.map(section => (
          <Box key={section.label} sx={{ mb: 0.8 }}>
            {section.label && (
              <Typography variant="caption" sx={{
                px: 2, py: 0.2, display: 'block', fontSize: '10px', fontWeight: 500,
                color: 'text.secondary', opacity: 0.5, letterSpacing: '0.6px', textTransform: 'uppercase',
              }}>
                {section.label}
              </Typography>
            )}
            <List sx={{ px: 0, py: 0.1 }}>
              {section.items.map(item => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0 }}>
                  <ListItemButton
                    selected={pathname.includes(item.path)}
                    onClick={() => onNavigate(item.path)}
                    sx={navItemSx(pathname.includes(item.path), mode)}
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
              px: 2, py: 0.3, display: 'block', fontSize: '8px', fontWeight: 600,
              color: 'text.secondary', opacity: 0.3, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Administración
            </Typography>
            <List sx={{ px: 0, py: 0 }}>
              <ListItem disablePadding sx={{ mb: 0.2 }}>
                <ListItemButton
                  selected={pathname.includes('/settings/users')}
                  onClick={() => onNavigate('/settings/users')}
                  sx={navItemSx(pathname.includes('/settings/users'), mode)}
                >
                  <ListItemIcon>
                    <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText primary="Usuarios" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.2 }}>
                <ListItemButton
                  selected={pathname.includes('/settings/groups')}
                  onClick={() => onNavigate('/settings/groups')}
                  sx={navItemSx(pathname.includes('/settings/groups'), mode)}
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

        <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2, mb: 2, px: 2 }}>
          <Typography variant="overline" sx={{ px: 1, display: 'block', mb: 1, fontSize: '10px', color: 'text.disabled', fontWeight: 600 }}>
            Acciones Rápidas
          </Typography>
          <Button
            fullWidth size="small" variant="contained"
            onClick={() => { onMobileClose?.(); onNavigate('/inventory/products?create=true'); }}
            sx={{ mb: 1, borderRadius: 1.5, fontSize: '12px', justifyContent: 'flex-start', px: 2, bgcolor: 'text.primary', color: 'background.default' }}
          >
            + Nuevo Producto
          </Button>
          <Button
            fullWidth size="small" variant="contained"
            onClick={() => { onMobileClose?.(); onNavigate('/sales/orders?create=true'); }}
            sx={{ borderRadius: 1.5, fontSize: '12px', justifyContent: 'flex-start', px: 2, bgcolor: 'text.primary', color: 'background.default' }}
          >
            + Nueva Venta
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', position: 'relative' }}>
        {Boolean(anchorEl) && (
          <ClickAwayListener onClickAway={onMenuClose}>
            <PopoverPaper
              elevation={4}
              sx={{
                position: 'absolute',
                bottom: 'calc(100% + 4px)',
                left: 8,
                right: 8,
                zIndex: 9999,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.5,
                overflow: 'hidden',
                boxShadow: mode === 'light'
                  ? '0 -4px 20px rgba(0,0,0,0.1)'
                  : '0 -4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <MenuItem onClick={() => { onNavigate('/profile'); onMenuClose(); }} sx={{ fontSize: '13px', py: 1, gap: 1 }}>
                <AccountCircleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                Mi Perfil
              </MenuItem>
              <Divider sx={{ my: 0 }} />
              <MenuItem onClick={onLogout} sx={{ fontSize: '13px', py: 1, gap: 1, color: 'error.main' }}>
                <LogoutIcon sx={{ fontSize: 18 }} />
                Cerrar Sesión
              </MenuItem>
            </PopoverPaper>
          </ClickAwayListener>
        )}
        <Box
          ref={profileButtonRef}
          onClick={onMenuOpen}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.2, p: 1,
            borderRadius: 1.5, cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Avatar sx={{ width: 28, height: 28, fontSize: '11px', fontWeight: 600, bgcolor: 'text.primary', color: 'background.default' }}>
            {username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 500 }} noWrap>
              {username}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '11px', color: 'text.secondary', display: 'block' }}>
              {isAdmin ? 'Administrador' : 'Usuario'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default React.memo(SidebarDrawer)
