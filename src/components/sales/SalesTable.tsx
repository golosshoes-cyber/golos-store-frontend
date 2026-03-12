import React from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Pagination,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
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
  const theme = useTheme()

  const statusColorMap: Record<string, 'success' | 'primary' | 'warning' | 'error' | 'secondary'> = {
    completed: 'success',
    confirmed: 'primary',
    pending: 'warning',
    cancelled: 'error',
    canceled: 'error',
  }

  const getStatusColor = (status: string) => statusColorMap[status] || 'secondary'

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
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Método Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => {
              const statusColor = getStatusColor(sale.status)
              return (
                <TableRow key={sale.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {sale.customer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {new Date(sale.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(sale.total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {sale.payment_method || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      px: 1, 
                      py: 0.25, 
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      bgcolor: alpha(theme.palette[statusColor].main, 0.08),
                      color: `${statusColor}.main`,
                      border: `1px solid ${alpha(theme.palette[statusColor].main, 0.2)}`
                    }}>
                      {getStatusLabel(sale.status)}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={0.5} justifyContent="flex-end">
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(sale)}
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main' } }}
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      {sale.status === 'pending' && (
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(sale)}
                            sx={{ color: 'text.secondary', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main' } }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {sale.status === 'pending' && (
                        <Tooltip title="Confirmar">
                          <IconButton
                            size="small"
                            onClick={() => onConfirm(sale.id)}
                            sx={{ color: 'text.secondary', '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.08), color: 'success.main' } }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {sale.status === 'pending' && (
                        <Tooltip title="Cancelar">
                          <IconButton
                            size="small"
                            onClick={() => onCancel(sale.id)}
                            sx={{ color: 'text.secondary', '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08), color: 'error.main' } }}
                          >
                            <CancelIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {totalCount > 20 && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Pagination
            count={Math.ceil(totalCount / 20)}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
          />
        </Box>
      )}
    </Box>
  )
}

export default SalesTable
