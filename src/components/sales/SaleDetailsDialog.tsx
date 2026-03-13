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
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { Sale } from '../../types'
import { productService } from '../../services/productService'
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

  const { data: allProductsData } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => productService.getProducts({}),
    enabled: open && sale?.details && sale.details.length > 0
  })

  const allProducts = allProductsData?.results || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'delivered': return 'success'
      case 'confirmed': case 'paid': return 'primary'
      case 'pending': case 'processing': return 'warning'
      case 'canceled': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Completada', confirmed: 'Confirmada', pending: 'Pendiente',
      canceled: 'Cancelada', paid: 'Pagada', processing: 'Procesando',
      shipped: 'Enviada', delivered: 'Entregada',
    }
    return labels[status] || status
  }

  const getProductName = (variant: any) => {
    if (!variant) return 'Producto desconocido'
    if (typeof variant === 'number') {
      const variantData = allProducts.flatMap(p => p.variants || []).find(v => v.id === variant)
      if (variantData) {
        const product = allProducts.find(p => p.id === variantData.product)
        return product?.name || `Variante ${variant}`
      }
      return `Variante ${variant}`
    }
    if (typeof variant === 'object') {
      if (variant.product && typeof variant.product === 'object') return variant.product.name || `Producto ${variant.product.id || ''}`
      if (variant.product && typeof variant.product === 'number') {
        const product = allProducts.find(p => p.id === variant.product)
        return product?.name || `Producto ${variant.product}`
      }
      if (variant.sku) return variant.sku
      if (variant.id) {
        const variantData = allProducts.flatMap(p => p.variants || []).find(v => v.id === variant.id)
        if (variantData) {
          const product = allProducts.find(p => p.id === variantData.product)
          return product?.name || `Variante ${variant.id}`
        }
        return `Variante ${variant.id}`
      }
    }
    return 'Producto desconocido'
  }

  return (
    <DialogShell
      open={open}
      maxWidth="md"
      onClose={onClose}
      fullScreen={isMobile}
      scroll="paper"
      dialogTitle="Detalles de Venta"
      subtitle={sale ? `Venta #${sale.id} — ${new Date(sale.created_at).toLocaleDateString()}` : ''}
      actions={
        <Button
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: 1.5,
            fontSize: '12px',
            textTransform: 'none',
            px: 2,
            border: `1px solid ${theme.palette.divider}`,
            color: 'text.secondary',
            '&:hover': { borderColor: 'text.disabled', color: 'text.primary' },
          }}
        >
          Cerrar
        </Button>
      }
    >
      {sale && (
        <Box>
          {/* Status + Metadata */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              label={getStatusLabel(sale.status)}
              size="small"
              color={getStatusColor(sale.status) as any}
              sx={{ height: 20, fontSize: '10px', fontWeight: 500 }}
            />
            <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
              Creada por: {sale.created_by}
            </Typography>
          </Box>

          {/* Info Section */}
          <Box sx={{
            bgcolor: alpha(theme.palette.text.primary, 0.02),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
              Información de la venta
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Cliente</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{sale.customer}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Fecha</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{new Date(sale.created_at).toLocaleDateString()}</Typography>
                <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>{new Date(sale.created_at).toLocaleTimeString()}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Total</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'success.main' }}>{formatCurrency(sale.total)}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Método pago</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{sale.payment_method || '—'}</Typography>
                {sale.payment_reference && (
                  <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>Ref: {sale.payment_reference}</Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Products Section */}
          <Box sx={{
            bgcolor: alpha(theme.palette.text.primary, 0.02),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Productos vendidos
              </Typography>
              <Chip label={`${sale.details?.length || 0} items`} size="small" sx={{ height: 18, fontSize: '10px' }} />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', py: 1 }}>Producto</TableCell>
                    <TableCell align="center" sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', py: 1 }}>Cant</TableCell>
                    <TableCell align="right" sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', py: 1 }}>Precio</TableCell>
                    <TableCell align="right" sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', py: 1 }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.details?.map((detail, index) => {
                    const variant = typeof detail.variant === 'object' ? detail.variant : {}
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ py: 1 }}>
                          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{getProductName(detail.variant)}</Typography>
                          {typeof detail.variant === 'object' && (
                            <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>
                              {(variant as any).size || ''} — {(variant as any).color || 'Sin color'}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1 }}>
                          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{detail.quantity}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1 }}>
                          <Typography sx={{ fontSize: '12px' }}>{formatCurrency(detail.price)}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1 }}>
                          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'success.main' }}>
                            {formatCurrency(detail.quantity * Number(detail.price))}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell colSpan={3} sx={{ borderBottom: 'none', py: 1.5 }}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, textAlign: 'right' }}>Total:</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: 'none', py: 1.5 }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(sale.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </DialogShell>
  )
}

export default SaleDetailsDialog
