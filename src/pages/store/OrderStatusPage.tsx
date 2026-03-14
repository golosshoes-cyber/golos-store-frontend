import { useEffect, useMemo, useState } from 'react'
import { Alert, MenuItem, TextField } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { isAxiosError } from 'axios'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import StoreFooter from '../../components/store/StoreFooter'
import type { StoreOrder } from '../../types/store'
import ShipmentStatus from '../../components/shipping/ShipmentStatus'
import ShipmentTracker from '../../components/shipping/ShipmentTracker'

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
const money = (value: string) => currencyFormatter.format(Number(value))

const formatDateTime = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(parsed)
}

const statusChipColor = (status: string): string => {
  const n = status.toLowerCase()
  if (['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(n)) return '#15803d'
  if (n === 'pending') return '#b45309'
  if (n === 'canceled') return '#b91c1c'
  return '#6b6b6b'
}
const statusChipBg = (status: string): string => {
  const n = status.toLowerCase()
  if (['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(n)) return '#f0fdf4'
  if (n === 'pending') return '#fffbeb'
  if (n === 'canceled') return '#fef2f2'
  return '#f5f5f5'
}

export default function OrderStatusPage() {
  const theme = useTheme()
  const { mode } = useThemeMode()
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  const [saleId, setSaleId] = useState(searchParams.get('sale_id') || '')
  const [customerQuery, setCustomerQuery] = useState(searchParams.get('customer') || '')
  const [customerContact, setCustomerContact] = useState(searchParams.get('customer_contact') || '')
  const [paymentMethod, setPaymentMethod] = useState('PSE')

  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [successSeverity, setSuccessSeverity] = useState<'success' | 'warning'>('success')

  const isDark = mode === 'dark'
  const css = isDark ? {
    bg: '#0f0f0f', bgSubtle: '#1a1a1a', bgCard: '#181818', bgHover: '#222222',
    border: '#2a2a2a', borderStrong: '#3a3a3a', text: '#f5f5f5', textMuted: '#a0a0a0',
    textFaint: '#555555', accent: '#f5f5f5', accentFg: '#111111',
  } : {
    bg: '#ffffff', bgSubtle: '#f5f5f5', bgCard: '#ffffff', bgHover: '#f0f0f0',
    border: '#e5e5e5', borderStrong: '#c8c8c8', text: '#111111', textMuted: '#6b6b6b',
    textFaint: '#a8a8a8', accent: '#111111', accentFg: '#ffffff',
  }

  const getVerifyMessageByStatus = (status: string): { kind: 'success' | 'warning'; text: string } => {
    const normalized = status.toUpperCase()
    if (normalized === 'APPROVED') return { kind: 'success', text: 'Pago aprobado y pedido actualizado correctamente.' }
    if (['DECLINED', 'ERROR', 'VOIDED'].includes(normalized)) return { kind: 'warning', text: `Pago rechazado/fallido: ${normalized}.` }
    return { kind: 'warning', text: `Pago sincronizado: ${normalized}.` }
  }

  const canPay = useMemo(() => {
    if (!selectedOrder) return false
    return selectedOrder.status === 'pending' && selectedOrder.payment_status !== 'paid'
  }, [selectedOrder])

  const handleSearch = async () => {
    const id = saleId ? Number(saleId) : undefined
    if (!id && !customerQuery.trim()) { setErrorMessage('Ingresa número de pedido o nombre/contacto para consultar.'); return }
    if (customerQuery.trim() && !isAuthenticated && customerContact.trim().length < 4) { setErrorMessage('Para buscar por cliente, ingresa al menos 4 dígitos del contacto del pedido.'); return }
    if (saleId && Number.isNaN(id)) { setErrorMessage('El número de pedido es inválido.'); return }
    try {
      setLoading(true); setErrorMessage(null)
      const response = await storeService.lookupOrders({ sale_id: id, customer: customerQuery.trim() || undefined, customer_contact: customerContact.trim() || undefined })
      setOrders(response.orders)
      if (response.orders.length === 1) { setSelectedOrder(response.orders[0]); setSaleId(String(response.orders[0].sale_id)) }
      else setSelectedOrder(null)
    } catch { setOrders([]); setSelectedOrder(null); setErrorMessage('No se encontraron pedidos con ese criterio.') }
    finally { setLoading(false) }
  }

  const handlePay = async () => {
    if (!selectedOrder) { setErrorMessage('Selecciona un pedido para continuar con el pago.'); return }
    if (!customerContact.trim() && !isAuthenticated) { setErrorMessage('Para pagar sin sesión, ingresa el contacto del pedido.'); return }
    try {
      setPaying(true); setErrorMessage(null)
      const response = await storeService.payOrder(selectedOrder.sale_id, customerContact.trim(), paymentMethod)
      if (response.payment.checkout_url) { window.location.href = response.payment.checkout_url; return }
      setSuccessMessage('Checkout generado correctamente.')
      setSelectedOrder(response.order)
      setOrders((prev) => prev.map((o) => (o.sale_id === response.order.sale_id ? response.order : o)))
    } catch { setErrorMessage('No se pudo iniciar el pago con Wompi.') }
    finally { setPaying(false) }
  }

  const verifyFromRedirect = async () => {
    const transactionId = searchParams.get('id')
    const id = saleId ? Number(saleId) : undefined
    if (!transactionId || !id) return
    if (!customerContact.trim() && !isAuthenticated) return
    try {
      setVerifying(true); setErrorMessage(null); setSuccessMessage(null); setSuccessSeverity('success')
      const response = await storeService.verifyWompiTransaction(id, customerContact.trim(), transactionId)
      setSelectedOrder(response.order)
      setOrders((prev) => { const exists = prev.some((o) => o.sale_id === response.order.sale_id); if (!exists) return [response.order]; return prev.map((o) => (o.sale_id === response.order.sale_id ? response.order : o)) })
      const verifyMessage = getVerifyMessageByStatus(response.transaction.status)
      setSuccessSeverity(verifyMessage.kind); setSuccessMessage(verifyMessage.text)
    } catch (error) {
      if (isAxiosError(error)) setErrorMessage((error.response?.data as { detail?: string } | undefined)?.detail || 'No se pudo verificar la transacción de Wompi.')
      else setErrorMessage('No se pudo verificar la transacción de Wompi.')
    } finally { setVerifying(false) }
  }

  useEffect(() => {
    if (saleId || customerQuery || customerContact || searchParams.get('id')) { void handleSearch(); void verifyFromRedirect() }
  }, [])

  const inputStyle: React.CSSProperties = { padding: '9px 12px', borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg, color: css.text, fontSize: 13, fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: css.bg, color: css.text, minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, height: 60, background: css.bg, borderBottom: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 24 }}>
        <RouterLink to="/store" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: css.text, display: 'flex', alignItems: 'center', justifyContent: 'center', color: css.bg, fontSize: 12, fontWeight: 700 }}>GS</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: css.text }}>Golos Store</span>
        </RouterLink>
        <div style={{ flex: 1 }} />
        <RouterLink to="/store" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: css.textMuted, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3L5 8l5 5" /></svg>
          Volver a tienda
        </RouterLink>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 32px' }}>
        {/* Search card */}
        <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: css.text, marginBottom: 4, letterSpacing: '-0.3px' }}>Estado del pedido</div>
          <div style={{ fontSize: 13, color: css.textFaint, marginBottom: 20, lineHeight: 1.5 }}>
            Busca por número de pedido o por nombre del cliente. Para búsqueda por cliente, valida con contacto.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10 }}>
            <input style={inputStyle} placeholder="Número de pedido (opcional)" value={saleId} onChange={(e) => setSaleId(e.target.value)} />
            <input style={inputStyle} placeholder="Nombre del cliente (opcional)" value={customerQuery} onChange={(e) => setCustomerQuery(e.target.value)} />
            <input style={inputStyle} placeholder="Contacto para verificar" value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} />
            <button onClick={() => void handleSearch()} disabled={loading} style={{ padding: '8px 20px', borderRadius: 6, background: css.accent, color: css.accentFg, border: 'none', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? '...' : 'Consultar'}
            </button>
          </div>
        </div>

        {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity={successSeverity} onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>{successMessage}</Alert>}
        {verifying && <Alert severity="info" sx={{ mb: 2 }}>Verificando transacción de Wompi...</Alert>}

        {/* Multiple results */}
        {orders.length > 1 && (
          <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${css.border}`, background: css.bgSubtle }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>Resultados ({orders.length})</span>
            </div>
            {orders.map((order, idx) => (
              <div key={order.sale_id} style={{ padding: '16px 20px', borderBottom: idx < orders.length - 1 ? `1px solid ${css.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: css.text }}>Pedido #{order.sale_id}</div>
                  <div style={{ fontSize: 12, color: css.textMuted }}>{formatDateTime(order.created_at)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: statusChipBg(order.status), color: statusChipColor(order.status) }}>{order.status_detail.label}</span>
                  <button onClick={() => { setSelectedOrder(order); setSaleId(String(order.sale_id)) }} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 6, border: `1px solid ${css.border}`, background: 'none', color: css.textMuted, cursor: 'pointer', fontFamily: 'inherit' }}>Ver detalle</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected order detail */}
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Order info */}
            <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${css.border}`, background: css.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: css.text }}>Pedido #{selectedOrder.sale_id}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: statusChipBg(selectedOrder.status), color: statusChipColor(selectedOrder.status) }}>{selectedOrder.status_detail.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: statusChipBg(selectedOrder.payment_status), color: statusChipColor(selectedOrder.payment_status) }}>Pago: {selectedOrder.payment_status}</span>
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 14, color: css.text, marginBottom: 6 }}>Total: <strong>{money(selectedOrder.total)}</strong></div>
                {selectedOrder.payment_reference && <div style={{ fontSize: 12, color: css.textMuted, marginBottom: 4 }}>Ref: {selectedOrder.payment_reference}</div>}
                <div style={{ fontSize: 12, color: css.textFaint, marginBottom: 2 }}>Creado: {formatDateTime(selectedOrder.created_at)}</div>
                <div style={{ fontSize: 12, color: css.textFaint, marginBottom: 2 }}>Última actualización: {formatDateTime(selectedOrder.updated_at)}</div>
                {selectedOrder.shipping_address && (
                  <div style={{ fontSize: 12, color: css.textFaint }}>
                    Envío: {selectedOrder.shipping_address.address_line1}, {selectedOrder.shipping_address.city} ({selectedOrder.shipping_address.department})
                  </div>
                )}
              </div>
            </div>

            {/* Payment card (Wompi) */}
            {canPay && (
              <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${css.border}`, background: css.bgSubtle }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>Pagar con Wompi</span>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: css.textMuted }}>Selecciona método de pago:</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                      { id: 'PSE', label: 'PSE', icon: '🏦' },
                      { id: 'CARD', label: 'Tarjeta', icon: '💳' },
                      { id: 'NEQUI', label: 'Nequi', icon: '💜' }
                    ].map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          flex: '1 1 auto',
                          minWidth: 90,
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: `1.5px solid ${paymentMethod === m.id ? css.accent : css.border}`,
                          background: paymentMethod === m.id ? css.accent : css.bgCard,
                          color: paymentMethod === m.id ? css.accentFg : css.text,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                        onMouseEnter={(e) => {
                          if (paymentMethod !== m.id) {
                            e.currentTarget.style.borderColor = css.borderStrong;
                            e.currentTarget.style.background = css.bgHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (paymentMethod !== m.id) {
                            e.currentTarget.style.borderColor = css.border;
                            e.currentTarget.style.background = css.bgCard;
                          }
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{m.icon}</span>
                        {m.label}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => void handlePay()} 
                    disabled={paying} 
                    style={{ 
                      marginTop: 4,
                      width: '100%',
                      padding: '12px 20px', 
                      borderRadius: 10, 
                      background: css.accent, 
                      color: css.accentFg, 
                      border: 'none', 
                      fontSize: 14, 
                      fontWeight: 600, 
                      cursor: paying ? 'not-allowed' : 'pointer', 
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {paying ? 'Conectando...' : 'Ir a pagar'}
                  </button>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${css.border}`, background: css.bgSubtle }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>Timeline</span>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {selectedOrder.timeline.map((event, index) => (
                  <div key={`${event.code}-${event.at}`} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 12 }}>
                    <div style={{ position: 'relative', paddingTop: 2 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: index === 0 ? css.accent : alpha(theme.palette.text.primary, 0.35) }} />
                      {index < selectedOrder.timeline.length - 1 && (
                        <div style={{ position: 'absolute', left: 4, top: 12, bottom: -16, width: 2, background: alpha(theme.palette.text.primary, 0.15) }} />
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>{event.label}</span>
                      <span style={{ fontSize: 12, color: css.textFaint }}>{formatDateTime(event.at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${css.border}`, background: css.bgSubtle }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>Ítems</span>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={`${item.variant_id}-${item.product_name}`}>
                    {idx > 0 && <div style={{ height: 1, background: css.border, marginBottom: 12 }} />}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: css.text }}>{item.product_name}</div>
                        <div style={{ fontSize: 12, color: css.textFaint }}>{item.variant_info} × {item.quantity}</div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: css.text }}>{money(item.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipment */}
            {selectedOrder.shipment && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ShipmentStatus status={selectedOrder.shipment.status} trackingNumber={selectedOrder.shipment.tracking_number} labelUrl={selectedOrder.shipment.label_url} />
                <ShipmentTracker trackingNumber={selectedOrder.shipment.tracking_number} />
              </div>
            )}
          </div>
        )}
      </div>
      <StoreFooter />
    </div>
  )
}
