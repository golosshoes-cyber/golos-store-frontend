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
  Pagination,
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

interface SuppliersTableProps {
  suppliers: Supplier[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (page: number) => void
  onEdit: (supplier: Supplier) => void
  onDelete: (supplierId: number) => void
  search: string
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  loading,
  page,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleEdit = (supplier: Supplier) => {
    onEdit(supplier)
  }

  const handleDelete = (supplierId: number) => {
    onDelete(supplierId)
  }

  if (loading) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="body2" color="text.secondary">Cargando proveedores...</Typography>
      </Box>
    )
  }

  if (suppliers.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="body2" color="text.secondary">No se encontraron proveedores</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <TableContainer 
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              {!isMobile && (
                <>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>NIT</TableCell>
                  <TableCell>Precio Promedio</TableCell>
                  <TableCell>Última Compra</TableCell>
                  <TableCell>Estado</TableCell>
                </>
              )}
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {supplier.name}
                    </Typography>
                    {isMobile && (
                      <Box sx={{ mt: 1 }}>
                        {supplier.phone && (
                          <Typography variant="caption" color="text.secondary">
                            Tel: {supplier.phone}
                          </Typography>
                        )}
                        {supplier.nit && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            NIT: {supplier.nit}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell>{supplier.phone || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {supplier.address || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>{supplier.nit || '-'}</TableCell>
                    <TableCell>
                      {supplier.average_price ? formatCurrency(supplier.average_price) : '-'}
                    </TableCell>
                    <TableCell>
                      {supplier.last_purchase_date ?
                        new Date(supplier.last_purchase_date).toLocaleDateString() : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        px: 1, 
                        py: 0.25, 
                        borderRadius: '999px',
                        fontSize: '11px',
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
                    <Box display="flex" justifyContent="flex-end" gap={0.5}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(supplier)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main' }
                          }}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(supplier.id)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08), color: 'error.main' }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalCount > 20 && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Pagination
            count={Math.ceil(totalCount / 20)}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}
    </Box>
  )
}

export default SuppliersTable
