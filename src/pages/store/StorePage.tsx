import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Badge, Dialog, Fab, Skeleton, Snackbar, Zoom } from '@mui/material'
import { motion } from 'framer-motion'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { storeService } from '../../services/storeService'
import type { StoreBranding, StoreProduct, StoreVariant } from '../../types/store'
import StoreFooter from '../../components/store/StoreFooter'
import StoreHeader from '../../components/store/StoreHeader'
import { addItemToStoreCart, getStoreCartItems, getStoreCartItemsCount } from '../../utils/storeCart'
import { toggleWishlistItem, isInWishlist } from '../../utils/wishlistUtils'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'

type OrderingValue = 'name' | '-name' | 'brand' | '-brand' | 'newest' | 'oldest'

type ToastState = {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info'
}

const PAGE_SIZE = 12
const ORDERING_VALUES: OrderingValue[] = ['name', '-name', 'brand', '-brand', 'newest', 'oldest']
const ORDERING_LABEL: Record<OrderingValue, string> = {
  name: 'Nombre A-Z',
  '-name': 'Nombre Z-A',
  brand: 'Marca A-Z',
  '-brand': 'Marca Z-A',
  newest: 'Mas recientes',
  oldest: 'Mas antiguos',
}

const DEFAULT_BRANDING: StoreBranding = {
  store_name: 'Golos Store',
  tagline: 'Calzado y estilo para cada paso',
  logo_url: null,
  favicon_url: '',
  hero_title: 'Descubre tu siguiente par favorito',
  hero_subtitle: 'Compra fácil, segura y con envío rápido en Colombia. Los mejores sneakers al mejor precio.',
  hero_image_url: '',
  legal_representative_name: '',
  legal_id_type: 'NIT',
  legal_id_number: '',
  legal_contact_email: '',
  legal_contact_phone: '',
  legal_contact_address: '',
  legal_contact_city: '',
  legal_contact_department: '',
  promo_top_enabled: false,
  promo_top_title: '',
  promo_top_text: 'Envío gratis en Colombia por compras superiores a $200.000',
  promo_top_image_desktop_url: '',
  promo_top_image_mobile_url: '',
  promo_bottom_enabled: false,
  promo_bottom_title: '',
  promo_bottom_text: '',
  maintenance_mode: false,
  maintenance_message: '',
}

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'>
    <rect width='640' height='360' fill='#f5f5f5'/>
    <g fill='#c8c8c8'>
      <path d='M160 220 Q200 160 320 155 Q390 154 420 175 L435 205 Q380 198 300 215 Q220 232 160 220Z'/>
      <path d='M160 220 L435 215 L435 228 Q380 240 290 242 Q200 244 160 235Z'/>
    </g>
  </svg>
`)}`

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})
const WHATSAPP_NUMBER = (import.meta.env.VITE_STORE_WHATSAPP_NUMBER || '573189374198').toString().trim()
const WHATSAPP_MESSAGE = (import.meta.env.VITE_STORE_WHATSAPP_MESSAGE || 'Hola, quiero ayuda con una compra en Golos Store.').toString().trim()

const getDefaultVariantId = (product: StoreProduct): number | undefined => {
  const inStock = product.variants.find((variant) => variant.stock > 0)
  return inStock?.id || product.variants[0]?.id
}

const formatVariantLabel = (variant: StoreVariant): string => {
  const base = `${variant.size} / ${variant.color}`
  return variant.stock > 0 ? base : `${base} - Agotado`
}

