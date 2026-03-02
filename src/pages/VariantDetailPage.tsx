import React from 'react'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Card,
  CardMedia,
  CardContent,
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

const VariantDetailPage: React.FC = () => {
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
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error al cargar los detalles de la variante
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Volver al Dashboard
        </Button>
      </Paper>
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
              color: 'white',
              borderColor: 'rgba(255,255,255,0.35)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
            variant="outlined"
          >
            Volver
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Imagen */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {mainImage ? (
              <CardMedia
                component="img"
                height="400"
                image={mainImage.image}
                alt={`${product?.name} ${variant.size} ${variant.color || ''}`}
                sx={{ objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Sin imagen disponible
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Información */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Información del Producto
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  SKU
                </Typography>
                <Typography variant="h6" fontWeight="medium">
                  {variant.sku}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Producto
                </Typography>
                <Typography variant="h6">
                  {product?.name}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  {product?.brand}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Variante
                </Typography>
                <Typography variant="h6">
                  Talla: {variant.size} {variant.color && `| Color: ${variant.color}`}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Precio
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  ${variant.price}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Stock Actual
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">
                    {variant.stock} unidades
                  </Typography>
                  <Chip
                    label={variant.stock === 0 ? 'Sin Stock' :
                           variant.stock < 10 ? 'Stock Bajo' :
                           variant.stock < 50 ? 'Stock Medio' : 'Stock Alto'}
                    color={variant.stock === 0 ? 'error' :
                           variant.stock < 10 ? 'warning' :
                           variant.stock < 50 ? 'info' : 'success'}
                    size="small"
                  />
                </Box>
              </Box>

              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => navigate(`/sales?prefillVariant=${variant.id}`)}
                  sx={{ borderRadius: 2 }}
                >
                  Crear Venta
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate('/inventory', { state: { prefillVariant: variant.id } })}
                  sx={{ borderRadius: 2 }}
                >
                  Ajustar Stock
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageShell>
  )
}

export default VariantDetailPage
