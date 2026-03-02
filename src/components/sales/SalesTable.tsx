import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Pagination,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { Sale } from '../../types'
import { formatCurrency } from '../../utils/currency'

interface SalesTableProps {
  sales: Sale[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (page: number) => void
  onEdit: (sale: Sale) => void
  onConfirm: (saleId: number) => void
  onCancel: (saleId: number) => void
  onViewDetails: (sale: Sale) => void
}

const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  loading,
  page,
  totalCount,
  onPageChange,
  onEdit,
  onConfirm,
  onCancel,
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'confirmed':
        return 'primary'
      case 'pending':
        return 'warning'
      case 'cancelled':
      case 'canceled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
      case 'canceled':
        return 'Cancelada'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <Typography variant="h4" component="h2">
          Ventas
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Metodo Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>
                  {new Date(sale.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatCurrency(sale.total)}</TableCell>
                <TableCell>{sale.payment_method || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(sale.status)}
                    color={getStatusColor(sale.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails(sale)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {sale.status === 'pending' && (
                      <Tooltip title="Editar venta">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(sale)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {sale.status === 'pending' && (
                      <Tooltip title="Confirmar venta">
                        <IconButton
                          size="small"
                          onClick={() => onConfirm(sale.id)}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {sale.status === 'pending' && (
                      <Tooltip title="Cancelar venta">
                        <IconButton
                          size="small"
                          onClick={() => onCancel(sale.id)}
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalCount && totalCount > 20 && (
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={Math.ceil(totalCount / 20)}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
          />
        </Box>
      )}
    </Paper>
  )
}

export default SalesTable