export default function StorePage() {
  const { mode } = useThemeMode()
  const navigate = useNavigate()

  const [branding, setBranding] = useState<StoreBranding>(DEFAULT_BRANDING)
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<StoreProduct[]>([])

  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('')
  const [ordering, setOrdering] = useState<OrderingValue>('name')

  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [loadingFeatured, setLoadingFeatured] = useState(false)


  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)

  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({})
  const [selectedQuantities, setSelectedQuantities] = useState<Record<number, number>>({})

  const [showBackToTop, setShowBackToTop] = useState(false)
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'info' })
  const [imageViewer, setImageViewer] = useState<{ open: boolean; url: string; name: string }>({ open: false, url: '', name: '' })
  const [wishlistVersion, setWishlistVersion] = useState(0)

  const cartFabRef = useRef<HTMLAnchorElement | null>(null)
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)), [totalCount])



  const showToast = (message: string, severity: ToastState['severity'] = 'info') => {
    setToast({ open: true, message, severity })
  }

  const refreshCartPreview = async () => {
    const items = getStoreCartItems()
    setCartCount(getStoreCartItemsCount())
    if (items.length === 0) return
    try { await storeService.validateCart(items) } catch { /* ignore */ }
  }

  const ensureProductDefaults = (list: StoreProduct[]) => {
    if (list.length === 0) return
    setSelectedVariants((prev) => {
      const next = { ...prev }
      for (const product of list) {
        const defaultVariantId = getDefaultVariantId(product)
        if (!next[product.id] && defaultVariantId) next[product.id] = defaultVariantId
      }
      return next
    })
    setSelectedQuantities((prev) => {
      const next = { ...prev }
      for (const product of list) {
        if (!next[product.id]) next[product.id] = 1
      }
      return next
    })
  }

  const getSelectedVariant = (product: StoreProduct): StoreVariant | undefined =>
    product.variants.find((v) => v.id === selectedVariants[product.id]) || product.variants[0]

  const getDisplayImageForProduct = (product: StoreProduct, selectedVariantId?: number): string => {
    const variantImage = selectedVariantId
      ? product.images.find((img) => img.variant_id === selectedVariantId && Boolean(img.url))
      : undefined
    const productPrimaryImage = product.images.find((img) => img.variant_id === null && img.is_primary && Boolean(img.url))
    const anyProductImage = product.images.find((img) => Boolean(img.url))
    return variantImage?.url || productPrimaryImage?.url || anyProductImage?.url || product.image_url || FALLBACK_IMAGE
  }

  const getSelectedQuantity = (productId: number): number => Math.max(1, selectedQuantities[productId] || 1)
  const canAddSelectedVariant = (product: StoreProduct): boolean => {
    const variant = getSelectedVariant(product)
    return Boolean(variant && variant.stock > 0)
  }

  const loadBranding = async () => {
    try {
      const response = await storeService.getBranding()
      setBranding({ ...DEFAULT_BRANDING, ...response.branding })
    } catch { setBranding(DEFAULT_BRANDING) }
  }

  const loadFeatured = async () => {
    try {
      setLoadingFeatured(true)
      const response = await storeService.getFeaturedProducts(6)
      setFeaturedProducts(response.products)
      ensureProductDefaults(response.products)
    } catch { setFeaturedProducts([]) }
    finally { setLoadingFeatured(false) }
  }

  const loadProducts = async (overrides?: Partial<{ page: number; q: string; brand: string; ordering: OrderingValue }>) => {
    const requestPage = overrides?.page ?? page
    const requestSearch = overrides?.q ?? search
    const requestBrand = overrides?.brand ?? brand
    const requestOrdering = overrides?.ordering ?? ordering
    try {
      setLoadingCatalog(true)
      setCatalogError(null)
      const response = await storeService.getProducts({
        page: requestPage, page_size: PAGE_SIZE,
        q: requestSearch || undefined,
        brand: requestBrand || undefined,
        ordering: requestOrdering,
      })
      setProducts(response.products)
      setTotalCount(response.count)
      ensureProductDefaults(response.products)
    } catch {
      setCatalogError('No se pudo cargar el catalogo.')
      showToast('No se pudo cargar el catalogo.', 'error')
    } finally { setLoadingCatalog(false) }
  }

  useEffect(() => { void refreshCartPreview(); void loadBranding(); void loadFeatured() }, [])
  useEffect(() => { void loadProducts() }, [page, ordering])
  useEffect(() => {
    const onUpdate = () => setWishlistVersion(v => v + 1)
    window.addEventListener('wishlist-updated', onUpdate)
    const onScroll = () => setShowBackToTop(window.scrollY > 280)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('wishlist-updated', onUpdate)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleApplyFilters = () => {
    setPage(1)
    void loadProducts({ page: 1, q: search, brand, ordering })
  }

  const handleClearFilters = () => {
    setSearch(''); setBrand(''); setOrdering('name'); setPage(1)
    void loadProducts({ page: 1, q: '', brand: '', ordering: 'name' })
  }

  const handleVariantChange = (productId: number, variantId: number) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }))
    setSelectedQuantities((prev) => ({ ...prev, [productId]: 1 }))
  }

  const handleQuantityChange = (product: StoreProduct, nextQuantity: number) => {
    const variant = getSelectedVariant(product)
    const maxStock = variant?.stock ?? 1
    const sanitized = Math.min(Math.max(1, nextQuantity), Math.max(1, maxStock))
    setSelectedQuantities((prev) => ({ ...prev, [product.id]: sanitized }))
  }

  const handleAddToCart = async (product: StoreProduct) => {
    const variant = getSelectedVariant(product)
    const quantity = getSelectedQuantity(product.id)
    if (!variant || variant.stock <= 0) { showToast('La variante seleccionada no tiene stock disponible.', 'error'); return }
    addItemToStoreCart(variant.id, quantity)
    await refreshCartPreview()
    showToast(`${product.name} (${variant.size}/${variant.color}) x${quantity} agregado al carrito.`, 'success')
  }

  const handleToggleWishlist = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation()
    toggleWishlistItem(productId)
    setWishlistVersion(v => v + 1)
  }

  // ─── CSS Variables ────────────────────────────────────────────────────────────
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

  return (
    <div key={wishlistVersion} style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: css.bg, color: css.text, fontSize: 14, lineHeight: 1.5, minHeight: '100vh' }}>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <StoreHeader branding={branding} />

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────────── */}
      <div className="store-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {/* ── HERO ──────────────────────────────────────────────────────────────── */}
        <div className="hero-container" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
          marginBottom: 40, padding: '32px 40px',
          background: css.bgSubtle, borderRadius: 16, border: `1px solid ${css.border}`,
          overflow: 'hidden', position: 'relative',
        }}>
          <div className="hero-content">
            <motion.div 
              className="hero-eyebrow" 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: css.textFaint, marginBottom: 12 }}>
              Nueva colección · 2026
            </motion.div>
            <motion.h1 
              className="hero-title" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', color: css.text, marginBottom: 16, margin: '0 0 16px' }}>
              {branding.hero_title || DEFAULT_BRANDING.hero_title}
            </motion.h1>
            <motion.p 
              className="hero-subtitle" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontSize: 15, color: css.textMuted, lineHeight: 1.6, marginBottom: 28, maxWidth: 380, margin: '0 0 28px' }}>
              {branding.hero_subtitle || DEFAULT_BRANDING.hero_subtitle}
            </motion.p>
            <motion.div 
              className="hero-stats" 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: 'flex', gap: 28, marginBottom: 28 }}>
              {[
                { val: totalCount > 0 ? `${totalCount}+` : '–', label: 'Productos' },
                { val: '48h', label: 'Envío estándar' },
                { val: '100%', label: 'Pago seguro' },
              ].map((stat) => (
                <div key={stat.label} className="stat-item">
                  <div className="stat-val" style={{ fontSize: 20, fontWeight: 700, color: css.text, letterSpacing: '-0.5px' }}>{stat.val}</div>
                  <div className="stat-label" style={{ fontSize: 11, color: css.textFaint, marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
            <motion.div 
              className="hero-actions" 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ display: 'flex', gap: 10 }}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('store-catalog')?.scrollIntoView({ behavior: 'smooth' })} style={{
                padding: '12px 24px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                background: css.accent, color: css.accentFg, border: 'none', fontFamily: 'inherit', flex: 1,
              }}>Ver catálogo</motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: css.bgHover }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('store-featured')?.scrollIntoView({ behavior: 'smooth' })} style={{
                padding: '12px 24px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                background: 'transparent', color: css.text, border: `1px solid ${css.borderStrong}`, fontFamily: 'inherit', flex: 1,
              }}>Ver destacados</motion.button>
            </motion.div>
          </div>
          <motion.div 
            className="hero-image-wrapper" 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220 }}>
            {branding.hero_image_url ? (
              <img
                src={branding.hero_image_url}
                alt="Hero visual"
                style={{
                  width: '100%', height: 220,
                  objectFit: 'cover',
                  borderRadius: 16,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                }}
              />
            ) : (
              <div style={{
                width: 280, height: 200, background: css.bg, borderRadius: 16,
                border: `1px solid ${css.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25">
                  <path d="M10 55 Q20 30 50 28 Q65 27 70 35 L72 45 Q60 42 45 48 Q30 54 10 55Z" />
                  <path d="M10 55 L72 52 L72 58 Q60 62 40 63 Q20 64 10 60Z" />
                </svg>
              </div>
            )}
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .store-container { padding: 24px 16px !important; }
            .hero-container { 
              grid-template-columns: 1fr !important; 
              padding: 32px 24px !important;
              gap: 32px !important;
              text-align: center;
            }
            .hero-title { font-size: 32px !important; }
            .hero-subtitle { max-width: 100% !important; margin: 0 auto 24px !important; }
            .hero-stats { justify-content: center; gap: 20px !important; }
            .hero-actions { flex-direction: column; }
            .hero-image-wrapper { height: 200px !important; order: -1; }
            .hero-image-wrapper img { height: 200px !important; }
          }
        `}</style>

        {/* PROMO TOP REMOVED FOR CLEANER LOOK */}

        {/* ── FEATURED CHIPS ────────────────────────────────────────────────────── */}
        <div id="store-featured" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: css.text, letterSpacing: '-0.3px' }}>Destacados</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {loadingFeatured
            ? [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" width={120} height={32} />)
            : featuredProducts.map((product, idx) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: css.bgHover }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearch(product.name); setBrand(product.brand); setPage(1)
                  void loadProducts({ page: 1, q: product.name, brand: product.brand, ordering })
                  document.getElementById('store-catalog')?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20,
                  border: `1px solid ${css.border}`, background: css.bgCard, fontSize: 12, fontWeight: 500,
                  color: css.textMuted, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 2h2l2 7h6l2-5H5" /><circle cx="7" cy="13" r="1" /><circle cx="11" cy="13" r="1" />
                </svg>
                {product.name}
              </motion.button>
            ))}
        </div>

        {/* ── FILTER BAR ────────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
          padding: '14px 16px', background: css.bgSubtle, borderRadius: 10, border: `1px solid ${css.border}`,
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: css.bg, border: `1px solid ${css.border}`, borderRadius: 6, padding: '8px 12px', minWidth: 180 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={css.textFaint} strokeWidth="1.8" style={{ flexShrink: 0 }}>
              <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" />
            </svg>
            <input
              type="text" placeholder="Buscar por nombre o marca..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              style={{ border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 13, color: css.text, outline: 'none', flex: 1, minWidth: 0 }}
            />
          </div>
          <input
            type="text" placeholder="Filtrar por marca" value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg, fontSize: 13, fontFamily: 'inherit', color: css.textMuted, outline: 'none', width: 150 }}
          />
          <select
            value={ordering} onChange={(e) => setOrdering(e.target.value as OrderingValue)}
            style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg, fontSize: 13, fontFamily: 'inherit', color: css.textMuted, outline: 'none', cursor: 'pointer' }}
          >
            {ORDERING_VALUES.map((v) => <option key={v} value={v}>{ORDERING_LABEL[v]}</option>)}
          </select>
          <button onClick={handleApplyFilters} style={{
            padding: '8px 18px', borderRadius: 6, background: css.accent, color: css.accentFg,
            border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Aplicar</button>
          <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', fontSize: 13, color: css.textFaint, cursor: 'pointer', fontFamily: 'inherit' }}>Limpiar</button>
        </div>

        {/* ── CATALOG ───────────────────────────────────────────────────────────── */}
        <div id="store-catalog">
          {catalogError && (
            <Alert severity="error" onClose={() => setCatalogError(null)} sx={{ mb: 2 }}>{catalogError}</Alert>
          )}

          <div style={{ fontSize: 13, fontWeight: 500, color: css.textFaint, marginBottom: 16 }}>
            Catálogo · {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {loadingCatalog
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" height={240} />
                  <div style={{ padding: '14px 16px' }}>
                    <Skeleton variant="text" width="40%" height={14} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="70%" height={18} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="35%" height={22} />
                  </div>
                </div>
              ))
              : products.map((product, index) => {
                const selectedVariant = getSelectedVariant(product)
                const canAdd = canAddSelectedVariant(product)
                const quantity = getSelectedQuantity(product.id)
                const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= Math.max(1, Number(selectedVariant.stock_minimum || 1))
                const imgUrl = getDisplayImageForProduct(product, selectedVariant?.id)

                return (
                  <motion.div 
                    key={product.id} 
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: (index % 4) * 0.1, // Small stagger based on row position
                      ease: [0.21, 0.47, 0.32, 0.98] 
                    }}
                    style={{
                      background: css.bgCard, border: `1px solid ${css.border}`, borderRadius: 16,
                      overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
                    }}
                    whileHover={{ 
                      y: -2,
                      borderColor: css.borderStrong
                    }}
                    onClick={() => navigate(`/store/product/${product.id}`)}
                  >
                    {/* Image */}
                    <div style={{ aspectRatio: '1', background: css.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <motion.img
                        src={imgUrl} alt={product.name} loading="lazy"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { if ((e.target as HTMLImageElement).src !== FALLBACK_IMAGE) (e.target as HTMLImageElement).src = FALLBACK_IMAGE }}
                      />
                      
                      <div className="card-actions" style={{
                        position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2
                      }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleToggleWishlist(e, product.id)}
                          style={{
                            width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
                            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            color: isInWishlist(product.id) ? '#ef4444' : css.textMuted
                          }}
                        >
                          {isInWishlist(product.id) ? <FavoriteRoundedIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />}
                        </motion.button>
                      </div>
                      {isLowStock && (
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          style={{
                            position: 'absolute', top: 10, left: 10, padding: '3px 8px', borderRadius: 4,
                            fontSize: 10, fontWeight: 600, background: '#fffbeb', color: '#b45309',
                            zIndex: 1
                          }}>⚡ Últimas unidades</motion.div>
                      )}
                      {selectedVariant && selectedVariant.stock <= 0 && (
                        <div style={{
                          position: 'absolute', top: 10, left: 10, padding: '3px 8px', borderRadius: 4,
                          fontSize: 10, fontWeight: 600, background: '#fef2f2', color: '#b91c1c',
                          zIndex: 1
                        }}>Agotado</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: css.textFaint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{product.brand}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: css.text, letterSpacing: '-0.2px', marginBottom: 8 }}>{product.name}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: css.text, letterSpacing: '-0.3px', marginBottom: 10 }}>
                        {selectedVariant ? currencyFormatter.format(Number(selectedVariant.price)) : 'Consultar precio'}
                      </div>

                      {/* Variant chips */}
                      {product.variants.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                          {product.variants.map((v) => (
                            <motion.button 
                              key={v.id} 
                              whileHover={v.stock > 0 ? { scale: 1.05 } : {}}
                              whileTap={v.stock > 0 ? { scale: 0.95 } : {}}
                              onClick={() => handleVariantChange(product.id, v.id)} style={{
                              padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                              background: selectedVariant?.id === v.id ? css.accent : css.bgSubtle,
                              color: selectedVariant?.id === v.id ? css.accentFg : css.textMuted,
                              border: `1px solid ${selectedVariant?.id === v.id ? css.accent : css.border}`,
                              opacity: v.stock <= 0 ? 0.45 : 1,
                            }}>{formatVariantLabel(v)}</motion.button>
                          ))}
                        </div>
                      )}

                      {selectedVariant && (
                        <div style={{ fontSize: 11, color: selectedVariant.stock > 0 ? css.textFaint : '#b91c1c', marginBottom: 12 }}>
                          Stock: {selectedVariant.stock} {selectedVariant.stock <= 0 ? '(Agotado)' : 'unidades'}
                        </div>
                      )}

                      {/* Qty + Add */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${css.border}`, borderRadius: 6, overflow: 'hidden' }}>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(product, quantity - 1)} disabled={!canAdd || quantity <= 1} style={{
                            width: 30, height: 32, border: 'none', background: css.bgSubtle, color: css.textMuted,
                            fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                          }}>−</motion.button>
                          <div style={{ width: 32, textAlign: 'center', fontSize: 13, fontWeight: 500, color: css.text, background: css.bg, borderLeft: `1px solid ${css.border}`, borderRight: `1px solid ${css.border}`, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{quantity}</div>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(product, quantity + 1)} disabled={!canAdd || quantity >= (selectedVariant?.stock || 1)} style={{
                            width: 30, height: 32, border: 'none', background: css.bgSubtle, color: css.textMuted,
                            fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                          }}>+</motion.button>
                        </div>
                        <motion.button
                          disabled={!canAdd}
                          whileHover={canAdd ? { scale: 1.02, backgroundColor: css.textMuted } : {}}
                          whileTap={canAdd ? { scale: 0.98 } : {}}
                          onClick={() => { void handleAddToCart(product) }}
                          style={{
                            flex: 1, padding: '0 14px', height: 32, background: canAdd ? css.accent : css.textFaint,
                            color: css.accentFg, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                            cursor: canAdd ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 2h2l2 7h6l2-5H5" /><circle cx="7" cy="13" r="1" /><circle cx="11" cy="13" r="1" />
                          </svg>
                          {canAdd ? 'Agregar' : 'Agotado'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

          {/* ── PAGINATION ──────────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 40 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 36, height: 36, borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg, fontSize: 13, cursor: 'pointer', color: css.textMuted }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} style={{
                  width: 36, height: 36, borderRadius: 6, border: `1px solid ${p === page ? css.accent : css.border}`,
                  background: p === page ? css.accent : css.bg, fontSize: 13, cursor: 'pointer',
                  color: p === page ? css.accentFg : css.textMuted, fontWeight: p === page ? 600 : 400,
                }}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 36, height: 36, borderRadius: 6, border: `1px solid ${css.border}`, background: css.bg, fontSize: 13, cursor: 'pointer', color: css.textMuted }}>›</button>
            </div>
          )}
        </div>

        {/* PROMO BOTTOM REMOVED */}
      </div>

      <StoreFooter branding={branding} />

      {/* ── FLOATING ELEMENTS (preserved from original) ───────────────────────── */}
      <Zoom in={showBackToTop}>
        <Fab color="primary" size="medium" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1201 }} aria-label="Volver arriba">
          <KeyboardArrowUpRoundedIcon />
        </Fab>
      </Zoom>

      {WHATSAPP_NUMBER && (
        <Fab component="a" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank" rel="noopener noreferrer"
          sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: 1201, bgcolor: '#25D366', color: '#ffffff', '&:hover': { bgcolor: '#1ebe5d' } }}
          aria-label="Contactar por WhatsApp">
          <WhatsAppIcon />
        </Fab>
      )}

      <Zoom in={cartCount > 0} unmountOnExit>
        <Fab component={RouterLink} to="/store/cart" size="small"
          ref={(node: HTMLAnchorElement | null) => { cartFabRef.current = node }}
          sx={{
            display: { xs: 'flex', sm: 'none' },
            position: 'fixed', bottom: 92, right: 14, zIndex: 1202,
            bgcolor: 'primary.main', color: '#ffffff',
          }} aria-label="Abrir carrito">
          <Badge badgeContent={cartCount} color="error" max={99}>
            <LocalMallRoundedIcon />
          </Badge>
        </Fab>
      </Zoom>

      {/* FLY TO CART REMOVED */}

      <Snackbar open={toast.open} autoHideDuration={2600}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert severity={toast.severity} onClose={() => setToast((prev) => ({ ...prev, open: false }))} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Dialog open={imageViewer.open} onClose={() => setImageViewer({ open: false, url: '', name: '' })} maxWidth="md" fullWidth>
        <div style={{ padding: 12 }}>
          <img src={imageViewer.url || FALLBACK_IMAGE} alt={imageViewer.name} loading="eager"
            style={{ width: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: 8 }}
            onError={(e) => { if ((e.target as HTMLImageElement).src !== FALLBACK_IMAGE) (e.target as HTMLImageElement).src = FALLBACK_IMAGE }}
          />
          <div style={{ marginTop: 8, fontWeight: 600, fontSize: 14 }}>{imageViewer.name}</div>
        </div>
      </Dialog>
    </div>
  )
}
