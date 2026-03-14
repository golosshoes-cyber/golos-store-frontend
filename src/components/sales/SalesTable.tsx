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
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material'
import { Sale } from '../../types'
import { formatCurrency } from '../../utils/currency'

interface SalesTableProps {
  sales: Sale[]
  loading: boolean
  onEdit: (sale: Sale) => void
  onConfirm: (saleId: number) => void
  onCancel: (saleId: number) => void
  onViewDetails: (sale: Sale) => void
  // Nuevos props
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  loading,
  onEdit,
  onConfirm,
  onCancel,
  onViewDetails,
  selectedIds,
  onSelectionChange,
  currentSort,
  onSortChange,
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

  // Lógica de selección
  const isAllSelected = sales.length > 0 && selectedIds.length === sales.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(sales.map(s => s.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  // Lógica de ordenamiento interactivo
  const handleSortToggle = (field: string) => {
    if (currentSort === `${field}-asc`) {
      onSortChange(`${field}-desc`)
    } else {
      onSortChange(`${field}-asc`)
    }
  }

  const getSortIcon = (field: string) => {
    if (currentSort === `${field}-asc`) return <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
    if (currentSort === `${field}-desc`) return <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
    return null
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
        <Table size="small">
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <input 
                  type="checkbox" 
                  style={{ accentColor: theme.palette.text.primary, width: 14, height: 14 }} 
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell 
                onClick={() => handleSortToggle('customer')}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Cliente {getSortIcon('customer')}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => onSortChange(currentSort === 'newest' ? 'oldest' : 'newest')}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Fecha {currentSort === 'newest' ? <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} /> : currentSort === 'oldest' ? <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} /> : null}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSortToggle('total')}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Total {getSortIcon('total')}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Método Pago</TableCell>
              <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => {
              const statusColor = getStatusColor(sale.status)
              const isSelected = selectedIds.includes(sale.id)
              return (
                <TableRow 
                  key={sale.id} 
                  hover 
                  selected={isSelected}
                  sx={{
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) },
                    '&.Mui-selected': { bgcolor: alpha(theme.palette.text.primary, 0.04) },
                    '&.Mui-selected:hover': { bgcolor: alpha(theme.palette.text.primary, 0.06) }
                  }}
                >
                  <TableCell padding="checkbox" sx={{ pl: 2 }}>
                    <input 
                      type="checkbox" 
                      style={{ accentColor: theme.palette.text.primary, width: 14, height: 14 }} 
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(sale.id, e.target.checked)}
                    />
                  </TableCell>
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
    </Box>
  )
}

export default SalesTable
