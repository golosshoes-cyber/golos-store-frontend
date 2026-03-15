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
        padding: '4mm',
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER: Premium Identity */}
      <div className="pos-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px', textAlign: 'center' }}>
        <p className="pos-store-name" style={{ 
          fontSize: '16px', 
          fontWeight: 800, 
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          margin: '0 0 2px 0'
        }}>
          {branding?.store_name || 'GOLOS STORE'}
        </p>
        
        <div className="pos-nit-badge" style={{ border: '1px solid #000', padding: '1px 8px', marginBottom: '4px' }}>
          <p style={{ fontSize: '9px', fontWeight: 700, margin: 0 }}>
            {branding?.legal_id_type || 'NIT'}: {branding?.legal_id_number || '107531206'}
          </p>
        </div>

        <p style={{ fontSize: '9px', fontWeight: 500, maxWidth: '80%', margin: '0 0 2px 0' }}>
          {branding?.legal_contact_address || 'C.C. Portal del Quindío, Local 214'}
        </p>
        <p style={{ fontSize: '9px', fontWeight: 500, margin: 0 }}>
          Armenia, Quindío • Tel: {branding?.legal_contact_phone || '317 291 7178'}
        </p>
      </div>

      <hr className="pos-divider" style={{ border: 'none', borderTop: '1px solid #000', margin: '8px 0' }} />

      {/* SALE INFO: Clean Grid */}
      <div className="pos-sale-info" style={{ marginBottom: '12px' }}>
        <p className="pos-invoice-type" style={{ 
          fontSize: '10px', 
          fontWeight: 800, 
          backgroundColor: '#000', 
          color: '#fff', 
          padding: '3px 8px',
          display: 'inline-block',
          margin: '0 0 8px 0'
        }}>
          {sale.is_electronic_invoice ? 'FACTURA ELECTRÓNICA DE VENTA' : 'DOCUMENTO EQUIVALENTE POS'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '9px', fontWeight: 600 }}>NÚMERO:</span>
            <span style={{ fontSize: '9px', fontWeight: 800 }}>{sale.document_number || `V-${sale.id}`}</span>
          </div>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '9px', fontWeight: 600 }}>FECHA:</span>
            <span style={{ fontSize: '9px' }}>{new Date(sale.created_at).toLocaleString()}</span>
          </div>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '9px', fontWeight: 600 }}>CLIENTE:</span>
            <span style={{ fontSize: '9px', fontWeight: 700 }}>{sale.customer.toUpperCase()}</span>
          </div>
          <div className="pos-info-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '9px', fontWeight: 600 }}>CAJERO:</span>
            <span style={{ fontSize: '9px' }}>{sale.created_by.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <hr className="pos-divider-dashed" style={{ border: 'none', borderTop: '1px dashed #000', margin: '8px 0' }} />

      {/* ITEMS TABLE: High Density */}
      <div className="pos-items-section" style={{ marginBottom: '12px' }}>
        <div className="pos-table-header" style={{ display: 'flex', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 800, flex: 1 }}>DESCRIPCIÓN</span>
          <span style={{ fontSize: '8px', fontWeight: 800, width: '25px', textAlign: 'center' }}>CT.</span>
          <span style={{ fontSize: '8px', fontWeight: 800, width: '65px', textAlign: 'right' }}>VALOR</span>
        </div>

        {sale.details.map((item, idx) => {
          const variant = typeof item.variant === 'object' ? item.variant : null;
          const productName = variant && (variant as any).product_name ? (variant as any).product_name : `PROD-${item.variant}`;
          
          return (
            <div key={idx} className="pos-item-row" style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="pos-item-name" style={{ fontSize: '9px', fontWeight: 600, flex: 1, lineHeight: 1.1 }}>
                  {productName.toUpperCase()}
                </span>
                <span className="pos-mono" style={{ fontSize: '9px', width: '25px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.quantity}
                </span>
                <span className="pos-mono" style={{ fontSize: '9px', width: '65px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatCurrency(Number(item.price) * item.quantity)}
                </span>
              </div>
              {variant && (
                <p className="pos-item-meta" style={{ fontSize: '8px', color: '#444', fontStyle: 'italic', margin: '2px 0 0 0' }}>
                  Ref: {(variant as any).sku} • Talla: {(variant as any).size} • {(variant as any).color}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <hr className="pos-divider" style={{ border: 'none', borderTop: '1px solid #000', margin: '8px 0' }} />

      {/* TOTALS: Bold & Clear */}
      <div className="pos-totals-section" style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '12px' }}>
        <div className="pos-total-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>SUBTOTAL:</span>
          <span className="pos-mono" style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(Number(sale.total))}</span>
        </div>
        <div className="pos-total-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>TRIBUTOS (IVA 0%):</span>
          <span className="pos-mono" style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace" }}>$0</span>
        </div>
        <div className="pos-total-row pos-grand-total" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900 }}>TOTAL:</span>
          <span className="pos-mono" style={{ fontSize: '13px', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(sale.total)}</span>
        </div>
        <div className="pos-total-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>MÉTODO DE PAGO:</span>
          <span style={{ fontSize: '9px', fontWeight: 700 }}>{sale.payment_method || 'EFECTIVO'}</span>
        </div>
      </div>

      <hr className="pos-divider" style={{ border: 'none', borderTop: '1px solid #000', margin: '8px 0' }} />

      {/* FOOTER: Legal Compliance & Branding */}
      <div className="pos-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '8px', gap: '8px' }}>
        {sale.is_electronic_invoice && sale.electronic_invoice && (
          <div style={{ width: '100%', marginBottom: '8px' }}>
             <p style={{ fontSize: '7px', fontWeight: 700, margin: '0 0 4px 0' }}>CUFE / CUDE:</p>
            <p className="pos-cufe" style={{ fontSize: '7px', wordBreak: 'break-all', fontFamily: 'monospace', margin: 0 }}>
              {sale.electronic_invoice.cufe}
            </p>
            
            <div className="pos-qr-container" style={{ 
              marginTop: '8px', 
              width: '28mm', 
              height: '28mm', 
              marginLeft: 'auto',
              marginRight: 'auto',
              border: '1px solid #eee', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <div className="pos-qr-sim" style={{ width: '24mm', height: '24mm', backgroundColor: '#000', marginBottom: '1px' }} /> {/* Simulación de QR */}
              <p style={{ fontSize: '6px', fontWeight: 700, margin: 0 }}>VERIFICACIÓN DIAN</p>
            </div>
          </div>
        )}

        <p className="pos-thanks" style={{ fontSize: '9px', fontWeight: 700, fontStyle: 'italic', margin: 0 }}>
          ¡GRACIAS POR ELEGIR GOLOS STORE!
        </p>
        <p className="pos-legal-disclaimer" style={{ fontSize: '8px', fontWeight: 500, maxWidth: '90%', margin: 0 }}>
          {sale.is_electronic_invoice 
            ? 'Esta es una representación gráfica de la factura electrónica.' 
            : 'Este documento no es factura de venta, es un tiquete de control interno.'}
        </p>
        
        <div className="pos-software-meta" style={{ marginTop: '8px', borderTop: '0.5px solid #ccc', paddingTop: '4px', width: '100%' }}>
          <p style={{ fontSize: '7px', color: '#666', margin: 0 }}>
            Software: Golos Inventory v2.0 • {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div style={{ height: '8mm' }} />
    </div>
  );
});

POSTicket.displayName = 'POSTicket';

export default POSTicket;
