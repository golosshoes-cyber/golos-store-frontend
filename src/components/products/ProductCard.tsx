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
  Category as CategoryIcon,
} from '@mui/icons-material'
import { Product } from '../../types'
import { formatNumber } from '../../utils/currency'
import { mobileCardDividerSx, mobileCardHeaderSx, mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
  onView: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onView }) => {
  const theme = useTheme()
  const totalStock = product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)

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
              {product.brand && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    opacity: 0.9,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {product.brand}
                </Typography>
              )}
              
              {/* Estado */}
              <Chip
                label={product.active ? 'Activo' : 'Inactivo'}
                color={product.active ? 'success' : 'default'}
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
              width: { xs: 30, sm: 38, lg: 42 },
              height: { xs: 30, sm: 38, lg: 42 },
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <CategoryIcon sx={{ fontSize: { xs: 16, sm: 20, lg: 22 }}} />
          </Avatar>
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
          {/* Stock */}
          <Paper sx={mobileMetricSx(theme, totalStock === 0 ? 'error' : 'success')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Stock
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={totalStock === 0 ? 'error.main' : 'success.main'}
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              {formatNumber(totalStock)}
            </Typography>
          </Paper>

          {/* Tipo */}
          <Paper sx={mobileMetricSx(theme, 'neutral')}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Tipo
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                textTransform: 'capitalize',
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}
            >
              {product.product_type}
            </Typography>
          </Paper>
        </Box>

        {/* Estado y Precio en Fila */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            mb: { xs: 1.5, sm: 2 }
          }}
        >

          {/* Precio */}
          <Paper sx={{ ...mobileMetricSx(theme, 'primary'), minWidth: 0, flex: 1 }}>
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
              Precio
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary.main"
              sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
            >
              ${formatNumber(product.variants[0]?.price || 0)}
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
              onClick={() => onView(product)}
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
              onClick={() => onEdit(product)}
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
              onClick={() => onDelete(product.id)}
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

export default ProductCard
