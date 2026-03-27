import React from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  alpha,
  useTheme,
  Stack,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PointOfSale as PointOfSaleIcon,
} from '@mui/icons-material'
import { Sale } from '../../types'
import { formatCurrency } from '../../utils/currency'

interface SalesMobileListProps {
  sales: Sale[]
  loading: boolean
  onEdit: (sale: Sale) => void
  onConfirm: (saleId: number) => void
  onCancel: (saleId: number) => void
  onViewDetails: (sale: Sale) => void
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
}

const SalesMobileList: React.FC<SalesMobileListProps> = ({
  sales,
  loading,
  onEdit,
  onConfirm,
  onCancel,
  onViewDetails,
  selectedIds,
  onSelectionChange,
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
      case 'completed': return 'Completada'
      case 'confirmed': return 'Confirmada'
      case 'pending': return 'Pendiente'
      case 'cancelled':
      case 'canceled': return 'Cancelada'
      default: return status
    }
  }

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id])
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    )
  }

  if (sales.length === 0) {
    return (
      <Box p={4} textAlign="center" bgcolor="background.paper" borderRadius={2} border={`1px solid ${theme.palette.divider}`}>
        <Typography variant="body2" color="text.secondary">No se encontraron ventas con estos filtros.</Typography>
      </Box>
    )
  }

  const isAllSelected = sales.length > 0 && selectedIds.length === sales.length
  const handleSelectAll = (checked: boolean) => {
    if (checked) onSelectionChange(sales.map(s => s.id))
    else onSelectionChange([])
  }

  return (
    <Box>
      {/* Controles superiores Mobile */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 0.5 }}>
        <input 
          type="checkbox" 
          style={{ accentColor: theme.palette.text.primary, width: 16, height: 16, marginRight: 12 }} 
          checked={isAllSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {selectedIds.length > 0 ? `${selectedIds.length} seleccionadas` : 'Seleccionar todas'}
        </Typography>
      </Box>

      {/* Lista de Tarjetas */}
      <Stack spacing={1.5}>
        {sales.map((sale) => {
          const statusColor = getStatusColor(sale.status)
          const isSelected = selectedIds.includes(sale.id)
          
          return (
            <Card 
              key={sale.id} 
              variant="outlined" 
              sx={{ 
                borderRadius: 2,
                borderColor: isSelected ? 'text.primary' : 'divider',
                bgcolor: isSelected ? alpha(theme.palette.text.primary, 0.02) : 'background.paper',
                transition: 'all 0.2s ease',
              }}
            >
              <CardContent sx={{ p: 2, pb: 1.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Box display="flex" alignItems="flex-start" gap={1.5}>
                    <input 
                      type="checkbox" 
                      style={{ accentColor: theme.palette.text.primary, width: 16, height: 16, marginTop: 4 }} 
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(sale.id, e.target.checked)}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                        {sale.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(sale.created_at).toLocaleDateString()} • {sale.payment_method || 'Sin método'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    px: 1, 
                    py: 0.25, 
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 700,
                    bgcolor: alpha(theme.palette[statusColor].main, 0.08),
                    color: `${statusColor}.main`,
                    border: `1px solid ${alpha(theme.palette[statusColor].main, 0.2)}`
                  }}>
                    {getStatusLabel(sale.status)}
                  </Box>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="baseline" mt={2}>
                  <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                    <PointOfSaleIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>Total</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    {formatCurrency(sale.total)}
                  </Typography>
                </Box>
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ px: 1.5, py: 1, justifyContent: 'flex-end' }}>
                <Box display="flex" gap={1}>
                  {sale.status === 'pending' && (
                    <IconButton size="small" onClick={() => onCancel(sale.id)} sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                      <CancelIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  {sale.status === 'pending' && (
                    <IconButton size="small" onClick={() => onEdit(sale)} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  {sale.status === 'pending' && (
                    <IconButton size="small" onClick={() => onConfirm(sale.id)} sx={{ color: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={() => onViewDetails(sale)} sx={{ color: 'text.secondary', bgcolor: alpha(theme.palette.text.secondary, 0.05) }}>
                    <VisibilityIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          )
        })}
      </Stack>
    </Box>
  )
}

export default SalesMobileList
