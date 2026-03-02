import React, { useState } from 'react'
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
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Barra de búsqueda y acciones */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <Box sx={{ ml: 'auto' }}>
          <Tooltip title="Actualizar lista">
            <span>
              <IconButton onClick={onRefresh} disabled={loading}>
                <SearchIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabla de usuarios */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Grupos</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
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
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {(user.groups || []).map((group: DjangoGroup) => (
                        <Chip
                          key={group.id}
                          label={group.name}
                          size="small"
                          color={getGroupColor(group.name) as any}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_staff ? 'Sí' : 'No'}
                      color={user.is_staff ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Activo' : 'Inactivo'}
                      color={user.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" onClick={() => onView(user)} color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar usuario">
                        <IconButton size="small" onClick={() => onEdit(user)} color="warning">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar usuario">
                        <IconButton size="small" onClick={() => onDelete(user.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
