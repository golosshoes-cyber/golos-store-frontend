import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '../../services/dashboardService'
import {
  Warning as WarningIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'

const LowStockPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: dashboardService.getLowStockProducts,
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography>Cargando productos con stock bajo...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error al cargar productos con stock bajo
        </Typography>
      </Paper>
    )
  }

  const products = data?.products || []

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Productos con Stock Bajo"
        subtitle={`Umbral: ${data?.threshold || 10} unidades - Requiere reposición inmediata`}
        icon={<WarningIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
        actions={
          <Button
            variant="outlined"
            startIcon={<CartIcon />}
            onClick={() => navigate('/inventory/purchases')}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Comprar Stock
          </Button>
        }
      />

      {products.length === 0 ? (
        <Alert severity="info">
          No hay productos con stock bajo en este momento.
        </Alert>
      ) : isMobile ? (
        /* MOBILE: Cards */
        <Grid container spacing={1.5}>
          {products.map((product: any) => (
            <Grid item xs={12} key={product.id}>
              <Card sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                boxShadow: 'none',
              }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>{product.product_name}</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>{product.brand} · {product.variant_info}</Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CartIcon sx={{ fontSize: 12 }} />}
                      onClick={() => navigate('/inventory/purchases?variant=' + product.id + '&cost=' + product.cost)}
                      sx={{ ml: 1, flexShrink: 0, fontSize: '10px', py: 0.3, borderRadius: 1.5 }}
                    >
                      Comprar
                    </Button>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                    {[
                      { label: 'Stock', value: product.current_stock, color: 'error.main' },
                      { label: 'Mínimo', value: product.stock_minimum, color: 'text.secondary' },
                      { label: 'Déficit', value: product.deficit, color: 'warning.main' },
                      { label: 'Precio', value: `$${product.price}`, color: 'text.primary' },
                    ].map((item) => (
                      <Box key={item.label} sx={{ textAlign: 'center', p: 0.8, borderRadius: 1, bgcolor: 'action.hover' }}>
                        <Typography sx={{ fontSize: '9px', color: 'text.disabled', textTransform: 'uppercase' }}>{item.label}</Typography>
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* DESKTOP: Table */
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Marca</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Variante</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Stock</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Mínimo</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Déficit</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Precio</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Costo</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id} hover>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>{product.product_name}</TableCell>
                    <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{product.brand}</TableCell>
                    <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{product.variant_info}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '13px', fontWeight: 700, color: 'error.main' }}>{product.current_stock}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '12px' }}>{product.stock_minimum}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '12px', color: 'warning.main', fontWeight: 600 }}>{product.deficit}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '12px', fontWeight: 600 }}>${product.price}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '12px', color: 'text.secondary' }}>${product.cost}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate('/inventory/purchases?variant=' + product.id + '&cost=' + product.cost)}
                        sx={{ fontSize: '10px', py: 0.2, borderRadius: 1.2 }}
                      >
                        Comprar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </PageShell>
  )
}

export default LowStockPage
