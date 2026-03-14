import React, { useState } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material'
import type { DjangoUser, DjangoGroup } from '../../types/auth'

interface UserTableProps {
  title?: string
  users: DjangoUser[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (page: number) => void
  onEdit: (user: DjangoUser) => void
  onDelete: (userId: number) => void
  onView: (user: DjangoUser) => void
  onRefresh: () => void
}

const UserTable: React.FC<UserTableProps> = ({
  title = "Lista de Usuarios",
  users,
  loading,
  page,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  onRefresh,
}) => {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm)
  )

  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage)
  }

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        borderRadius: '24px', 
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}
    >
      {/* Encabezado de la Tarjeta */}
      <Box sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
          {title}
        </Typography>
        <Box sx={{ 
          px: 1.2, py: 0.4, borderRadius: 1.5, 
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.text.primary, 0.01)
        }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>
            Total: {totalCount}
          </Typography>
        </Box>
      </Box>

      {/* Barra de búsqueda y acciones */}
      <Box sx={{ p: 3, pt: 1, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <SearchIcon sx={{ fontSize: 16, transform: 'rotate(45deg)' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: alpha(theme.palette.text.primary, 0.015),
                px: 1.5,
                '& fieldset': { borderColor: alpha(theme.palette.divider, 0.5) },
                '&:hover fieldset': { borderColor: theme.palette.text.disabled },
              },
              '& .MuiInputBase-input': { py: 1.2, fontSize: '14px' }
            }}
          />
          <Tooltip title="Actualizar lista">
            <span>
              <IconButton 
                size="small" 
                onClick={onRefresh} 
                disabled={loading}
                sx={{ 
                  width: 44, height: 44,
                  bgcolor: alpha(theme.palette.text.primary, 0.02),
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`, 
                  borderRadius: '12px',
                  '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) }
                }}
              >
                <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabla de usuarios */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.02)' }}>
              <TableCell sx={{ py: 1.2, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Usuario</TableCell>
              <TableCell sx={{ py: 1.2, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</TableCell>
              <TableCell sx={{ py: 1.2, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre Completo</TableCell>
              <TableCell sx={{ py: 1.2, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grupos</TableCell>
              <TableCell sx={{ py: 1.2, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Staff</TableCell>
              <TableCell sx={{ py: 1.2, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado</TableCell>
              <TableCell align="center" sx={{ py: 1.2, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Cargando...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No se encontraron usuarios</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ py: 1, fontSize: '13px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '13px' }}>{user.email}</TableCell>
                  <TableCell sx={{ py: 1, fontSize: '13px' }}>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell sx={{ py: 1.2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {(user.groups || []).map((group: DjangoGroup) => {
                        const colors: Record<string, string> = {
                          'Managers': '#ef4444',
                          'Inventory': '#f59e0b',
                          'Sales': '#10b981',
                          'Customers': '#3b82f6',
                          'StoreOps': '#6366f1'
                        }
                        const color = colors[group.name] || theme.palette.text.secondary
                        return (
                          <Chip
                            key={group.id}
                            label={group.name}
                            size="small"
                            sx={{ 
                              fontSize: '10px', 
                              height: 18, 
                              fontWeight: 600,
                              bgcolor: color,
                              color: 'white',
                              borderRadius: '4px'
                            }}
                          />
                        )
                      })}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1.2 }}>
                    <Chip
                      label={user.is_staff ? 'Sí' : 'No'}
                      size="small"
                      sx={{ 
                        fontSize: '10px', 
                        height: 20, 
                        fontWeight: 800,
                        bgcolor: user.is_staff ? 'text.primary' : alpha(theme.palette.text.disabled, 0.1),
                        color: user.is_staff ? 'background.paper' : 'text.secondary',
                        px: 0.5,
                        borderRadius: '4px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.2 }}>
                    <Chip
                      label={user.is_active ? 'Activo' : 'Inactivo'}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        fontSize: '10px', 
                        height: 20, 
                        fontWeight: 700,
                        color: user.is_active ? '#10b981' : '#ef4444',
                        borderColor: alpha(user.is_active ? '#10b981' : '#ef4444', 0.3),
                        bgcolor: alpha(user.is_active ? '#10b981' : '#ef4444', 0.02),
                        borderRadius: '4px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      {[
                        { icon: <ViewIcon sx={{ fontSize: 16 }} />, color: 'inherit', title: 'Ver detalles', onClick: () => onView(user) },
                        { icon: <EditIcon sx={{ fontSize: 16 }} />, color: '#f59e0b', title: 'Editar usuario', onClick: () => onEdit(user) },
                        { icon: <DeleteIcon sx={{ fontSize: 16 }} />, color: '#ef4444', title: 'Eliminar usuario', onClick: () => onDelete(user.id) }
                      ].map((action, idx) => (
                        <Tooltip key={idx} title={action.title}>
                          <IconButton 
                            size="small" 
                            onClick={action.onClick}
                            sx={{ 
                              color: action.color === 'inherit' ? theme.palette.text.primary : action.color,
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                bgcolor: alpha(action.color === 'inherit' ? theme.palette.text.primary : action.color, 0.1),
                              }
                            }}
                          >
                            {action.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <TablePagination
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          labelRowsPerPage="Filas por página"
          component="div"
        />
      </Box>

    </Paper>
  )
}

export default UserTable
