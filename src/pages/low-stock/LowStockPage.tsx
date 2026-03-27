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
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Variante</TableCell>
                  <TableCell>Stock Actual</TableCell>
                  <TableCell>Stock Mínimo</TableCell>
                  <TableCell>Déficit</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Costo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.variant_info}</TableCell>
                    <TableCell>{product.current_stock}</TableCell>
                    <TableCell>{product.stock_minimum}</TableCell>
                    <TableCell>{product.deficit}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>${product.cost}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate('/inventory/purchases?variant=' + product.id + '&cost=' + product.cost)}
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
