import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import type { StoreBranding } from '../../types/store'
import { getStoreCartItemsCount } from '../../utils/storeCart'
import { getWishlistCount } from '../../utils/wishlistUtils'

interface StoreHeaderProps {
  branding?: StoreBranding
  showCart?: boolean
  backLink?: { to: string; label: string }
}

export default function StoreHeader({ branding: initialBranding, showCart = true, backLink }: StoreHeaderProps) {
  const { mode, toggleColorMode } = useThemeMode()
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [branding, setBranding] = useState<StoreBranding | null>(initialBranding || null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loadingBranding, setLoadingBranding] = useState(!initialBranding)

  useEffect(() => {
    if (!initialBranding) {
      setLoadingBranding(true)
      void storeService.getBranding().then(resp => {
        setBranding(resp.branding)
        setLoadingBranding(false)
      }).catch(() => {
        setLoadingBranding(false)
      })
    } else {
      setBranding(initialBranding)
      setLoadingBranding(false)
    }
  }, [initialBranding])

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getStoreCartItemsCount())
      setWishlistCount(getWishlistCount())
    }

    updateCounts()
    
    // Listen for custom events
    window.addEventListener('wishlist-updated', updateCounts)
    window.addEventListener('storage', updateCounts) // For cross-tab sync
    
    // Simple interval as fallback
    const interval = setInterval(updateCounts, 2000)
    
    return () => {
      window.removeEventListener('wishlist-updated', updateCounts)
      window.removeEventListener('storage', updateCounts)
      clearInterval(interval)
    }
  }, [])

  const isDark = mode === 'dark'
  const css = isDark ? {
    bg: '#0f0f0f', border: '#2a2a2a', text: '#f5f5f5', textMuted: '#a0a0a0',
    textFaint: '#555555', accent: '#f5f5f5', accentFg: '#111111', bgSubtle: '#1a1a1a',
  } : {
    bg: '#ffffff', border: '#e5e5e5', text: '#111111', textMuted: '#6b6b6b',
    textFaint: '#a8a8a8', accent: '#111111', accentFg: '#ffffff', bgSubtle: '#f5f5f5',
  }

  const storeName = branding?.store_name || (loadingBranding ? 'Golos Store' : 'Golos Store')
  const logoLetter = storeName.trim().charAt(0).toUpperCase()

  const groupNames = (Array.isArray((user as any)?.groups) ? (user as any).groups : [])
    .map((group: any) => (typeof group === 'string' ? group : group?.name || ''))
    .filter(Boolean)

  const canAccessManagement = Boolean(
    user && (user.is_staff || user.is_superuser ||
      groupNames.some((name: string) => ['Managers', 'Sales', 'Inventory'].includes(name))),
  )

  const isMainStorePage = location.pathname === '/store'

  const scrollToSection = (id: string) => {
    if (isMainStorePage) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If we are not on main page, we just go there with hash
      // But standard RouterLink with '#' might work better
    }
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <>
      {branding?.promo_top_enabled && (
        <div style={{
          height: 32, background: css.accent, color: css.accentFg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
          padding: '0 16px', textAlign: 'center'
        }}>
          {branding.promo_top_text || 'Envío gratis en Colombia por compras superiores a $200.000'}
        </div>
      )}
      <nav className="store-nav" style={{
      position: 'sticky', top: 0, zIndex: 1210, height: 60,
      background: css.bg, borderBottom: `1px solid ${css.border}`,
      display: 'flex', alignItems: 'center', padding: '0 32px', gap: 32,
    }}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RouterLink to="/store" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: css.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: css.bg, fontSize: 12, fontWeight: 700, flexShrink: 0,
            overflow: 'hidden'
          }}>
            {branding?.logo_url
              ? <img src={branding.logo_url} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : logoLetter}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: css.text, letterSpacing: '-0.3px', lineHeight: 1 }}>
              {storeName}
            </div>
            {branding?.tagline && (
              <div className="store-tagline" style={{ fontSize: 10, color: css.textFaint, marginTop: 2, fontWeight: 400 }}>
                {branding.tagline}
              </div>
            )}
          </div>
        </RouterLink>
      </motion.div>

      {/* Dynamic section (links or back button) - Hidden on mobile, moved to profile menu */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {!backLink ? (
          <>
            {[
              { label: 'Destacados', action: () => scrollToSection('store-featured'), to: '/store#store-featured' },
              { label: 'Catálogo', action: () => scrollToSection('store-catalog'), to: '/store#store-catalog' },
            ].map((link) => (
              isMainStorePage ? (
                <motion.button 
                  key={link.label} 
                  onClick={link.action} 
                  whileHover={{ backgroundColor: css.bgSubtle, color: css.text }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                    color: css.textMuted, cursor: 'pointer', background: 'none', border: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {link.label}
                </motion.button>
              ) : (
                <motion.div key={link.label} whileHover={{ backgroundColor: css.bgSubtle }} whileTap={{ scale: 0.97 }} style={{ borderRadius: 6 }}>
                  <RouterLink 
                    to={link.to} 
                    style={{
                      display: 'block', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                      color: css.textMuted, cursor: 'pointer', textDecoration: 'none',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = css.text }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = css.textMuted }}
                  >
                    {link.label}
                  </RouterLink>
                </motion.div>
              )
            ))}
          </>
        ) : (
          <RouterLink to={backLink.to} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: css.textMuted, textDecoration: 'none', padding: '6px 12px', borderRadius: 6 }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = css.bgSubtle; (e.target as HTMLElement).style.color = css.text }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'none'; (e.target as HTMLElement).style.color = css.textMuted }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3L5 8l5 5" /></svg>
            <span className="hide-mobile">{backLink.label}</span>
          </RouterLink>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <RouterLink
            to="/store/wishlist"
            title="Mi Wishlist"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 6,
              background: 'transparent',
              color: css.textMuted, border: `1px solid ${css.border}`,
              textDecoration: 'none', position: 'relative'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlistCount > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" style={{ color: wishlistCount > 0 ? '#ef4444' : 'inherit' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.div
                  key="wishlist-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    position: 'absolute', top: -5, right: -5,
                    background: '#ef4444', color: '#fff', width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700,
                    border: `1.5px solid ${css.bg}`
                  }}
                >
                  {wishlistCount}
                </motion.div>
              )}
            </AnimatePresence>
          </RouterLink>
        </motion.div>

        {showCart && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <RouterLink
              to="/store/cart"
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 6,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', background: css.accent,
                color: css.accentFg, border: 'none', textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2h2l2 7h6l2-5H5" /><circle cx="7" cy="13" r="1" /><circle cx="11" cy="13" r="1" />
              </svg>
              <span className="cart-label">Carrito</span>
              <AnimatePresence mode="popLayout">
                {cartCount > 0 && (
                  <motion.div 
                    key="cart-badge"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    style={{
                      background: css.accentFg, color: css.accent, width: 18, height: 18, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
                    }}>{cartCount}</motion.div>
                )}
              </AnimatePresence>
            </RouterLink>
          </motion.div>
        )}

        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleMenu}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: css.bgSubtle,
                border: `1px solid ${css.border}`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', padding: 0
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: css.text }}>
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
              </div>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 1205 }} 
                  />
                  <motion.div 
                    className="profile-dropdown" 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 180,
                      background: css.bg, border: `1px solid ${css.border}`, borderRadius: 10,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.12)', zIndex: 1210, overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${css.border}` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: css.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
                      </div>
                      <div style={{ fontSize: 11, color: css.textFaint }}>Cliente</div>
                    </div>
                    
                    <div style={{ padding: 4 }}>
                      <RouterLink to="/store/account" onClick={() => setMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6,
                        fontSize: 13, color: css.textMuted, textDecoration: 'none', transition: 'background 0.1s'
                      }} 
                        onMouseEnter={(e) => e.currentTarget.style.background = css.bgSubtle}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Mi cuenta
                      </RouterLink>
                      
                      <RouterLink to="/store/order-status" onClick={() => setMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6,
                        fontSize: 13, color: css.textMuted, textDecoration: 'none', transition: 'background 0.1s'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = css.bgSubtle}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="2" ry="2"></rect></svg>
                        Estado pedido
                      </RouterLink>

                      {canAccessManagement && (
                        <RouterLink to="/dashboard" onClick={() => setMenuOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6,
                          fontSize: 13, color: css.textMuted, textDecoration: 'none', transition: 'background 0.1s'
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = css.bgSubtle}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                          Gestión
                        </RouterLink>
                      )}

                      <div style={{ height: 1, background: css.border, margin: '4px 8px' }} />

                      <button onClick={logout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6,
                        fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = css.bgSubtle}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <RouterLink to="/store/login" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6,
            fontSize: 13, fontWeight: 500, border: `1px solid ${css.border}`, background: css.bg,
            color: css.textMuted, textDecoration: 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            <span className="hide-mobile">Ingresar</span>
          </RouterLink>
        )}

        <button onClick={toggleColorMode} style={{
          width: 36, height: 36, borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          fontSize: 15, color: css.textMuted,
        }}>{isDark ? '☽' : '☀'}</button>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 640px) {
          .store-nav { padding: 0 16px !important; gap: 8px !important; }
          .cart-label, .hide-mobile, .store-tagline { display: none !important; }
          .nav-actions { gap: 4px !important; }
        }
      `}</style>
    </nav>
    </>
  )
}
