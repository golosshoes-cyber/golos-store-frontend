import React from 'react'
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  Grid,
} from '@mui/material'
import {
  Edit as EditIcon,
} from '@mui/icons-material'
import { ProductVariant } from '../../types'

interface InventoryCardProps {
  variant: ProductVariant
  getProductInfo: (productId: number | string) => { name: string; brand: string }
  getStockStatus: (stock: number) => { label: string; color: 'success' | 'warning' | 'error' | 'info' }
  onAdjustStock: (variant: ProductVariant) => void
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  variant,
  getProductInfo,
  getStockStatus,
  onAdjustStock,
}) => {
  const theme = useTheme()
  const stockStatus = getStockStatus(variant.stock)
  const productInfo = getProductInfo(variant.product)

  return (
    <Box 
      sx={{ 
        borderRadius: 2, 
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header con nombre y SKU */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {productInfo.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mb: 0.5 }}>
              {productInfo.brand}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {variant.sku} • {variant.size} • {variant.color || 'SC'}
            </Typography>
          </Box>
          <Box sx={{ 
            px: 1, 
            py: 0.25, 
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: 700,
            bgcolor: alpha(theme.palette[stockStatus.color].main, 0.08),
            color: `${stockStatus.color}.main`,
            border: `1px solid ${alpha(theme.palette[stockStatus.color].main, 0.2)}`
          }}>
            {stockStatus.label}
          </Box>
        </Box>

        {/* Información de Metricas */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 1.5, 
              bgcolor: alpha(theme.palette.text.primary, 0.02),
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                Stock
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {variant.stock}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 1.5, 
              bgcolor: alpha(theme.palette.text.primary, 0.02),
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                Precio
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                ${variant.price.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Botón de acción */}
        <Button
          fullWidth
          size="small"
          variant="outlined"
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          onClick={() => onAdjustStock(variant)}
          sx={{
            borderRadius: 1.5,
            color: 'text.secondary',
            borderColor: 'divider',
            py: 1,
            '&:hover': { borderColor: 'text.primary', color: 'text.primary' }
          }}
        >
          Ajustar Stock
        </Button>
      </Box>
    </Box>
  )
}

export default InventoryCard
