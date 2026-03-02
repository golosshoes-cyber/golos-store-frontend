import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Pagination,
  useTheme,
  useMediaQuery,
  Tooltip,
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
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Cargando proveedores...</Typography>
      </Paper>
    )
  }

  if (suppliers.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No se encontraron proveedores</Typography>
      </Paper>
    )
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
              <TableCell>Acciones</TableCell>
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
                      <Chip
                        label={supplier.is_active ? 'Activo' : 'Inactivo'}
                        color={supplier.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Editar proveedor">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(supplier)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar proveedor">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(supplier.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
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
