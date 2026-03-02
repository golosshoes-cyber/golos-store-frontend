import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import { ProductVariant } from '../../types'
import { mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

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
  // Función para dividir nombre largo en líneas
  const renderStackedName = (name: string) => {
    const words = name.split(' ')
    return words.map((word, index) => (
      <Typography
        key={index}
        variant="h6"
        fontWeight="bold"
        sx={{
          fontSize: { xs: '0.9rem', sm: '1rem' },
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {word}
      </Typography>
    ))
  }

  const stockStatus = getStockStatus(variant.stock)
  const productInfo = getProductInfo(variant.product)

  return (
    <Card sx={mobileCardSx(theme)}>
      <CardContent sx={{ p: 2 }}>
        {/* Header con nombre y SKU */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Nombre apilado por palabras */}
            <Box sx={{ mb: 0.5 }}>
              {renderStackedName(productInfo.name)}
            </Box>
            <Typography variant="body2" color="primary" fontWeight="medium" sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {productInfo.brand}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              SKU: {variant.sku} • {variant.size} • {variant.color || 'Sin color'}
            </Typography>
          </Box>
          <Chip
            label={stockStatus.label}
            color={stockStatus.color}
            size="small"
            icon={variant.stock < 10 ? <WarningIcon /> : <TrendingUpIcon />}
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          />
        </Box>

        {/* Información de Stock */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            mb: 2
          }}
        >
          <Box
            sx={{
              ...mobileMetricSx(
                theme,
                variant.stock === 0 ? 'error' : variant.stock < 10 ? 'warning' : 'success',
              ),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Stock Actual
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              color: variant.stock === 0 ? '#d32f2f' : variant.stock < 10 ? '#f57c00' : '#2e7d32'
            }}>
              {variant.stock}
            </Typography>
          </Box>

          <Box
            sx={{
              ...mobileMetricSx(theme, 'info'),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Precio Unit.
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              color: '#7b1fa2'
            }}>
              ${variant.price}
            </Typography>
          </Box>
        </Box>

        {/* Botón de acción */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => onAdjustStock(variant)}
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.9rem' },
              px: { xs: 2, sm: 3 },
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              }
            }}
          >
            Ajustar Stock
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default InventoryCard
