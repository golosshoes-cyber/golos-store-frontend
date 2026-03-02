import React from 'react'
import { Box, Paper, Typography, Chip, List, ListItem, ListItemText } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useCommonPermissions } from '../../hooks/auth/usePermissions'

const DebugPermissions: React.FC = () => {
  const { user, isAdmin, isStaff } = useAuth()
  const permissions = useCommonPermissions()

  if (!user) {
    return <Typography>No hay usuario autenticado</Typography>
  }

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        🔍 Debug de Permisos
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Usuario Actual:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary={`Username: ${user.username}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Email: ${user.email}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`is_staff: ${user.is_staff}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`is_superuser: ${user.is_superuser}`} />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          AuthContext:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary={`isAuthenticated: ${!!user}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`isAdmin: ${isAdmin}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`isStaff: ${isStaff}`} />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Permisos de Usuario:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`canManageUsers: ${permissions.canManageUsers}`} color={permissions.canManageUsers ? 'success' : 'default'} />
          <Chip label={`canCreateUser: ${permissions.canCreateUser}`} color={permissions.canCreateUser ? 'success' : 'default'} />
          <Chip label={`canEditUser: ${permissions.canEditUser}`} color={permissions.canEditUser ? 'success' : 'default'} />
          <Chip label={`canDeleteUser: ${permissions.canDeleteUser}`} color={permissions.canDeleteUser ? 'success' : 'default'} />
          <Chip label={`canViewDashboard: ${permissions.canViewDashboard}`} color={permissions.canViewDashboard ? 'success' : 'default'} />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Lógica de Acceso a Administración:
        </Typography>
        <Chip
          label={`canAccessAdmin (canManageUsers || isAdmin): ${permissions.canManageUsers || isAdmin}`}
          color={(permissions.canManageUsers || isAdmin) ? 'success' : 'error'}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Grupos del Usuario (crudo):
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {JSON.stringify((user as any).groups || [], null, 2)}
        </Typography>
      </Box>
    </Paper>
  )
}

export default DebugPermissions
