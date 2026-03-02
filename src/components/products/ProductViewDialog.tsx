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
  Label as LabelIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  CheckCircle as ActiveIcon,
  Inventory as StockIcon,
  ShoppingCart as VariantsIcon,
} from '@mui/icons-material'
import { Product } from '../../types'
import ProductDetailsHeader from '../../components/common/ProductDetailsHeader'
import DialogShell from '../common/DialogShell'

interface ProductViewDialogProps {
  open: boolean
  product: Product | null
  onClose: () => void
}

const ProductViewDialog: React.FC<ProductViewDialogProps> = ({
  open,
  product,
  onClose,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!product) return null

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullScreen={isMobile}
      scroll="paper"
      header={<ProductDetailsHeader isActive={product.active} />}
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
                <CategoryIcon color="primary" />
                Detalles del Producto
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <LabelIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nombre/Modelo
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {product.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Marca
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {product.brand}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CategoryIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tipo
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {product.product_type}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ActiveIcon color={product.active ? "success" : "error"} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Estado
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" color={product.active ? "success.main" : "error.main"}>
                        {product.active ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {product.description && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Descripción
                    </Typography>
                    <Typography variant="body1">
                      {product.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Estadísticas */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StockIcon color="primary" />
                Estadísticas
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <StockIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Stock Total
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color={totalStock === 0 ? "error.main" : "success.main"}>
                        {totalStock} unidades
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <VariantsIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Variantes
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {product.variants.length}
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

export default ProductViewDialog
