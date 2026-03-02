import React from 'react'
import {
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  ShoppingBasket as ProductIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { Sale } from '../../types'
import { productService } from '../../services/productService'
import GradientButton from '../common/GradientButton'
import SaleDetailsHeader from '../common/SaleDetailsHeader'
import { formatCurrency } from '../../utils/currency'
import DialogShell from '../common/DialogShell'

interface SaleDetailsDialogProps {
  sale: Sale | null
  open: boolean
  onClose: () => void
}

const SaleDetailsDialog: React.FC<SaleDetailsDialogProps> = ({ sale, open, onClose }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isLight = theme.palette.mode === 'light'

  // Obtener todos los productos para poder mostrar nombres
  const { data: allProductsData } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => productService.getProducts({}),
    enabled: open && sale?.details && sale.details.length > 0
  })

  const allProducts = allProductsData?.results || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'confirmed':
        return 'primary'
      case 'pending':
        return 'warning'
      case 'canceled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendiente'
      case 'canceled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getProductName = (variant: any) => {
    if (!variant) return 'Producto desconocido'
    
    // si variante es solo un numero (ID), buscar en todos los productos
    if (typeof variant === 'number') {
      const variantData = allProducts.flatMap(p => p.variants || []).find(v => v.id === variant)
      if (variantData) {
        const product = allProducts.find(p => p.id === variantData.product)
        return product?.name || product?.brand || `Variante ${variant}`
      }
      return `Variante ${variant}`
    }
    
    // si variante es un objeto completo
    if (typeof variant === 'object') {
      // si tiene nombre de producto, usarlo
      if (variant.product && typeof variant.product === 'object') {
        return variant.product.name || variant.product.brand || `Producto ${variant.product.id || ''}`
      }
      
      // si tiene ID de producto, buscarlo
      if (variant.product && typeof variant.product === 'number') {
        const product = allProducts.find(p => p.id === variant.product)
        return product?.name || product?.brand || `Producto ${variant.product}`
      }
      
      // si tiene SKU, usarlo
      if (variant.sku) {
        return variant.sku
      }
      
      // si tiene ID, usarlo
      if (variant.id) {
        const variantData = allProducts.flatMap(p => p.variants || []).find(v => v.id === variant.id)
        if (variantData) {
          const product = allProducts.find(p => p.id === variantData.product)
          return product?.name || product?.brand || `Variante ${variant.id}`
        }
        return `Variante ${variant.id}`
      }
    }
    
    // fallback
    return 'Producto desconocido'
  }

  // Componente para vista mobile de productos
  const ProductDetailCard = ({ detail }: { detail: any }) => {
    const variant = typeof detail.variant === 'object' ? detail.variant : {}
    
    return (
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : '0 3px 12px rgba(0,0,0,0.35)',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header del producto */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {getProductName(detail.variant)}
              </Typography>
              {typeof detail.variant === 'object' && (
                <Typography variant="caption" color="text.secondary">
                  {variant.size || ''} - {variant.color || 'Sin color'}
                </Typography>
              )}
            </Box>
            <Chip 
              label={detail.quantity} 
              size="small" 
              sx={{ 
                backgroundColor: alpha(theme.palette.info.main, isLight ? 0.14 : 0.3),
                color: theme.palette.info.main,
                fontWeight: 'bold',
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }}
            />
          </Box>

          {/* Detalles del precio */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
              mb: 2
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.background.default, isLight ? 0.72 : 0.55),
                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Precio Unit.
              </Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                {formatCurrency(detail.price)}
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: 1.5,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.success.main, isLight ? 0.13 : 0.24),
                border: `1px solid ${alpha(theme.palette.success.main, isLight ? 0.35 : 0.52)}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Subtotal
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="success.main" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                {formatCurrency(detail.quantity * Number(detail.price))}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <DialogShell
      open={open}
      maxWidth="md"
      onClose={onClose}
      fullScreen={isMobile}
      scroll="paper"
      header={
        <SaleDetailsHeader
          key={`header-${sale?.id}`}
          saleId={sale?.id}
          status={getStatusLabel(sale?.status || '')}
          statusColor={getStatusColor(sale?.status || '') as any}
        />
      }
      headerInTitle={false}
      actions={
        <GradientButton onClick={onClose}>
          Cerrar
        </GradientButton>
      }
    >
        {sale && (
          <Box key={`box-${sale?.id}`}>
            {/* Tarjeta de información general */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : '0 3px 12px rgba(0,0,0,0.35)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Información de la Venta
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, isLight ? 0.9 : 0.76) }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Cliente
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {sale.customer}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, isLight ? 0.88 : 0.72) }}>
                        <CalendarIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Fecha
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(sale.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(sale.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, isLight ? 0.9 : 0.74) }}>
                        <MoneyIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Total
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {formatCurrency(sale.total)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, isLight ? 0.88 : 0.72) }}>
                        <MoneyIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Metodo pago
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {sale.payment_method || '-'}
                        </Typography>
                        {sale.payment_reference && (
                          <Typography variant="caption" color="textSecondary">
                            Ref: {sale.payment_reference}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Sección de productos */}
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : '0 3px 12px rgba(0,0,0,0.35)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, isLight ? 0.86 : 0.72) }}>
                    <ProductIcon />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      Productos Vendidos
                    </Typography>
                    <Chip 
                      label={`${sale.details?.length || 0} productos`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.info.main, isLight ? 0.12 : 0.24),
                        color: theme.palette.info.main,
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Vista Desktop - Tabla */}
                {!isMobile && (
                  <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio Unit.</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sale.details?.map((detail, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {getProductName(detail.variant)}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {typeof detail.variant === 'object' ? 
                                    `${detail.variant.size || ''} - ${detail.variant.color || 'Sin color'}` : 
                                    ''
                                  }
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={detail.quantity} 
                                size="small" 
                                sx={{
                                  backgroundColor: alpha(theme.palette.info.main, isLight ? 0.14 : 0.3),
                                  color: theme.palette.info.main,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(detail.price)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="bold" color="success.main">
                                {formatCurrency(detail.quantity * Number(detail.price))}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} sx={{ borderBottom: 'none' }}>
                            <Typography variant="h6" fontWeight="bold" align="right">
                              Total:
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: 'none' }}>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                              {formatCurrency(sale.total)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Vista Mobile - Cards */}
                {isMobile && (
                  <Box>
                    {sale.details?.map((detail, index) => (
                      <ProductDetailCard key={index} detail={detail} />
                    ))}
                    
                    {/* Total en mobile */}
                    <Card sx={{ 
                      borderRadius: 2, 
                      boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 16px rgba(0,0,0,0.35)',
                      background: `linear-gradient(135deg, ${
                        alpha(theme.palette.success.main, isLight ? 0.9 : 0.72)
                      } 0%, ${
                        alpha(theme.palette.success.dark, isLight ? 0.85 : 0.68)
                      } 100%)`,
                      color: 'white'
                    }}>
                      <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          Total de la Venta
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                          {formatCurrency(sale.total)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
    </DialogShell>
  )
}

export default SaleDetailsDialog
