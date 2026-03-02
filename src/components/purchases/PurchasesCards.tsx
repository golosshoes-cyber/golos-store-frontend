import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Paper,
  Typography,
  Avatar,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material'
import type { Purchase } from '../../types/purchases'
import { formatCurrency } from '../../utils/currency'
import { mobileCardDividerSx, mobileCardHeaderSx, mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

interface PurchasesCardsProps {
  purchases: Purchase[]
  isLoading: boolean
}

const PurchasesCards: React.FC<PurchasesCardsProps> = ({ purchases, isLoading }) => {
  const theme = useTheme()

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando compras...</Typography>
      </Paper>
    )
  }

  if (purchases.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No se encontraron compras</Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {purchases.map((purchase) => (
        <Card key={purchase.id} sx={{
          ...mobileCardSx(theme),
          borderRadius: 3,
        }}>
          {/* Header Visual Compacto */}
          <Box sx={mobileCardHeaderSx(theme)}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.5
                  }}
                >
                  {purchase.variant?.product?.name || `Compra #${purchase.id}`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    opacity: 0.9
                  }}
                >
                  {new Date(purchase.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  width: { xs: 30, sm: 36 },
                  height: { xs: 30, sm: 36 },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: { xs: 16, sm: 18 }}} />
              </Avatar>
            </Box>
          </Box>

          {/* Contenido Principal */}
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            {/* Grid de Información */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5,
                mb: 2
              }}
            >
              {/* Proveedor */}
              <Paper
                sx={mobileMetricSx(theme, 'neutral')}
              >
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 500 }}>
                  Proveedor
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    fontSize: '0.8rem',
                    mt: 0.5
                  }}
                >
                  {purchase.supplier?.name || 'Sin proveedor'}
                </Typography>
              </Paper>

              {/* Cantidad */}
              <Paper
                sx={mobileMetricSx(theme, 'success')}
              >
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 500 }}>
                  Cantidad
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="success.main"
                  sx={{
                    fontSize: '1.1rem',
                    mt: 0.5
                  }}
                >
                  {purchase.quantity}
                </Typography>
              </Paper>

              {/* Costo Unitario */}
              <Paper
                sx={mobileMetricSx(theme, 'warning')}
              >
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 500 }}>
                  Costo Unit.
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    fontSize: '0.8rem',
                    mt: 0.5
                  }}
                >
                  {formatCurrency(purchase.unit_cost)}
                </Typography>
              </Paper>

              {/* Total */}
              <Paper
                sx={mobileMetricSx(theme, 'primary')}
              >
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 500 }}>
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary.main"
                  sx={{
                    fontSize: '1.1rem',
                    mt: 0.5
                  }}
                >
                  {formatCurrency(purchase.total_cost)}
                </Typography>
              </Paper>
            </Box>

            {/* Detalles adicionales */}
            <Box sx={{ ...mobileCardDividerSx(theme), pt: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                <strong>Variante:</strong> {purchase.variant ? `${purchase.variant.size || 'N/A'} - ${purchase.variant.color || 'Sin color'} - ${purchase.variant.gender === 'male' ? 'Masculino' : purchase.variant.gender === 'female' ? 'Femenino' : 'Unisex'}` : 'Sin variante definida'}
              </Typography>
              {purchase.observation && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                  <strong>Observación:</strong> {purchase.observation}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default PurchasesCards
