import { useEffect, useState } from 'react'
import { Alert, CircularProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { isAxiosError } from 'axios'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import type { StoreCartValidationItem, StoreShippingAddress } from '../../types/store'
import { getStoreCartItems, clearStoreCart } from '../../utils/storeCart'
import StoreFooter from '../../components/store/StoreFooter'
import StoreHeader from '../../components/store/StoreHeader'
import ShippingAddressForm from '../../components/shipping/ShippingAddressForm'
import ShippingQuoteCalculator from '../../components/shipping/ShippingQuoteCalculator'
import type { ShippingQuoteService } from '../../hooks/useShipping'

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
const money = (value: string) => currencyFormatter.format(Number(value))
const isLikelyPhone = (value: string): boolean => /^\d{7,15}$/.test(value.trim())

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' fill='#f5f5f5'/><path d='M6 33 Q12 18 30 17 Q39 16 42 21 L43 27 Q36 25 27 29 Q18 32 6 33Z' fill='#c8c8c8'/></svg>`)}`

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { mode } = useThemeMode()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [items, setItems] = useState<StoreCartValidationItem[]>([])
  const [total, setTotal] = useState('0')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [shippingZone] = useState<'local' | 'regional' | 'national'>('regional')
  const [estimatedWeightGrams] = useState<number>(900)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<StoreShippingAddress>(() => {
    const saved = localStorage.getItem('store_shipping_address')
    if (saved) { try { return JSON.parse(saved) } catch (e) {} }
    return { department: '', city: '', address_line1: '', address_line2: '', reference: '', postal_code: '', recipient_name: '', recipient_phone: '' }
  })
  const [selectedShippingService, setSelectedShippingService] = useState<ShippingQuoteService | null>(null)

  const displayTotal = String((Number(total) || 0) + (selectedShippingService ? Number(selectedShippingService.cost) : 0))

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

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { navigate('/store/register?next=%2Fstore%2Fcheckout', { replace: true }); return }
    const loadPreview = async () => {
      const cartItems = getStoreCartItems()
      if (cartItems.length === 0) { setErrorMessage('Tu carrito está vacío. Agrega productos antes de continuar.'); return }
      try {
        setLoading(true)
        const response = await storeService.validateCart(cartItems, { shipping_zone: shippingZone, estimated_weight_grams: estimatedWeightGrams })
        setItems(response.items); setTotal(response.total)
      } catch { setErrorMessage('No se pudo validar el carrito para checkout.') }
      finally { setLoading(false) }
    }
    void loadPreview()
  }, [authLoading, isAuthenticated, navigate, shippingZone, estimatedWeightGrams])

  useEffect(() => {
    if (!user) return
    setShippingAddress((prev) => {
      const recipient_name = prev.recipient_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
      const recipient_phone = prev.recipient_phone || (isLikelyPhone(user.username || '') ? user.username : '')
      const newAddr = { ...prev, recipient_name, recipient_phone }
      localStorage.setItem('store_shipping_address', JSON.stringify(newAddr))
      return newAddr
    })
  }, [user])

  const handleAddressChange = (newAddress: StoreShippingAddress) => {
    if (newAddress.city !== shippingAddress.city || newAddress.department !== shippingAddress.department) {
      setSelectedShippingService(null)
    }
    setShippingAddress(newAddress)
    localStorage.setItem('store_shipping_address', JSON.stringify(newAddress))
  }

  const handleCheckout = async () => {
    if (!user) { setErrorMessage('Debes iniciar sesión para continuar.'); return }
    if (!acceptTerms) { setErrorMessage('Debes aceptar los términos y condiciones para continuar.'); return }
    if (!shippingAddress.department.trim() || !shippingAddress.city.trim() || !shippingAddress.address_line1.trim() || !shippingAddress.recipient_name.trim() || !shippingAddress.recipient_phone.trim()) {
      setErrorMessage('Completa los datos obligatorios de dirección de envío.'); return
    }
    try {
      setLoading(true); setErrorMessage(null)
      const customerName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
      const customerContact = shippingAddress.recipient_phone.trim()
      const cartItems = getStoreCartItems()
      const checkoutPayload: any = {
        customer_name: customerName, customer_contact: customerContact, items: cartItems, is_order: true,
        shipping_zone: shippingZone, estimated_weight_grams: estimatedWeightGrams, shipping_address: shippingAddress,
        shipping_service: selectedShippingService?.name,
      }
      const response = await storeService.checkout(checkoutPayload)
      clearStoreCart()
      setSuccessMessage(`Pedido creado: #${response.order.sale_id}`)
      setTimeout(() => { navigate(`/store/order-status?sale_id=${response.order.sale_id}&customer_contact=${encodeURIComponent(customerContact)}`) }, 500)
    } catch (error) {
      if (isAxiosError(error)) {
        const payload = error.response?.data as { detail?: string } | undefined
        setErrorMessage(payload?.detail || 'No se pudo completar el checkout. Verifica stock e intenta de nuevo.')
      } else {
        setErrorMessage('No se pudo completar el checkout. Verifica stock e intenta de nuevo.')
      }
    } finally { setLoading(false) }
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: css.bg, color: css.text, minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <StoreHeader backLink={{ to: '/store/cart', label: 'Volver al carrito' }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }}>

        {/* Stepper */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 36, padding: '20px 24px', background: css.bgSubtle, border: `1px solid ${css.border}`, borderRadius: 16 }}
        >
          {[
            { label: 'Carrito', done: true, active: false, num: '✓' },
            { label: 'Datos de envío', done: false, active: true, num: '2' },
            { label: 'Confirmación', done: false, active: false, num: '3' },
          ].map((step, i, arr) => (
            <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, position: 'relative' }}>
              {i < arr.length - 1 && (
                <div style={{ position: 'absolute', top: 14, left: 'calc(50% + 16px)', width: 'calc(100% - 32px)', height: 1, background: step.done ? css.text : css.border }} />
              )}
              <motion.div 
                animate={step.active ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } } : {}}
                style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, position: 'relative', zIndex: 1,
                  background: step.done ? css.text : css.bg,
                  border: `2px solid ${step.done || step.active ? css.text : css.border}`,
                  color: step.done ? css.accentFg : step.active ? css.text : css.textFaint,
                }}
              >
                {step.num}
              </motion.div>
              <div style={{ fontSize: 11, fontWeight: step.active ? 600 : 500, color: step.active ? css.text : step.done ? css.textMuted : css.textFaint }}>{step.label}</div>
            </div>
          ))}
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: css.text, letterSpacing: '-0.5px', margin: 0 }}>Finalizar compra</h1>
        </div>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          {/* LEFT COLUMN */}
          <div>
            {/* Account info */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: css.text, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${css.border}` }}>Datos de la cuenta</div>
              <div style={{ padding: '14px 16px', background: css.bgSubtle, border: `1px solid ${css.border}`, borderRadius: 6, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: css.textMuted, marginBottom: 4 }}>Nombre: <span style={{ color: css.text, fontWeight: 500 }}>{`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || '-'}</span></div>
                <div style={{ fontSize: 13, color: css.textMuted }}>Contacto: <span style={{ color: css.text, fontWeight: 500 }}>{user?.email || user?.username || '-'}</span></div>
                <div style={{ fontSize: 11, color: css.textFaint, marginTop: 8 }}>Para reducir errores, esta pantalla usa automáticamente los datos de tu cuenta.</div>
              </div>
            </div>

            {/* Shipping address form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: css.text, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${css.border}` }}>Dirección de envío</div>
              <ShippingAddressForm initialAddress={shippingAddress} onChange={handleAddressChange} />
            </motion.div>

            {/* Shipping options */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: css.text, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${css.border}` }}>Opciones de envío</div>
              <ShippingQuoteCalculator
                destinationCity={shippingAddress.city}
                destinationCityCode={shippingAddress.city_code}
                destinationDepartment={shippingAddress.department}
                destinationDepartmentCode={shippingAddress.department_code}
                weightGrams={estimatedWeightGrams}
                selectedService={selectedShippingService}
                onSelectService={setSelectedShippingService}
                onQuotesLoaded={(services) => {
                  if (services.length > 0) {
                    const currentService = selectedShippingService;
                    const isStillAvailable = services.find(s => s.name === currentService?.name);
                    
                    if (!currentService || !isStillAvailable) {
                      // Usar un timeout pequeño para asegurar que el renderizado de la calculadora terminó
                      setTimeout(() => setSelectedShippingService(services[0]), 0);
                    } else if (isStillAvailable.cost !== currentService.cost) {
                      // Si el costo del mismo servicio cambió (ej. de regional a local), actualizarlo
                      setTimeout(() => setSelectedShippingService(isStillAvailable), 0);
                    }
                  } else {
                    setSelectedShippingService(null)
                  }
                }}
              />
            </motion.div>

          </div>

          {/* RIGHT SIDEBAR - Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: css.bgSubtle, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20, position: 'sticky', top: 80 }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: css.text, marginBottom: 16 }}>Resumen del pedido</div>

            {loading && items.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><CircularProgress size={20} /></div>
            ) : (
              <>
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.variant_id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: css.bg, border: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        {item.image_url
                          ? <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE }} />
                          : <img src={FALLBACK_IMAGE} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: css.text }}>{item.product_name}</div>
                        <div style={{ fontSize: 11, color: css.textFaint }}>{item.variant_info} · ×{item.quantity}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: css.text, flexShrink: 0 }}>{money(item.subtotal)}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div style={{ height: 1, background: css.border, margin: '14px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: css.textMuted }}>Subtotal</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: css.text }}>{money(total)}</span>
                </div>
                {selectedShippingService && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, overflow: 'hidden' }}
                  >
                    <span style={{ fontSize: 12, color: css.textMuted }}>Envío ({selectedShippingService.name})</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: css.text }}>{money(selectedShippingService.cost)}</span>
                  </motion.div>
                )}

                <div style={{ height: 1, background: css.border, margin: '14px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: css.text }}>Total general</span>
                  <motion.span 
                    key={displayTotal}
                    initial={{ scale: 1.1, color: css.accent }}
                    animate={{ scale: 1, color: css.text }}
                    style={{ fontSize: 16, fontWeight: 700 }}
                  >
                    {money(displayTotal)}
                  </motion.span>
                </div>
              </>
            )}

            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <RouterLink to="/store/terms" style={{ fontSize: 12, color: css.textFaint, textDecoration: 'underline' }}>Ver términos</RouterLink>
                <RouterLink to="/store/privacy" style={{ fontSize: 12, color: css.textFaint, textDecoration: 'underline' }}>Política de datos</RouterLink>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <input type="checkbox" id="accept-terms" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} style={{ marginTop: 2, accentColor: css.text }} />
                <label htmlFor="accept-terms" style={{ fontSize: 12, color: css.textMuted, lineHeight: 1.5, cursor: 'pointer' }}>
                  Acepto los <span style={{ color: css.text, textDecoration: 'underline' }}>términos y condiciones</span> y la política de datos personales.
                </label>
              </div>
            </div>

            <motion.button
              whileHover={(acceptTerms && !loading && items.length > 0) ? { scale: 1.02 } : {}}
              whileTap={(acceptTerms && !loading && items.length > 0) ? { scale: 0.98 } : {}}
              onClick={() => { if (acceptTerms && !loading && items.length > 0) void handleCheckout() }}
              disabled={loading || items.length === 0 || !acceptTerms}
              style={{
                width: '100%', padding: 13, borderRadius: 6,
                background: (acceptTerms && !loading && items.length > 0) ? css.accent : css.textFaint,
                color: css.accentFg, border: 'none', fontSize: 14, fontWeight: 700,
                cursor: (acceptTerms && !loading && items.length > 0) ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-6" /></svg>
              {loading ? 'Procesando...' : 'Confirmar y crear pedido'}
            </motion.button>
          </motion.div>
        </div>
      </div>
      <StoreFooter />
    </div>
  )
}
