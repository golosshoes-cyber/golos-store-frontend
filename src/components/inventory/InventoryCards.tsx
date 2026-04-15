import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Edit as EditIcon, Inventory as InventoryIcon } from '@mui/icons-material'
import { mobileCardSx, mobileCardHeaderSx, mobileCardDividerSx, mobileMetricSx } from '../common/mobileCardStyles'

interface InventoryCardsProps {
  variants: any[]
  getProductInfo: (productId: number) => any
  getStockStatus: (stock: number) => { label: string; color: any }
  onAdjustStock: (variant: any) => void
}

const InventoryCards: React.FC<InventoryCardsProps> = ({
  variants,
  getProductInfo,
  getStockStatus,
  onAdjustStock,
}) => {
  const theme = useTheme()

  if (variants.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No hay datos disponibles</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {variants.map((variant) => {
        const productInfo = getProductInfo(variant.product)
        const status = getStockStatus(variant.stock)
        const toneMap: Record<string, 'error' | 'warning' | 'success' | 'primary'> = {
          error: 'error',
          warning: 'warning',
          success: 'success',
        }
        const tone = toneMap[status.color] || 'primary'

        return (
          <Card key={variant.id} sx={mobileCardSx(theme)}>
            {/* Header */}
            <Box sx={{ ...mobileCardHeaderSx(theme), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: 1.5,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <InventoryIcon sx={{ fontSize: 18, color: 'white' }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{
                    fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'white',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {productInfo?.name || 'Producto desconocido'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>
                    {productInfo?.brand || 'Sin marca'}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Ajustar Stock">
                <IconButton
                  size="small"
                  onClick={() => onAdjustStock(variant)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)', color: 'white', flexShrink: 0,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                  }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                <Grid item xs={4}>
                  <Paper sx={mobileMetricSx(theme, tone)}>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500 }}>
                      Stock
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={`${status.color}.main`} sx={{ fontSize: '1.2rem', mt: 0.3 }}>
                      {variant.stock}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={8}>
                  <Paper sx={mobileMetricSx(theme, tone)}>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500 }}>
                      Estado
                    </Typography>
                    <Box sx={{
                      mt: 0.5, display: 'inline-flex', px: 1, py: 0.2, borderRadius: 1,
                      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                      bgcolor: `${status.color}.main`, color: 'white'
                    }}>
                      {status.label}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ ...mobileCardDividerSx(theme), pt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  <strong>Talla:</strong> {variant.size} &nbsp;·&nbsp;
                  <strong>Color:</strong> {variant.color || 'Sin color'} &nbsp;·&nbsp;
                  <strong>Género:</strong> <span style={{ textTransform: 'capitalize' }}>{variant.gender}</span>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}

export default InventoryCards
