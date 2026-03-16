import React from 'react';

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
  return (
    <div
      ref={ref}
      className="pos-ticket"
      style={{
        width: '80mm',
        padding: '2mm 6mm', // Aumentamos padding lateral para mayor aire
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER: Premium Identity */}
      <div className="pos-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px', textAlign: 'center' }}>
        <p className="pos-store-name" style={{ 
          fontSize: '18px', 
          fontWeight: 900, 
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          margin: '0 0 4px 0',
          lineHeight: 1
        }}>
          {branding?.store_name || 'GOLOS STORE'}
        </p>
        
        <div className="pos-nit-badge" style={{ border: '1.5px solid #000', padding: '2px 10px', marginBottom: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, margin: 0 }}>
            {branding?.legal_id_type || 'NIT'}: {branding?.legal_id_number || '12209056'}
          </p>
        </div>

        <p style={{ fontSize: '10px', fontWeight: 700, maxWidth: '95%', margin: '0 0 2px 0' }}>
          {branding?.legal_contact_address || 'Carrera 8 # 9-59'}
        </p>
        <p style={{ fontSize: '10px', fontWeight: 700, margin: 0 }}>
          {branding?.legal_contact_city || 'Palermo'}, {branding?.legal_contact_department || 'Huila'} • Tel: {branding?.legal_contact_phone || '3168885906'}
        </p>
      </div>

      <hr className="pos-divider" style={{ border: 'none', borderTop: '2px solid #000', margin: '12px 0' }} />

      {/* SALE INFO: Clean Grid */}
      <div className="pos-sale-info" style={{ marginBottom: '16px' }}>
        <p className="pos-invoice-type" style={{ 
          fontSize: '11px', 
          fontWeight: 900, 
          backgroundColor: '#000', 
          color: '#fff', 
          padding: '4px 12px',
          display: 'inline-block',
          margin: '0 0 12px 0'
        }}>
          {sale.is_electronic_invoice ? 'FACTURA ELECTRÓNICA DE VENTA' : 'DOCUMENTO EQUIVALENTE POS'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>NÚMERO:</span>
            <span style={{ fontSize: '10px', fontWeight: 900 }}>{sale.document_number || `V-${sale.id}`}</span>
          </div>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>FECHA:</span>
            <span style={{ fontSize: '10px', fontWeight: 600 }}>{new Date(sale.created_at).toLocaleString()}</span>
          </div>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>CLIENTE:</span>
            <span style={{ fontSize: '10px', fontWeight: 800 }}>{sale.customer.toUpperCase()}</span>
          </div>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>CAJERO:</span>
            <span style={{ fontSize: '10px', fontWeight: 600 }}>{sale.created_by.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <hr className="pos-divider-dashed" style={{ border: 'none', borderTop: '1.5px dashed #000', margin: '12px 0' }} />

      {/* ITEMS TABLE: High Density */}
      <div className="pos-items-section" style={{ marginBottom: '16px' }}>
        <div className="pos-table-header" style={{ display: 'flex', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, flex: 1 }}>DESCRIPCIÓN</span>
          <span style={{ fontSize: '10px', fontWeight: 900, width: '35px', textAlign: 'center' }}>CT.</span>
          <span style={{ fontSize: '10px', fontWeight: 900, width: '80px', textAlign: 'right' }}>VALOR</span>
        </div>

        {sale.details.map((item, idx) => {
          const variant = typeof item.variant === 'object' ? item.variant : null;
          const productName = variant && (variant as any).product_name ? (variant as any).product_name : `PROD-${item.variant}`;
          
          return (
            <div key={idx} className="pos-item-row" style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="pos-item-name" style={{ fontSize: '11px', fontWeight: 800, flex: 1, lineHeight: 1.1 }}>
                  {productName.toUpperCase()}
                </span>
                <span className="pos-mono" style={{ fontSize: '11px', fontWeight: 700, width: '35px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.quantity}
                </span>
                <span className="pos-mono" style={{ fontSize: '11px', fontWeight: 700, width: '80px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatCurrency(Number(item.price) * item.quantity)}
                </span>
              </div>
              {variant && (
                <p className="pos-item-meta" style={{ fontSize: '10px', color: '#000', fontWeight: 700, margin: '4px 0 0 0' }}>
                   REF: {(variant as any).sku} • TALLA: {(variant as any).size} • {(variant as any).color.toUpperCase()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <hr className="pos-divider" style={{ border: 'none', borderTop: '2px solid #000', margin: '12px 0' }} />

      {/* TOTALS: Bold & Clear */}
      <div className="pos-totals-section" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '18px' }}>
        <div className="pos-total-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>SUBTOTAL:</span>
          <span className="pos-mono" style={{ fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(Number(sale.total))}</span>
        </div>
        <div className="pos-total-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>TRIBUTOS (IVA 0%):</span>
          <span className="pos-mono" style={{ fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>$0</span>
        </div>
        <div className="pos-total-row pos-grand-total" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', marginTop: '6px', borderTop: '2.5px solid #000' }}>
          <span style={{ fontSize: '16px', fontWeight: 900 }}>TOTAL:</span>
          <span className="pos-mono" style={{ fontSize: '20px', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(sale.total)}</span>
        </div>
        <div className="pos-total-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700 }}>MÉTODO DE PAGO:</span>
          <span style={{ fontSize: '12px', fontWeight: 900 }}>{sale.payment_method || 'EFECTIVO'}</span>
        </div>
      </div>

      <hr className="pos-divider" style={{ border: 'none', borderTop: '2px solid #000', margin: '12px 0' }} />

      {/* FOOTER: Legal Compliance & Branding */}
      <div className="pos-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '12px', gap: '12px' }}>
        {sale.is_electronic_invoice && sale.electronic_invoice && (
          <div style={{ width: '100%', marginBottom: '12px' }}>
             <p style={{ fontSize: '9px', fontWeight: 900, margin: '0 0 6px 0' }}>CUFE / CUDE:</p>
            <p className="pos-cufe" style={{ fontSize: '9px', fontWeight: 700, wordBreak: 'break-all', fontFamily: 'monospace', margin: 0, lineHeight: 1.1 }}>
              {sale.electronic_invoice.cufe}
            </p>
            
            <div className="pos-qr-container" style={{ 
              marginTop: '12px', 
              width: '40mm', 
              height: '40mm', 
              marginLeft: 'auto',
              marginRight: 'auto',
              border: '2.5px solid #000', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div className="pos-qr-sim" style={{ width: '34mm', height: '34mm', backgroundColor: '#000', marginBottom: '4px' }} /> {/* Simulación de QR */}
              <p style={{ fontSize: '9px', fontWeight: 900, margin: 0 }}>VERIFICACIÓN DIAN</p>
            </div>
          </div>
        )}

        <p className="pos-thanks" style={{ fontSize: '12px', fontWeight: 900, margin: 0 }}>
          ¡GRACIAS POR ELEGIR GOLOS STORE!
        </p>
        <p className="pos-legal-disclaimer" style={{ fontSize: '10px', fontWeight: 800, maxWidth: '95%', margin: 0, lineHeight: 1.2 }}>
          {sale.is_electronic_invoice 
            ? 'REPRESENTACIÓN GRÁFICA DE LA FACTURA ELECTRÓNICA.' 
            : 'ESTE DOCUMENTO NO ES FACTURA DE VENTA, ES UN TIQUETE DE CONTROL INTERNO.'}
        </p>
        
        <div className="pos-software-meta" style={{ marginTop: '15px', borderTop: '1.5px solid #000', paddingTop: '8px', width: '100%' }}>
          <p style={{ fontSize: '9px', fontWeight: 700, color: '#000', margin: 0 }}>
            SOFTWARE: GOLOS INVENTORY V2.0 • {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div style={{ height: '20mm' }} />
    </div>
  );
});

POSTicket.displayName = 'POSTicket';

export default POSTicket;
