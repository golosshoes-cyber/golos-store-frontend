import { useEffect, useState } from 'react'
import { Alert, CircularProgress } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import { authService } from '../../services/authService'
import StoreFooter from '../../components/store/StoreFooter'
import StoreHeader from '../../components/store/StoreHeader'
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
  const { user, isAuthenticated, refreshUser } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')
  
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [loadingProfile, setLoadingProfile] = useState(false)

  // Password Form State
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)

  const isDark = mode === 'dark'
  const css = isDark ? {
    bg: '#0f0f0f', bgSubtle: '#1a1a1a', bgCard: '#181818', bgHover: '#222222',
    border: '#2a2a2a', borderStrong: '#3a3a3a', text: '#f5f5f5', textMuted: '#a0a0a0',
    textFaint: '#555555', accent: '#f5f5f5', accentFg: '#111111', inputBg: '#0f0f0f'
  } : {
    bg: '#ffffff', bgSubtle: '#f5f5f5', bgCard: '#ffffff', bgHover: '#f0f0f0',
    border: '#e5e5e5', borderStrong: '#c8c8c8', text: '#111111', textMuted: '#6b6b6b',
    textFaint: '#a8a8a8', accent: '#111111', accentFg: '#ffffff', inputBg: '#fafafa'
  }

  useEffect(() => {
    if (!isAuthenticated) { navigate('/store/login', { replace: true }); return }
    const loadOrders = async () => {
      try {
        setLoadingOrders(true); setErrorMessage(null)
        const response = await storeService.getMyOrders()
        setOrders(response.orders)
      } catch { setErrorMessage('No se pudo cargar tu historial de pedidos.') }
      finally { setLoadingOrders(false) }
    }
    
    if (activeTab === 'orders') {
        void loadOrders()
    }
  }, [isAuthenticated, navigate, activeTab])

  // Sync state if user context updates
  useEffect(() => {
      if (user) {
          setFirstName(user.first_name || '')
          setLastName(user.last_name || '')
          setEmail(user.email || '')
      }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setLoadingProfile(true)
    try {
        await authService.updateCurrentUser({
            first_name: firstName,
            last_name: lastName,
            email: email,
        })
        await refreshUser()
        setSuccessMessage('Perfil actualizado correctamente.')
    } catch (err: any) {
        setErrorMessage(err.response?.data?.detail || 'Error al actualizar el perfil.')
    } finally {
        setLoadingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (newPassword !== confirmPassword) {
        setErrorMessage('Las contraseñas nuevas no coinciden.')
        return
    }

    if (newPassword.length < 8) {
        setErrorMessage('La contraseña debe tener al menos 8 caracteres.')
        return
    }

    setLoadingPassword(true)
    try {
        await authService.changeMyPassword(oldPassword, newPassword)
        setSuccessMessage('Contraseña actualizada correctamente.')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
    } catch (err: any) {
        if (err.response?.data?.old_password) {
             setErrorMessage(err.response.data.old_password[0])
        } else {
             setErrorMessage(err.response?.data?.detail || 'Error al cambiar la contraseña.')
        }
    } finally {
        setLoadingPassword(false)
    }
  }


  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: css.bg, color: css.text, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>
      
      <StoreHeader />

      <div style={{ flex: 1, padding: '40px 20px', maxWidth: 800, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Account Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: css.text, color: css.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
             {(user?.first_name || user?.username || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: css.text, letterSpacing: '-0.5px' }}>
                Hola, {user?.first_name || user?.username || 'Cliente'}
            </div>
            <div style={{ fontSize: 14, color: css.textFaint, marginTop: 2 }}>Administra tus pedidos y preferencias de cuenta</div>
          </div>
        </div>

        {/* Global Messages */}
        {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 3 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 3 }}>{successMessage}</Alert>}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 32, borderBottom: `1px solid ${css.border}`, marginBottom: 32 }}>
            <button 
                onClick={() => setActiveTab('orders')}
                style={{ 
                    background: 'none', border: 'none', padding: '0 0 12px 0', 
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    color: activeTab === 'orders' ? css.text : css.textMuted,
                    borderBottom: activeTab === 'orders' ? `2px solid ${css.text}` : '2px solid transparent',
                    transition: 'all 0.2s'
                }}
            >
                Mis Pedidos
            </button>
            <button 
                onClick={() => setActiveTab('profile')}
                style={{ 
                    background: 'none', border: 'none', padding: '0 0 12px 0', 
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    color: activeTab === 'profile' ? css.text : css.textMuted,
                    borderBottom: activeTab === 'profile' ? `2px solid ${css.text}` : '2px solid transparent',
                    transition: 'all 0.2s'
                }}
            >
                Mi Perfil
            </button>
        </div>

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
             <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 12, overflow: 'hidden' }}>
             {loadingOrders ? (
               <div style={{ padding: '60px 20px', textAlign: 'center', color: css.textMuted, fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                 <CircularProgress size={24} sx={{ color: css.textMuted }} />
                 <span>Cargando pedidos...</span>
               </div>
             ) : orders.length === 0 ? (
               <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                 <div style={{ width: 56, height: 56, borderRadius: '50%', background: css.bgSubtle, border: `1px solid ${css.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: css.textFaint }}>
                   <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="2" /><path d="M5 7h6M5 10h4" /></svg>
                 </div>
                 <div style={{ fontSize: 16, fontWeight: 600, color: css.text, marginBottom: 8 }}>No hay pedidos recientes</div>
                 <div style={{ fontSize: 14, color: css.textFaint, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>Cuando realices tu primera compra en la tienda, aparecerá aquí.</div>
                 <RouterLink to="/store" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 8, background: css.accent, color: css.accentFg, textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'opacity 0.2s' }}>Explorar tienda</RouterLink>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 {orders.map((order, idx) => (
                   <div key={order.sale_id} style={{ 
                       padding: '20px 24px', 
                       borderBottom: idx < orders.length - 1 ? `1px solid ${css.border}` : 'none', 
                       display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                       gap: 16, flexWrap: 'wrap',
                       transition: 'background 0.2s',
                   }}>
                     <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                           <div style={{ fontSize: 15, fontWeight: 700, color: css.text }}>Pedido #{order.sale_id}</div>
                           <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: statusBg(order.status), color: statusColor(order.status) }}>
                             {order.status_detail.label}
                           </span>
                       </div>
                       <div style={{ fontSize: 13, color: css.textMuted }}>Total pagado: <span style={{ fontWeight: 600, color: css.text }}>{currencyFormatter.format(Number(order.total || '0'))}</span></div>
                     </div>
                     <div>
                       <RouterLink to={`/store/order-status?sale_id=${order.sale_id}`} style={{
                         display: 'inline-flex', alignItems: 'center', gap: 6,
                         fontSize: 13, padding: '8px 16px', borderRadius: 8, border: `1px solid ${css.border}`,
                         color: css.text, background: css.bgCard, textDecoration: 'none', fontWeight: 600,
                         transition: 'border-color 0.2s'
                       }}>Ver recibo</RouterLink>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        )}

        {/* Tab Content: Profile */}
        {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                
                {/* Personal Info Form */}
                <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${css.border}` }}>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: css.text }}>Información Personal</h2>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: css.textMuted }}>Actualiza tu nombre y correo electrónico.</p>
                    </div>
                    <form onSubmit={handleUpdateProfile} style={{ padding: '24px' }}>
                         <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: css.text, marginBottom: 6 }}>Nombre</label>
                                <input 
                                    type="text" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${css.borderStrong}`, background: css.inputBg, color: css.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: css.text, marginBottom: 6 }}>Apellido</label>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${css.borderStrong}`, background: css.inputBg, color: css.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: css.text, marginBottom: 6 }}>Correo Electrónico</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${css.borderStrong}`, background: css.inputBg, color: css.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="submit" 
                                disabled={loadingProfile}
                                style={{ 
                                    padding: '10px 24px', borderRadius: 8, background: css.text, color: css.bg, 
                                    border: 'none', fontSize: 14, fontWeight: 600, cursor: loadingProfile ? 'default' : 'pointer',
                                    opacity: loadingProfile ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8
                                }}
                            >
                                {loadingProfile && <CircularProgress size={16} sx={{ color: css.bg }} />}
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Form */}
                <div style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${css.border}` }}>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: css.text }}>Cambiar Contraseña</h2>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: css.textMuted }}>Asegura tu cuenta usando una contraseña larga y difícil de adivinar.</p>
                    </div>
                    <form onSubmit={handleChangePassword} style={{ padding: '24px' }}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: css.text, marginBottom: 6 }}>Contraseña Actual</label>
                            <input 
                                type="password" 
                                value={oldPassword} 
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${css.borderStrong}`, background: css.inputBg, color: css.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: css.text, marginBottom: 6 }}>Nueva Contraseña</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${css.borderStrong}`, background: css.inputBg, color: css.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                            />
                            <p style={{ margin: '6px 0 0', fontSize: 12, color: css.textFaint }}>Mínimo 8 caracteres.</p>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: css.text, marginBottom: 6 }}>Confirmar Nueva Contraseña</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${css.borderStrong}`, background: css.inputBg, color: css.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="submit" 
                                disabled={loadingPassword || !oldPassword || !newPassword || !confirmPassword}
                                style={{ 
                                    padding: '10px 24px', borderRadius: 8, background: css.text, color: css.bg, 
                                    border: 'none', fontSize: 14, fontWeight: 600, 
                                    cursor: (loadingPassword || !oldPassword || !newPassword || !confirmPassword) ? 'default' : 'pointer',
                                    opacity: (loadingPassword || !oldPassword || !newPassword || !confirmPassword) ? 0.7 : 1, 
                                    display: 'flex', alignItems: 'center', gap: 8
                                }}
                            >
                                {loadingPassword && <CircularProgress size={16} sx={{ color: css.bg }} />}
                                Actualizar Contraseña
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        )}

      </div>
      <StoreFooter />
    </div>
  )
}
