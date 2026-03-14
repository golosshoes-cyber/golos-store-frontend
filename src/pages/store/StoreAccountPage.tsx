import { useEffect, useState } from 'react'
import { Alert } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import StoreFooter from '../../components/store/StoreFooter'
import type { StoreOrder } from '../../types/store'

const currencyFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

const statusColor = (status: string): string => {
  const n = status.toLowerCase()
  if (['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(n)) return '#15803d'
  if (n === 'pending') return '#b45309'
  if (n === 'canceled') return '#b91c1c'
  return '#6b6b6b'
}

const statusBg = (status: string): string => {
  const n = status.toLowerCase()
  if (['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(n)) return '#f0fdf4'
  if (n === 'pending') return '#fffbeb'
  if (n === 'canceled') return '#fef2f2'
  return '#f5f5f5'
}

export default function StoreAccountPage() {
  const navigate = useNavigate()
  const { mode } = useThemeMode()
  const { user, isAuthenticated, logout } = useAuth()
  const [orders, setOrders] = useState<StoreOrder[]>([])
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

  useEffect(() => {
    if (!isAuthenticated) { navigate('/store/login', { replace: true }); return }
    const load = async () => {
      try {
        setLoading(true); setErrorMessage(null)
        const response = await storeService.getMyOrders()
        setOrders(response.orders)
      } catch { setErrorMessage('No se pudo cargar tu historial de pedidos.') }
      finally { setLoading(false) }
    }
    void load()
  }, [isAuthenticated, navigate])

  const handleLogout = () => { logout(); navigate('/store', { replace: true }) }

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
        <RouterLink to="/store" style={{ padding: '7px 14px', borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg, color: css.textMuted, textDecoration: 'none', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2h2l2 7h6l2-5H5" /></svg>
          Tienda
        </RouterLink>
        <button onClick={handleLogout} style={{ padding: '7px 14px', borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg, color: css.textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
          Salir
        </button>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 32px' }}>
        {/* Account header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: css.text, color: css.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
            {(user?.username || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: css.text, letterSpacing: '-0.4px' }}>Mi cuenta</div>
            <div style={{ fontSize: 13, color: css.textFaint }}>{user?.email || user?.username || ''}</div>
          </div>
        </div>

        {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 2 }}>{errorMessage}</Alert>}

        {/* Orders card */}
        <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${css.border}`, background: css.bgSubtle }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>Mis pedidos</span>
          </div>

          {loading ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: css.textMuted, fontSize: 13 }}>Cargando pedidos...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: css.bgSubtle, border: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: css.textFaint }}>
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="2" /><path d="M5 7h6M5 10h4" /></svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: css.text, marginBottom: 6 }}>Aún no tienes pedidos</div>
              <div style={{ fontSize: 13, color: css.textFaint, marginBottom: 20 }}>Cuando realices una compra, tus pedidos aparecerán aquí.</div>
              <RouterLink to="/store" style={{ padding: '12px 24px', borderRadius: 6, background: css.accent, color: css.accentFg, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Ir a la tienda</RouterLink>
            </div>
          ) : (
            <div>
              {orders.map((order, idx) => (
                <div key={order.sale_id} style={{ padding: '16px 20px', borderBottom: idx < orders.length - 1 ? `1px solid ${css.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: css.text }}>Pedido #{order.sale_id}</div>
                    <div style={{ fontSize: 12, color: css.textMuted, marginTop: 2 }}>Total: {currencyFormatter.format(Number(order.total || '0'))}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: statusBg(order.status), color: statusColor(order.status) }}>
                      {order.status_detail.label}
                    </span>
                    <RouterLink to={`/store/order-status?sale_id=${order.sale_id}`} style={{
                      fontSize: 12, padding: '5px 10px', borderRadius: 6, border: `1px solid ${css.border}`,
                      color: css.textMuted, textDecoration: 'none', fontWeight: 500,
                    }}>Ver estado</RouterLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <StoreFooter />
    </div>
  )
}
