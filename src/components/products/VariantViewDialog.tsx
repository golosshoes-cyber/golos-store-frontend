import React from 'react'
import {
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
} from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import {
  Style as ProductIcon,
  Height as SizeIcon,
  Person as GenderIcon,
  Palette as ColorIcon,
  Inventory as StockIcon,
  AttachMoney as PriceIcon,
  AccountBalanceWallet as CostIcon,
  CheckCircle as ActiveIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { ProductVariant, Product } from '../../types'
import VariantDetailsHeader from '../../components/common/VariantDetailsHeader'
import DialogShell from '../common/DialogShell'

interface VariantViewDialogProps {
  open: boolean
  variant: ProductVariant | null
  product: Product | null
  images: any[]
  onClose: () => void
}

const VariantViewDialog: React.FC<VariantViewDialogProps> = ({
  open,
  variant,
  product,
  images,
  onClose,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!variant || !product) return null

  const assignedImage = images.find(img => img.variant === variant.id)

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullScreen={isMobile}
      scroll="paper"
      header={<VariantDetailsHeader />}
      headerInTitle={false}
      actions={
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cerrar
        </Button>
      }
    >
        <Grid container spacing={3}>
          {/* Detalles Principales */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ProductIcon color="primary" />
                Detalles de la Variante
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ProductIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Producto
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {product.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <SizeIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Talla
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {variant.size}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <GenderIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Género
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {variant.gender === 'male' ? 'Masculino' : variant.gender === 'female' ? 'Femenino' : 'Unisex'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ColorIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Color
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {variant.color || 'Sin color'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ActiveIcon color={variant.active ? "success" : "error"} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Estado
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" color={variant.active ? "success.main" : "error.main"}>
                        {variant.active ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Imagen de la Variante */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon color="primary" />
                Imagen de la Variante
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {assignedImage ? (
                <Box display="flex" justifyContent="center">
                  <Box
                    component="img"
                    src={assignedImage.image}
                    alt={`${product.name} - ${variant.size} ${variant.color || ''}`}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No hay imagen asignada para esta variante
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Estadísticas y Precios */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StockIcon color="primary" />
                Información Económica
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <StockIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Stock
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color={variant.stock === 0 ? "error.main" : "success.main"}>
                        {variant.stock} unidades
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PriceIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Precio
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        ${parseFloat(variant.price.toString()).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CostIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Costo
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="secondary.main">
                        ${parseFloat(variant.cost.toString()).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
    </DialogShell>
  )
}

export default VariantViewDialog
