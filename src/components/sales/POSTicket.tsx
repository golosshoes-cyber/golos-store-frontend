import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import { Sale } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface POSTicketProps {
  sale: Sale;
  branding?: any;
}

/**
 * Premium POS Ticket Component
 * Optimized for 80mm thermal printers with a high-density, professional aesthetic.
 */
const POSTicket = React.forwardRef<HTMLDivElement, POSTicketProps>(({ sale, branding }, ref) => {
  // Estilo base para tipografía compacta y refinada
  const commonText = {
    fontFamily: "'Inter', 'system-ui', -apple-system, sans-serif",
    lineHeight: 1.2,
    color: '#000',
  };

  const monoText = {
    fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace",
  };

  return (
    <Box
      ref={ref}
      sx={{
        width: '80mm',
        padding: '4mm',
        backgroundColor: '#fff',
        ...commonText,
        '@media print': {
          width: '80mm',
          padding: '0',
          margin: '0',
          pageBreakInside: 'avoid',
        },
      }}
    >
      {/* HEADER: Premium Identity */}
      <Stack spacing={0.5} alignItems="center" sx={{ mb: 2, textAlign: 'center' }}>
        <Typography sx={{ 
          fontSize: '16px', 
          fontWeight: 800, 
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          mb: 0.2
        }}>
          {branding?.store_name || 'GOLOS STORE'}
        </Typography>
        
        <Box sx={{ border: '1px solid #000', px: 1, py: 0.2, mb: 0.5 }}>
          <Typography sx={{ fontSize: '9px', fontWeight: 700 }}>
            {branding?.legal_id_type || 'NIT'}: {branding?.legal_id_number || '107531206'}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '9px', fontWeight: 500, maxWidth: '80%' }}>
          {branding?.legal_contact_address || 'C.C. Portal del Quindío, Local 214'}
        </Typography>
        <Typography sx={{ fontSize: '9px', fontWeight: 500 }}>
          Armenia, Quindío • Tel: {branding?.legal_contact_phone || '317 291 7178'}
        </Typography>
      </Stack>

      <Divider sx={{ borderStyle: 'solid', my: 1, borderColor: '#000', borderWidth: '1px' }} />

      {/* SALE INFO: Clean Grid */}
      <Box sx={{ mb: 1.5 }}>
        <Typography sx={{ 
          fontSize: '10px', 
          fontWeight: 800, 
          bgcolor: '#000', 
          color: '#fff', 
          px: 1, py: 0.3,
          display: 'inline-block',
          mb: 0.8
        }}>
          {sale.is_electronic_invoice ? 'FACTURA ELECTRÓNICA DE VENTA' : 'DOCUMENTO EQUIVALENTE POS'}
        </Typography>

        <Stack spacing={0.2}>
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: '9px', fontWeight: 600 }}>NÚMERO:</Typography>
            <Typography sx={{ fontSize: '9px', fontWeight: 800 }}>{sale.document_number || `V-${sale.id}`}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: '9px', fontWeight: 600 }}>FECHA:</Typography>
            <Typography sx={{ fontSize: '9px' }}>{new Date(sale.created_at).toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: '9px', fontWeight: 600 }}>CLIENTE:</Typography>
            <Typography sx={{ fontSize: '9px', fontWeight: 700 }}>{sale.customer.toUpperCase()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: '9px', fontWeight: 600 }}>CAJERO:</Typography>
            <Typography sx={{ fontSize: '9px' }}>{sale.created_by.toUpperCase()}</Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', my: 1, borderColor: '#000' }} />

      {/* ITEMS TABLE: High Density */}
      <Box sx={{ mb: 1.5 }}>
        <Box display="flex" sx={{ borderBottom: '1px solid #000', pb: 0.5, mb: 0.5 }}>
          <Typography sx={{ fontSize: '8px', fontWeight: 800, flex: 1 }}>DESCRIPCIÓN</Typography>
          <Typography sx={{ fontSize: '8px', fontWeight: 800, width: '25px', textAlign: 'center' }}>CT.</Typography>
          <Typography sx={{ fontSize: '8px', fontWeight: 800, width: '65px', textAlign: 'right' }}>VALOR</Typography>
        </Box>

        {sale.details.map((item, idx) => {
          const variant = typeof item.variant === 'object' ? item.variant : null;
          const productName = variant && (variant as any).product_name ? (variant as any).product_name : `PROD-${item.variant}`;
          
          return (
            <Box key={idx} sx={{ mb: 0.8 }}>
              <Box display="flex" alignItems="flex-start">
                <Typography sx={{ fontSize: '9px', fontWeight: 600, flex: 1, lineHeight: 1.1 }}>
                  {productName.toUpperCase()}
                </Typography>
                <Typography sx={{ fontSize: '9px', width: '25px', textAlign: 'center', ...monoText }}>
                  {item.quantity}
                </Typography>
                <Typography sx={{ fontSize: '9px', width: '65px', textAlign: 'right', ...monoText }}>
                  {formatCurrency(Number(item.price) * item.quantity)}
                </Typography>
              </Box>
              {variant && (
                <Typography sx={{ fontSize: '8px', color: '#444', fontStyle: 'italic', mt: 0.1 }}>
                  Ref: {(variant as any).sku} • Talla: {(variant as any).size} • {(variant as any).color}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderStyle: 'solid', my: 1, borderColor: '#000' }} />

      {/* TOTALS: Bold & Clear */}
      <Stack spacing={0.3} sx={{ mb: 1.5 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ fontSize: '9px', fontWeight: 600 }}>SUBTOTAL:</Typography>
          <Typography sx={{ fontSize: '9px', ...monoText }}>{formatCurrency(Number(sale.total))}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ fontSize: '9px', fontWeight: 600 }}>TRIBUTOS (IVA 0%):</Typography>
          <Typography sx={{ fontSize: '9px', ...monoText }}>$0</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ pt: 0.5 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 900 }}>TOTAL:</Typography>
          <Typography sx={{ fontSize: '13px', fontWeight: 900, ...monoText }}>{formatCurrency(sale.total)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: '9px', fontWeight: 600 }}>MÉTODO DE PAGO:</Typography>
          <Typography sx={{ fontSize: '9px', fontWeight: 700 }}>{sale.payment_method || 'EFECTIVO'}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderStyle: 'solid', my: 1, borderColor: '#000' }} />

      {/* FOOTER: Legal Compliance & Branding */}
      <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center', mt: 1 }}>
        {sale.is_electronic_invoice && sale.electronic_invoice && (
          <Box sx={{ width: '100%', mb: 1 }}>
             <Typography sx={{ fontSize: '7px', fontWeight: 700, mb: 0.5 }}>CUFE / CUDE:</Typography>
            <Typography sx={{ fontSize: '7px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
              {sale.electronic_invoice.cufe}
            </Typography>
            
            <Box sx={{ 
              mt: 1, 
              width: '28mm', 
              height: '28mm', 
              mx: 'auto',
              border: '1px solid #eee', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Box sx={{ width: '24mm', height: '24mm', bgcolor: '#000', mb: 0.2 }} /> {/* Simulación de QR */}
              <Typography sx={{ fontSize: '6px', fontWeight: 700 }}>VERIFICACIÓN DIAN</Typography>
            </Box>
          </Box>
        )}

        <Typography sx={{ fontSize: '9px', fontWeight: 700, fontStyle: 'italic' }}>
          ¡GRACIAS POR ELEGIR GOLOS STORE!
        </Typography>
        <Typography sx={{ fontSize: '8px', fontWeight: 500, maxWidth: '90%' }}>
          {sale.is_electronic_invoice 
            ? 'Esta es una representación gráfica de la factura electrónica.' 
            : 'Este documento no es factura de venta, es un tiquete de control interno.'}
        </Typography>
        
        <Box sx={{ mt: 1, borderTop: '0.5px solid #ccc', pt: 0.5, width: '100%' }}>
          <Typography sx={{ fontSize: '7px', color: '#666' }}>
            Software: Golos Inventory v2.0 • {new Date().getFullYear()}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ height: '8mm' }} />
    </Box>
  );
});

POSTicket.displayName = 'POSTicket';

export default POSTicket;
