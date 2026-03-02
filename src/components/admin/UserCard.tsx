import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Paper,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import type { DjangoUser, DjangoGroup } from '../../types/auth'
import { mobileCardDividerSx, mobileCardHeaderSx, mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

interface UserCardProps {
  user: DjangoUser
  onEdit: (user: DjangoUser) => void
  onDelete: (userId: number) => void
  onView: (user: DjangoUser) => void
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onView,
}) => {
  const theme = useTheme()

  const getGroupColor = (groupName: string) => {
    switch (groupName) {
      case 'Managers': return 'error'
      case 'Inventory': return 'warning'
      case 'Sales': return 'success'
      case 'Customers': return 'info'
      default: return 'default'
    }
  }

  return (
    <Card sx={{ ...mobileCardSx(theme), overflow: 'hidden' }}>
      {/* Header Visual Compacto */}
      <Box sx={mobileCardHeaderSx(theme)}>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
          {/* Información Principal */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.2rem', lg: '1.4rem' },
                lineHeight: 1.1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 0.5
              }}
            >
              {user.username}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                opacity: 0.9,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.email}
            </Typography>
          </Box>

          {/* Avatar con Iniciales */}
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              width: { xs: 32, sm: 38, lg: 42 },
              height: { xs: 32, sm: 38, lg: 42 },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <PersonIcon sx={{ fontSize: { xs: 16, sm: 20, lg: 22 }}} />
          </Avatar>
        </Box>
      </Box>

      {/* Contenido Principal */}
      <CardContent sx={{ p: { xs: 1, sm: 1.25 } }}>
        {/* Grupos del Usuario */}
        {user.groups && user.groups.length > 0 && (
          <Box sx={{ mb: 2, overflow: 'hidden' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Grupos
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              flexWrap: 'wrap',
              overflow: 'hidden'
            }}>
              {user.groups.map((group: DjangoGroup) => (
                <Chip
                  key={group.id}
                  label={group.name}
                  size="small"
                  color={getGroupColor(group.name) as any}
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    height: { xs: 20, sm: 24 },
                    maxWidth: '100%',
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Estado del Usuario */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 1, sm: 2 },
            mb: { xs: 1.5, sm: 2 },
            overflow: 'hidden' // Prevenir overflow en grid
          }}
        >
          {/* Estado Activo/Inactivo */}
          <Paper sx={mobileMetricSx(theme, user.is_active ? 'success' : 'error')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Estado
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={user.is_active ? 'success.main' : 'error.main'}
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              {user.is_active ? 'Activo' : 'Inactivo'}
            </Typography>
          </Paper>

          {/* Rol Staff */}
          <Paper sx={mobileMetricSx(theme, user.is_staff ? 'primary' : 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Rol
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={user.is_staff ? 'primary.main' : 'text.secondary'}
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              {user.is_staff ? 'Staff' : 'Usuario'}
            </Typography>
          </Paper>
        </Box>

        {/* Información Adicional */}
        {(user.first_name || user.last_name) && (
          <Box sx={{ mb: 2, overflow: 'hidden' }}>
            <Paper
              sx={{
                ...mobileMetricSx(theme, 'neutral'),
                overflow: 'hidden'
              }}
            >
              <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
                Nombre Completo
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.first_name} {user.last_name}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Acciones */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            pt: 2,
            ...mobileCardDividerSx(theme)
          }}
        >
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={() => onView(user)}
              color="primary"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => onEdit(user)}
              color="warning"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => onDelete(user.id)}
              color="error"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserCard
