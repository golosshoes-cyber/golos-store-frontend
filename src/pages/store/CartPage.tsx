import { useEffect, useState } from 'react'
import { Alert } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { storeService } from '../../services/storeService'
import type { StoreCartValidationItem } from '../../types/store'
import { getStoreCartItems, removeStoreCartItem, updateStoreCartItemQuantity, type StoreCartItem } from '../../utils/storeCart'
import StoreFooter from '../../components/store/StoreFooter'
import StoreHeader from '../../components/store/StoreHeader'

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
const money = (value: string) => currencyFormatter.format(Number(value))

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='80' height='80' fill='#f5f5f5'/><path d='M10 55 Q20 30 50 28 Q65 27 70 35 L72 45 Q60 42 45 48 Q30 54 10 55Z' fill='#c8c8c8'/><path d='M10 55 L72 52 L72 58 Q60 62 40 63 Q20 64 10 60Z' fill='#c8c8c8'/></svg>`)}`

export default function CartPage() {
  const navigate = useNavigate()
  const { mode } = useThemeMode()
  const [items, setItems] = useState<StoreCartItem[]>([])
  const [validatedItems, setValidatedItems] = useState<StoreCartValidationItem[]>([])
  const [total, setTotal] = useState('0')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

  const loadAndValidate = async () => {
    const current = getStoreCartItems()
    setItems(current)
    if (current.length === 0) { setValidatedItems([]); setTotal('0'); return }
    try {
      setLoading(true); setErrorMessage(null)
      const response = await storeService.validateCart(current)
      setValidatedItems(response.items); setTotal(response.total)
    } catch {
      setErrorMessage('No se pudo validar el carrito. Revisa stock y cantidades.')
      setValidatedItems([]); setTotal('0')
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadAndValidate() }, [])

  const handleQuantityChange = (variantId: number, quantity: number) => {
    const updated = updateStoreCartItemQuantity(variantId, quantity)
    setItems(updated)
  }

  const handleRemove = async (variantId: number) => {
    const updated = removeStoreCartItem(variantId)
    setItems(updated)
    await loadAndValidate()
  }



  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: css.bg, color: css.text, minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* NAV */}
      <StoreHeader backLink={{ to: '/store', label: 'Seguir comprando' }} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: css.text, letterSpacing: '-0.5px', margin: 0 }}>Carrito</h1>
        </div>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

        {items.length === 0 ? (
          <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: css.textMuted, marginBottom: 20 }}>Tu carrito está vacío.</div>
            <RouterLink to="/store" style={{ padding: '12px 24px', borderRadius: 6, background: css.accent, color: css.accentFg, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Ir a la tienda</RouterLink>
          </div>
        ) : (
          <>
            {/* Items card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}
            >
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${css.border}`, background: css.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>Ítems ({items.length})</span>
                <motion.button 
                  whileHover={{ color: css.text }}
                  onClick={() => void loadAndValidate()} 
                  disabled={loading} 
                  style={{ fontSize: 12, color: css.textMuted, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}
                >
                  Revalidar
                </motion.button>
              </div>
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const detail = validatedItems.find((l) => l.variant_id === item.variant_id)
                  return (
                    <motion.div 
                      key={item.variant_id} 
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: `1px solid ${css.border}`, overflow: 'hidden' }}
                    >
                      <div style={{ width: 64, height: 64, borderRadius: 8, background: css.bgSubtle, border: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        <img src={detail?.image_url || FALLBACK_IMAGE} alt={detail?.product_name || `Variante ${item.variant_id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { if ((e.target as HTMLImageElement).src !== FALLBACK_IMAGE) (e.target as HTMLImageElement).src = FALLBACK_IMAGE }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: css.text, marginBottom: 3 }}>{detail?.product_name || `Variante #${item.variant_id}`}</div>
                        <div style={{ fontSize: 12, color: css.textMuted }}>{detail?.variant_info || 'Pendiente de validación'}</div>
                        {detail && <div style={{ fontSize: 13, color: css.textFaint, marginTop: 3 }}>Precio unitario: {money(detail.unit_price)}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${css.border}`, borderRadius: 6, overflow: 'hidden' }}>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(item.variant_id, Math.max(1, item.quantity - 1))} style={{ width: 30, height: 32, border: 'none', background: css.bgSubtle, color: css.textMuted, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>−</motion.button>
                          <div style={{ width: 32, textAlign: 'center', fontSize: 13, fontWeight: 500, color: css.text, background: css.bg, borderLeft: `1px solid ${css.border}`, borderRight: `1px solid ${css.border}`, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</div>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(item.variant_id, item.quantity + 1)} style={{ width: 30, height: 32, border: 'none', background: css.bgSubtle, color: css.textMuted, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>+</motion.button>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.05, color: '#dc2626' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => void handleRemove(item.variant_id)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#b91c1c', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', padding: 4, borderRadius: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" /></svg>
                          Eliminar
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            {/* Totals card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}
            >
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: css.textMuted }}>Subtotal</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: css.text }}>{money(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: css.textMuted }}>Envío</span>
                  <span style={{ fontSize: 13, color: css.textFaint }}>Se calcula al finalizar</span>
                </div>
                <div style={{ height: 1, background: css.border, margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: css.text }}>Total estimado</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: css.text, letterSpacing: '-0.3px' }}>{money(total)}</span>
                </div>
                <motion.button
                  whileHover={!(loading || validatedItems.length === 0) ? { scale: 1.02 } : {}}
                  whileTap={!(loading || validatedItems.length === 0) ? { scale: 0.98 } : {}}
                  onClick={() => { if (!loading && validatedItems.length > 0) navigate('/store/checkout') }}
                  disabled={loading || validatedItems.length === 0}
                  style={{
                    width: '100%', padding: 14, borderRadius: 6, background: (loading || validatedItems.length === 0) ? css.textFaint : css.accent,
                    color: css.accentFg, border: 'none', fontSize: 14, fontWeight: 700, cursor: (loading || validatedItems.length === 0) ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 2h2l2 7h6l2-5H5" /><circle cx="7" cy="13" r="1" /><circle cx="11" cy="13" r="1" />
                  </svg>
                  {loading ? 'Validando...' : 'Ir a finalizar compra'}
                </motion.button>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                  {[
                    { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2L2 5v4c0 3 2.5 5.5 6 6 3.5-.5 6-3 6-6V5L8 2z" /></svg>, label: 'Pago seguro' },
                    { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 8h12M8 3l5 5-5 5" /></svg>, label: 'Envío rastreable' },
                    { icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2a6 6 0 100 12A6 6 0 008 2z" /><path d="M8 6v4M8 10v1" /></svg>, label: 'Soporte WhatsApp' },
                  ].map((t) => (
                    <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: css.textFaint }}>{t.icon}{t.label}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
      <StoreFooter />
    </div>
  )
}
