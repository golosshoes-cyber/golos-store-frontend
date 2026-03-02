import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Paper,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { Sale } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { mobileCardDividerSx, mobileCardHeaderSx, mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

interface SalesCardProps {
  sale: Sale
  onEdit: (sale: Sale) => void
  onViewDetails: (sale: Sale) => void
  onConfirm: (saleId: number) => void
  onCancel: (saleId: number) => void
}

const SalesCard: React.FC<SalesCardProps> = ({
  sale,
  onEdit,
  onViewDetails,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme()
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'confirmed': return 'info'
      case 'pending': return 'warning'
      case 'canceled': return 'error'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada'
      case 'confirmed': return 'Confirmada'
      case 'pending': return 'Pendiente'
      case 'canceled': return 'Cancelada'
      case 'cancelled': return 'Cancelada'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card sx={mobileCardSx(theme)}>
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
              Venta #{sale.id}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
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
                {formatDate(sale.created_at)}
              </Typography>
              
              {/* Estado */}
              <Chip
                label={getStatusLabel(sale.status)}
                color={getStatusColor(sale.status) as any}
                size="small"
                sx={{
                  fontSize: { xs: '0.55rem', sm: '0.65rem' },
                  height: { xs: 18, sm: 22 },
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            </Box>
          </Box>
          
          {/* Icono */}
          <IconButton 
            onClick={() => onViewDetails(sale)} 
            color="inherit" 
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              width: { xs: 32, sm: 38, lg: 42 },
              height: { xs: 32, sm: 38, lg: 42 },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <VisibilityIcon sx={{ fontSize: { xs: 16, sm: 20, lg: 22 }}} />
          </IconButton>
        </Box>
      </Box>

      {/* Contenido Principal */}
      <CardContent sx={{ p: { xs: 1, sm: 1.25 } }}>
        {/* Grid de Información - Layout Compacto */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 2 }
          }}
        >
          {/* Total */}
          <Paper sx={mobileMetricSx(theme, 'primary')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Total
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              {formatCurrency(sale.total)}
            </Typography>
          </Paper>

          {/* Items */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Items
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              {sale.details?.length || 0}
            </Typography>
          </Paper>
        </Box>

        {/* Detalles Adicionales */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 1, sm: 1.5 },
            mb: { xs: 1.5, sm: 2 }
          }}
        >
          {/* Cliente */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
              Cliente
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            >
              {sale.customer || 'General'}
            </Typography>
          </Paper>

          {/* Creado por */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
              Creado por
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            >
              {sale.created_by || 'Sistema'}
            </Typography>
          </Paper>

          {/* Estado Visual */}
          <Paper
            sx={mobileMetricSx(
              theme,
              getStatusColor(sale.status) === 'success'
                ? 'success'
                : getStatusColor(sale.status) === 'warning'
                ? 'warning'
                : getStatusColor(sale.status) === 'error'
                ? 'error'
                : 'neutral',
            )}
          >
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
              Estado
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={getStatusColor(sale.status) as any}
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            >
              {getStatusLabel(sale.status)}
            </Typography>
          </Paper>

          {/* Metodo pago */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
              Metodo pago
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            >
              {sale.payment_method || '-'}
            </Typography>
          </Paper>
        </Box>

        {/* Acciones */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            pt: 2,
            ...mobileCardDividerSx(theme),
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' }
          }}
        >
          {/* Para ventas completadas o canceladas - solo ver detalles */}
          {(sale.status === 'completed' || sale.status === 'cancelled') ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => onViewDetails(sale)}
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.9rem' },
                px: { xs: 1.5, sm: 2 },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Ver Detalles
            </Button>
          ) : (
            <>
              {/* Botón editar - solo para ventas pendientes o confirmadas */}
              {(sale.status === 'pending' || sale.status === 'confirmed') && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(sale)}
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.9rem' },
                    px: { xs: 1.5, sm: 2 },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Editar
                </Button>
              )}

              {/* Botón ver detalles - para todas las ventas activas */}
              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => onViewDetails(sale)}
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                  px: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Ver Detalles
              </Button>

              {/* Botones de confirmar/cancelar - solo para pendientes */}
              {sale.status === 'pending' && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={() => onConfirm(sale.id)}
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.9rem' },
                      px: { xs: 1.5, sm: 2 },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Confirmar
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => onCancel(sale.id)}
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.9rem' },
                      px: { xs: 1.5, sm: 2 },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default SalesCard
