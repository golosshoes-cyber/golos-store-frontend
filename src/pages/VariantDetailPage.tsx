import React from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  useTheme,
  alpha,
} from '@mui/material'
import {
  ArrowBack,
  ShoppingCart,
  Edit,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '../services/productService'
import PageShell from '../components/common/PageShell'
import GlobalSectionHeader from '../components/common/GlobalSectionHeader'
import GradientButton from '../components/common/GradientButton'

const VariantDetailPage: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Query para obtener la variante
  const {
    data: variant,
    isLoading: variantLoading,
    error: variantError,
  } = useQuery({
    queryKey: ['variant', id],
    queryFn: () => productService.getVariants().then((data: any) =>
      data.results.find((v: any) => v.id === parseInt(id!))
    ),
    enabled: !!id,
  })

  // Query para obtener el producto
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ['product', variant?.product],
    queryFn: () => productService.getProduct(variant!.product),
    enabled: !!variant?.product,
  })

  // Query para obtener imágenes
  const { data: images } = useQuery({
    queryKey: ['images', variant?.product],
    queryFn: () => productService.getImages(variant!.product),
    enabled: !!variant?.product,
  })

  const isLoading = variantLoading || productLoading
  const error = variantError || productError

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !variant) {
    return (
      <Box 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          Error al cargar los detalles de la variante
        </Typography>
        <GradientButton
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          size="small"
        >
          Volver al Dashboard
        </GradientButton>
      </Box>
    )
  }

  const mainImage = images?.find((img: any) => img.is_primary) || images?.[0]

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Detalles de Variante"
        subtitle={`${variant.sku} - ${product?.name} ${variant.size} ${variant.color || ''}`}
        actions={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            sx={{
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'text.secondary',
                bgcolor: 'action.hover',
              },
            }}
            variant="outlined"
            size="small"
          >
            Volver
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Imagen */}
        <Grid item xs={12} md={5}>
          <Box 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mainImage ? (
              <img
                src={mainImage.image}
                alt={`${product?.name} ${variant.size} ${variant.color || ''}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sin imagen disponible
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Información */}
        <Grid item xs={12} md={7}>
          <Box 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              height: '100%'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
              Detalles del Producto
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                  SKU
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {variant.sku}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                  PRODUCTO
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {product?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                  {product?.brand}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                  TALLA Y COLOR
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {variant.size} {variant.color && `— ${variant.color}`}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                  PRECIO
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  $ {variant.price.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 1 }}>
                  ESTADO DE STOCK
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {variant.stock} unidades
                  </Typography>
                  {(() => {
                    const status = variant.stock === 0 ? { label: 'Sin Stock', color: 'error' } :
                                   variant.stock < 10 ? { label: 'Stock Bajo', color: 'warning' } :
                                   variant.stock < 50 ? { label: 'Stock Medio', color: 'info' } : 
                                   { label: 'Stock Alto', color: 'success' }
                    return (
                      <Box sx={{ 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        bgcolor: alpha(theme.palette[status.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main, 0.08),
                        color: `${status.color}.main`,
                        border: `1px solid ${alpha(theme.palette[status.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main, 0.2)}`
                      }}>
                        {status.label}
                      </Box>
                    )
                  })()}
                </Box>
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={6}>
              <GradientButton
                startIcon={<ShoppingCart />}
                onClick={() => navigate(`/sales?prefillVariant=${variant.id}`)}
                sx={{ borderRadius: 1.5 }}
              >
                Vender Ahora
              </GradientButton>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate('/inventory/stock', { state: { prefillVariant: variant.id } })}
                sx={{ 
                  borderRadius: 1.5,
                  color: 'text.secondary',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'text.primary', color: 'text.primary' }
                }}
              >
                Ajustar Stock
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </PageShell>
  )
}

export default VariantDetailPage
