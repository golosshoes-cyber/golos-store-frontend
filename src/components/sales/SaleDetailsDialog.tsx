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
  Stack,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { Sale } from '../../types'
import { productService } from '../../services/productService'
import { formatCurrency } from '../../utils/currency'
import DialogShell from '../common/DialogShell'
import POSTicket from './POSTicket'
import { storeService } from '../../services/storeService'
import { useRef } from 'react'
import { Print as MuiPrintIcon, Description as FileIcon, Add as AddIcon } from '@mui/icons-material'

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

  const { data: brandingData } = useQuery({
    queryKey: ['ops-branding'],
    queryFn: () => storeService.getOpsBranding(),
    enabled: open
  })

  const branding = brandingData?.branding
  const ticketRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (!ticketRef.current) return;

    // Crear un iframe temporal para la impresión
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) return;

    const content = ticketRef.current.innerHTML;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => {
        if (node.tagName === 'LINK') {
          const href = node.getAttribute('href');
          if (href && !href.startsWith('http')) {
            // Convertir rutas relativas a absolutas
            const absoluteLink = node.cloneNode() as HTMLLinkElement;
            absoluteLink.href = new URL(href, window.location.origin).href;
            return absoluteLink.outerHTML;
          }
        }
        return node.outerHTML;
      })
      .join('\n');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Tiquete - Golos Store</title>
          <base href="${window.location.origin}/">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
          ${styles}
          <style>
            @page { size: auto; margin: 0mm; }
            html, body { 
              margin: 0; 
              padding: 0; 
              width: 80mm;
              background-color: white !important;
              color: black !important;
              -webkit-print-color-adjust: exact;
              font-family: 'Inter', system-ui, sans-serif;
            }
            #print-container { width: 80mm; overflow: hidden; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 800)">
          <div id="print-container">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            onClick={handlePrint}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<MuiPrintIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 3,
              bgcolor: 'text.primary',
              color: 'background.default',
              '&:hover': { bgcolor: 'text.secondary' }
            }}
          >
            Imprimir Tiquete
          </Button>

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
        </Box>
      }
    >
      {sale && (
        <Box>
          {/* Componente de tiquete oculto (solo para impresión) */}
          <Box sx={{ display: 'none' }}>
            <POSTicket ref={ticketRef} sale={sale} branding={branding} />
          </Box>

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
              <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 2 }}>
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
                  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 0.5 }}>Metodo pago</Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{sale.payment_method || '—'}</Typography>
                  {sale.payment_reference && (
                    <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>Ref: {sale.payment_reference}</Typography>
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 0.5 }}>Facturación</Typography>
                  <Chip 
                    label={
                      sale.invoicing_method === 'AUTOMATIC' ? 'Automática (Factus)' :
                      sale.invoicing_method === 'MANUAL' ? 'Manual (DIAN)' : 'Solo POS'
                    }
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: '9px' }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Factura Electrónica (DIAN) - Enhanced Visibility */}
            {(sale.invoice_required || sale.invoicing_method !== 'NONE') && (
              <Box sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Factura Electrónica ({sale.invoicing_method === 'MANUAL' ? 'Portal DIAN' : 'Factus'})
                  </Typography>
                  <Chip 
                    label={
                      sale.electronic_invoice ? 
                      (sale.electronic_invoice.status === 'accepted' ? 'Aceptada' : 'Emitida') : 
                      (sale.invoicing_method === 'MANUAL' ? 'Pendiente Registro' : 'En Proceso')
                    } 
                    size="small" 
                    color={sale.invoicing_method === 'MANUAL' && !sale.electronic_invoice ? "warning" : "primary"}
                    variant={sale.electronic_invoice ? "filled" : "outlined"}
                    sx={{ height: 18, fontSize: '9px', fontWeight: 700 }} 
                  />
                </Box>
                
                {sale.electronic_invoice ? (
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', mb: 0.5 }}>CUFE / Protocolo:</Typography>
                      <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', bgcolor: alpha(theme.palette.common.black, 0.03), p: 1, borderRadius: 1.5, wordBreak: 'break-all' }}>
                        {sale.electronic_invoice.cufe}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {sale.electronic_invoice.pdf_url && (
                        <Button
                          component="a"
                          href={sale.electronic_invoice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          startIcon={<FileIcon sx={{ fontSize: 14 }} />}
                          sx={{ 
                            fontSize: '11px', 
                            textTransform: 'none',
                            borderRadius: 1.5,
                            bgcolor: 'text.primary',
                            color: 'background.paper',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: 'text.secondary', boxShadow: 'none' }
                          }}
                        >
                          Ver PDF
                        </Button>
                      )}
                    </Box>
                  </Stack>
                ) : (
                  <Box>
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary', mb: 1.5 }}>
                      {sale.invoicing_method === 'MANUAL' 
                        ? "Esta venta debe ser registrada manualmente en el portal de la DIAN. Una vez lo hagas, puedes adjuntar el CUFE aquí." 
                        : "La factura se está procesando automáticamente con Factus."}
                    </Typography>
                    {sale.invoicing_method === 'MANUAL' && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                        sx={{ fontSize: '10px', textTransform: 'none', borderRadius: 1.5 }}
                      >
                        Registrar datos de DIAN
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* Products Section */}
            <Box sx={{
              bgcolor: alpha(theme.palette.text.primary, 0.02),
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 2,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Productos vendidos
                </Typography>
                <Chip label={`${sale.details?.length || 0} items`} size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 700 }} />
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
        </Box>
      )}
    </DialogShell>
  );
};

export default SaleDetailsDialog;
