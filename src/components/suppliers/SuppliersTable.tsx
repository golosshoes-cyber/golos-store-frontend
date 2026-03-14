import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  alpha,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Supplier } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { useThemeMode } from '../../contexts/ThemeModeContext'

interface SuppliersTableProps {
  suppliers: Supplier[]
  loading: boolean
  onEdit: (supplier: Supplier) => void
  onDelete: (supplierId: number) => void
  search: string
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  loading,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme()
  const { mode } = useThemeMode()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleEdit = (supplier: Supplier) => {
    onEdit(supplier)
  }

  const handleDelete = (supplierId: number) => {
    onDelete(supplierId)
  }

  if (suppliers.length === 0 && !loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          No se encontraron proveedores
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <TableContainer sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: mode === 'light' ? alpha('#000', 0.01) : alpha('#fff', 0.01) }}>
              <TableCell sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>Nombre</TableCell>
              {!isMobile && (
                <>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>Teléfono</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>Dirección</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>NIT</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>Precio Promedio</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>Última Compra</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>Estado</TableCell>
                </>
              )}
              <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 600, py: 1 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                    {supplier.name}
                  </Typography>
                  {isMobile && (
                    <Box sx={{ mt: 0.5 }}>
                      {supplier.phone && (
                        <Typography sx={{ fontSize: '10px', color: 'text.secondary', display: 'block' }}>
                          Tel: {supplier.phone}
                        </Typography>
                      )}
                      {supplier.nit && (
                        <Typography sx={{ fontSize: '10px', color: 'text.secondary', display: 'block' }}>
                          NIT: {supplier.nit}
                        </Typography>
                      )}
                    </Box>
                  )}
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>{supplier.phone || '-'}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '11px', color: 'text.secondary', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {supplier.address || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>{supplier.nit || '-'}</TableCell>
                    <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>
                      {supplier.average_price ? formatCurrency(supplier.average_price) : '-'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>
                      {supplier.last_purchase_date ?
                        new Date(supplier.last_purchase_date).toLocaleDateString() : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        px: 1, 
                        py: 0.2, 
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: 600,
                        bgcolor: supplier.is_active ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.text.disabled, 0.08),
                        color: supplier.is_active ? 'success.main' : 'text.disabled',
                        border: `1px solid ${supplier.is_active ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.text.disabled, 0.2)}`
                      }}>
                        {supplier.is_active ? 'Activo' : 'Inactivo'}
                      </Box>
                    </TableCell>
                  </>
                )}
                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end" gap={0.2}>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(supplier)}
                        sx={{ 
                          p: 0.5,
                          color: 'text.secondary',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main' }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(supplier.id)}
                        sx={{ 
                          p: 0.5,
                          color: 'text.secondary',
                          '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08), color: 'error.main' }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default SuppliersTable
