import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material'
import { Supplier } from '../../types'
import { formatCurrency } from '../../utils/currency'
import { mobileCardSx, mobileCardHeaderSx, mobileCardDividerSx, mobileMetricSx } from '../common/mobileCardStyles'

interface SuppliersCardsProps {
  suppliers: Supplier[]
  loading: boolean
  onEdit: (supplier: Supplier) => void
  onDelete: (supplierId: number) => void
}

const SuppliersCards: React.FC<SuppliersCardsProps> = ({
  suppliers,
  loading,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">Cargando proveedores...</Typography>
      </Box>
    )
  }

  if (suppliers.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No se encontraron proveedores</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {suppliers.map((supplier) => (
        <Card key={supplier.id} sx={mobileCardSx(theme)}>
          {/* Header */}
          <Box sx={{ ...mobileCardHeaderSx(theme), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: 1.5, flexShrink: 0,
                bgcolor: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <BusinessIcon sx={{ fontSize: 18, color: 'white' }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{
                  fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'white',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {supplier.name}
                </Typography>
                {supplier.nit && (
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>
                    NIT: {supplier.nit}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <Box sx={{
                px: 1, py: 0.3, borderRadius: 1,
                bgcolor: supplier.is_active ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.15)',
                border: `1px solid ${supplier.is_active ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'white', textTransform: 'uppercase' }}>
                  {supplier.is_active ? 'Activo' : 'Inactivo'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}>
              {supplier.average_price && (
                <Paper sx={mobileMetricSx(theme, 'primary')}>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500 }}>
                    Precio Promedio
                  </Typography>
                  <Typography fontWeight="bold" color="primary.main" sx={{ fontSize: '0.85rem', mt: 0.3 }}>
                    {formatCurrency(supplier.average_price)}
                  </Typography>
                </Paper>
              )}
              {supplier.last_purchase_date && (
                <Paper sx={mobileMetricSx(theme, 'neutral')}>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500 }}>
                    Última Compra
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mt: 0.3 }}>
                    {new Date(supplier.last_purchase_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Typography>
                </Paper>
              )}
            </Box>

            <Box sx={{ ...mobileCardDividerSx(theme), pt: 1 }}>
              {supplier.phone && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.3 }}>
                  <strong>Tel:</strong> {supplier.phone}
                </Typography>
              )}
              {supplier.address && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.3 }}>
                  <strong>Dir:</strong> {supplier.address}
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(supplier)}
                    sx={{
                      width: 30, height: 30, borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`, color: 'text.disabled',
                      '&:hover': { color: 'primary.main', borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }
                    }}
                  >
                    <EditIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(supplier.id)}
                    sx={{
                      width: 30, height: 30, borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`, color: 'text.disabled',
                      '&:hover': { color: 'error.main', borderColor: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default SuppliersCards
