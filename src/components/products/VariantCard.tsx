import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Paper,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Style as StyleIcon,
} from '@mui/icons-material'
import { ProductVariant, Product } from '../../types'
import { formatNumber } from '../../utils/currency'
import { mobileCardDividerSx, mobileCardHeaderSx, mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

interface VariantCardProps {
  variant: ProductVariant
  product: Product
  onEdit: (variant: ProductVariant) => void
  onDelete: (variantId: number) => void
  onView: (variant: ProductVariant) => void
  onImageClick?: (imageUrl: string, variant: ProductVariant) => void
  image?: any
}

const VariantCard: React.FC<VariantCardProps> = ({ 
  variant, 
  product, 
  onEdit, 
  onDelete, 
  onView,
  onImageClick,
  image 
}) => {
  const theme = useTheme()
  const generateSKUVariant = (variant: ProductVariant, product: Product) => {
    const brand = product.brand.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    const name = product.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    const color = (variant.color || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    const size = variant.size.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase()
    return `${brand}-${name}-${color}-${size}`
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male': return 'Masculino'
      case 'female': return 'Femenino'
      case 'unisex': return 'Unisex'
      default: return gender
    }
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
              {product.name}
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
                {generateSKUVariant(variant, product)}
              </Typography>
              
              {/* Estado */}
              <Chip
                label={variant.active ? 'Activo' : 'Inactivo'}
                color={variant.active ? 'success' : 'default'}
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
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              width: { xs: 32, sm: 38, lg: 42 },
              height: { xs: 32, sm: 38, lg: 42 },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <StyleIcon sx={{ fontSize: { xs: 16, sm: 20, lg: 22 }}} />
          </Avatar>
        </Box>
      </Box>

      {/* Contenido Principal */}
      <CardContent sx={{ p: { xs: 1, sm: 1.25 } }}>
        {/* Imagen si existe */}
        {image && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
              src={image.image}
              alt={variant.color}
              style={{
                width: '100%',
                maxWidth: '120px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                cursor: onImageClick ? 'pointer' : 'default'
              }}
              onClick={() => onImageClick && onImageClick(image.image, variant)}
            />
          </Box>
        )}

        {/* Grid de Información - Layout Compacto */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 2 }
          }}
        >
          {/* Stock */}
          <Paper sx={mobileMetricSx(theme, variant.stock === 0 ? 'error' : 'success')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Stock
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={variant.stock === 0 ? 'error.main' : 'success.main'}
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              {formatNumber(variant.stock)}
            </Typography>
          </Paper>

          {/* Precio */}
          <Paper sx={mobileMetricSx(theme, 'primary')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Precio
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              ${formatNumber(variant.price)}
            </Typography>
          </Paper>
        </Box>

        {/* Detalles de la Variante */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: { xs: 1, sm: 1.5 },
            mb: { xs: 1.5, sm: 2 }
          }}
        >
          {/* Color */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
              Color
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                textTransform: 'capitalize',
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            >
              {variant.color || 'N/A'}
            </Typography>
          </Paper>

          {/* Talla */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
              Talla
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            >
              {variant.size}
            </Typography>
          </Paper>

          {/* Género */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
              Género
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            >
              {getGenderLabel(variant.gender)}
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
            ...mobileCardDividerSx(theme)
          }}
        >
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={() => onView(variant)}
              color="primary"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => onEdit(variant)}
              color="warning"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              onClick={() => onDelete(variant.id)}
              color="error"
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}

export default VariantCard
