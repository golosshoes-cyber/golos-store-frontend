import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  Fab,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Zoom,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import { Link as RouterLink } from 'react-router-dom'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import type { StoreBranding, StoreProduct, StoreVariant } from '../../types/store'
import { addItemToStoreCart, getStoreCartItems, getStoreCartItemsCount } from '../../utils/storeCart'

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
  tagline: 'Tu tienda online de confianza',
  logo_url: null,
  favicon_url: '',
  hero_title: 'Encuentra tu estilo ideal',
  hero_subtitle: 'Compra facil y segura desde cualquier dispositivo.',
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
  promo_top_text: '',
  promo_top_image_desktop_url: '',
  promo_top_image_mobile_url: '',
  promo_bottom_enabled: false,
  promo_bottom_title: '',
  promo_bottom_text: '',
}

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#e2e8f0'/>
        <stop offset='100%' stop-color='#cbd5e1'/>
      </linearGradient>
    </defs>
    <rect width='640' height='360' fill='url(#g)'/>
    <g fill='#64748b'>
      <circle cx='320' cy='150' r='36' opacity='0.5'/>
      <rect x='226' y='210' width='188' height='16' rx='8' opacity='0.6'/>
      <rect x='258' y='236' width='124' height='12' rx='6' opacity='0.4'/>
    </g>
  </svg>
`)}`

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})
const WHATSAPP_NUMBER = (import.meta.env.VITE_STORE_WHATSAPP_NUMBER || '').toString().trim()
const WHATSAPP_MESSAGE = (import.meta.env.VITE_STORE_WHATSAPP_MESSAGE || 'Hola, quiero ayuda con una compra en Golos Store.').toString().trim()

const getDefaultVariantId = (product: StoreProduct): number | undefined => {
  const inStock = product.variants.find((variant) => variant.stock > 0)
  return inStock?.id || product.variants[0]?.id
}

const formatVariantLabel = (variant: StoreVariant): string => {
  const base = `${variant.size} / ${variant.color}`
  return variant.stock > 0 ? base : `${base} - Agotado`
}

const scrollToSection = (id: string) => {
  const section = document.getElementById(id)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function StorePage() {
  const theme = useTheme()
  const { mode, toggleColorMode } = useThemeMode()
  const { user, isAuthenticated, logout } = useAuth()

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
  const [loadingBranding, setLoadingBranding] = useState(false)

  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [cartCount, setCartCount] = useState(0)

  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({})
  const [selectedQuantities, setSelectedQuantities] = useState<Record<number, number>>({})

  const [showBackToTop, setShowBackToTop] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [flyToCart, setFlyToCart] = useState<{
    id: number
    startX: number
    startY: number
    deltaX: number
    deltaY: number
    active: boolean
  } | null>(null)
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  })
  const [imageViewer, setImageViewer] = useState<{ open: boolean; url: string; name: string }>({
    open: false,
    url: '',
    name: '',
  })
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const cartFabRef = useRef<HTMLAnchorElement | null>(null)
  const headerCartRef = useRef<HTMLAnchorElement | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)), [totalCount])

  const groupNames = (Array.isArray((user as any)?.groups) ? (user as any).groups : [])
    .map((group: any) => (typeof group === 'string' ? group : group?.name || ''))
    .filter(Boolean)

  const canAccessManagement = Boolean(
    user && (
      user.is_staff ||
      user.is_superuser ||
      groupNames.some((name: string) => ['Managers', 'Sales', 'Inventory'].includes(name))
    ),
  )

  const showToast = (message: string, severity: ToastState['severity'] = 'info') => {
    setToast({ open: true, message, severity })
  }

  const refreshCartPreview = async () => {
    const items = getStoreCartItems()
    setCartCount(getStoreCartItemsCount())

    if (items.length === 0) {
      return
    }

    try {
      await storeService.validateCart(items)
    } catch {
      // Ignore cart preview errors in catalog page.
    }
  }

  const ensureProductDefaults = (list: StoreProduct[]) => {
    if (list.length === 0) return

    setSelectedVariants((previous) => {
      const next = { ...previous }
      for (const product of list) {
        const defaultVariantId = getDefaultVariantId(product)
        if (!next[product.id] && defaultVariantId) {
          next[product.id] = defaultVariantId
        }
      }
      return next
    })

    setSelectedQuantities((previous) => {
      const next = { ...previous }
      for (const product of list) {
        if (!next[product.id]) {
          next[product.id] = 1
        }
      }
      return next
    })
  }

  const getSelectedVariant = (product: StoreProduct): StoreVariant | undefined => {
    const selectedVariantId = selectedVariants[product.id]
    return product.variants.find((variant) => variant.id === selectedVariantId) || product.variants[0]
  }


  const getDisplayImageForProduct = (product: StoreProduct, selectedVariantId?: number): string => {
    const variantImage = selectedVariantId
      ? product.images.find((image) => image.variant_id === selectedVariantId && Boolean(image.url))
      : undefined

    const productPrimaryImage = product.images.find(
      (image) => image.variant_id === null && image.is_primary && Boolean(image.url),
    )

    const anyProductImage = product.images.find((image) => Boolean(image.url))

    return variantImage?.url || productPrimaryImage?.url || anyProductImage?.url || product.image_url || FALLBACK_IMAGE
  }
  const getSelectedQuantity = (productId: number): number => Math.max(1, selectedQuantities[productId] || 1)

  const canAddSelectedVariant = (product: StoreProduct): boolean => {
    const variant = getSelectedVariant(product)
    return Boolean(variant && variant.stock > 0)
  }

  const loadBranding = async () => {
    try {
      setLoadingBranding(true)
      const response = await storeService.getBranding()
      setBranding({ ...DEFAULT_BRANDING, ...response.branding })
    } catch {
      setBranding(DEFAULT_BRANDING)
    } finally {
      setLoadingBranding(false)
    }
  }

  const loadFeatured = async () => {
    try {
      setLoadingFeatured(true)
      const response = await storeService.getFeaturedProducts(6)
      setFeaturedProducts(response.products)
      ensureProductDefaults(response.products)
    } catch {
      setFeaturedProducts([])
    } finally {
      setLoadingFeatured(false)
    }
  }

  const loadProducts = async (
    overrides?: Partial<{ page: number; q: string; brand: string; ordering: OrderingValue }>,
  ) => {
    const requestPage = overrides?.page ?? page
    const requestSearch = overrides?.q ?? search
    const requestBrand = overrides?.brand ?? brand
    const requestOrdering = overrides?.ordering ?? ordering

    try {
      setLoadingCatalog(true)
      setCatalogError(null)
      const response = await storeService.getProducts({
        page: requestPage,
        page_size: PAGE_SIZE,
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
    } finally {
      setLoadingCatalog(false)
    }
  }

  useEffect(() => {
    void refreshCartPreview()
    void loadBranding()
    void loadFeatured()
  }, [])

  useEffect(() => {
    void loadProducts()
  }, [page, ordering])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setShowBackToTop(y > 280)
      setHeaderScrolled(y > 14)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleApplyFilters = () => {
    setPage(1)
    void loadProducts({ page: 1, q: search, brand, ordering })
    showToast('Filtros aplicados.', 'info')
  }

  const handleClearFilters = () => {
    setSearch('')
    setBrand('')
    setOrdering('name')
    setPage(1)
    void loadProducts({ page: 1, q: '', brand: '', ordering: 'name' })
    showToast('Filtros limpiados.', 'info')
  }

  const handleOrderingChange = (value: string) => {
    if (ORDERING_VALUES.includes(value as OrderingValue)) {
      setOrdering(value as OrderingValue)
    }
  }

  const handleVariantChange = (productId: number, variantId: number) => {
    setSelectedVariants((previous) => ({ ...previous, [productId]: variantId }))
    setSelectedQuantities((previous) => ({ ...previous, [productId]: 1 }))
  }

  const handleQuantityChange = (product: StoreProduct, nextQuantity: number) => {
    const variant = getSelectedVariant(product)
    const maxStock = variant?.stock ?? 1
    const sanitized = Math.min(Math.max(1, nextQuantity), Math.max(1, maxStock))
    setSelectedQuantities((previous) => ({ ...previous, [product.id]: sanitized }))
  }

  const triggerFlyToCart = (sourceElement?: HTMLElement | null) => {
    if (!sourceElement) return
    const targetElement = (cartFabRef.current || headerCartRef.current) as HTMLElement | null
    if (!targetElement) return

    const sourceRect = sourceElement.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()
    const startX = sourceRect.left + sourceRect.width / 2 - 18
    const startY = sourceRect.top + sourceRect.height / 2 - 18
    const endX = targetRect.left + targetRect.width / 2 - 18
    const endY = targetRect.top + targetRect.height / 2 - 18
    const id = Date.now()

    setFlyToCart({
      id,
      startX,
      startY,
      deltaX: endX - startX,
      deltaY: endY - startY,
      active: false,
    })

    requestAnimationFrame(() => {
      setFlyToCart((previous) => {
        if (!previous || previous.id !== id) return previous
        return { ...previous, active: true }
      })
    })

    window.setTimeout(() => {
      setFlyToCart((previous) => (previous && previous.id === id ? null : previous))
    }, 650)
  }

  const handleAddToCart = async (product: StoreProduct, sourceElement?: HTMLElement | null) => {
    const variant = getSelectedVariant(product)
    const quantity = getSelectedQuantity(product.id)

    if (!variant || variant.stock <= 0) {
      showToast('La variante seleccionada no tiene stock disponible.', 'error')
      return
    }

    triggerFlyToCart(sourceElement)
    addItemToStoreCart(variant.id, quantity)
    await refreshCartPreview()
    showToast(`${product.name} (${variant.size}/${variant.color}) x${quantity} agregado al carrito.`, 'success')
  }

  const renderVariantSelector = (product: StoreProduct) => {
    const selectedVariant = getSelectedVariant(product)
    if (product.variants.length === 0) {
      return <Typography variant="caption" color="text.secondary">Sin variantes disponibles</Typography>
    }

    return (
      <Stack spacing={1} sx={{ height: '100%' }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {product.variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id
            const isOutOfStock = variant.stock <= 0
            return (
              <Chip
                key={variant.id}
                label={formatVariantLabel(variant)}
                onClick={isOutOfStock ? undefined : () => handleVariantChange(product.id, variant.id)}
                color={isSelected ? 'primary' : isOutOfStock ? 'error' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                size="small"
                disabled={isOutOfStock}
              />
            )
          })}
        </Stack>
        {selectedVariant && (
          <Typography variant="caption" color={selectedVariant.stock > 0 ? 'text.secondary' : 'error.main'}>
            Stock: {selectedVariant.stock}
          </Typography>
        )}
      </Stack>
    )
  }

  const renderQuantityControl = (product: StoreProduct) => {
    const quantity = getSelectedQuantity(product.id)
    const maxStock = getSelectedVariant(product)?.stock || 1
    const disabled = !canAddSelectedVariant(product)

    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Button size="small" variant="outlined" disabled={disabled || quantity <= 1} onClick={() => handleQuantityChange(product, quantity - 1)}>-</Button>
        <Typography minWidth={24} textAlign="center" fontWeight={600}>{quantity}</Typography>
        <Button size="small" variant="outlined" disabled={disabled || quantity >= maxStock} onClick={() => handleQuantityChange(product, quantity + 1)}>+</Button>
      </Stack>
    )
  }

  const logoLetter = (branding.store_name || 'S').trim().charAt(0).toUpperCase()

  return (
      <Box
        sx={{
        minHeight: '100vh',
        background:
          mode === 'light'
            ? 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)'
            : 'linear-gradient(180deg, #0b1220 0%, #111827 100%)',
        pb: 12,
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes floatY': {
          from: { transform: 'translateY(0px)' },
          to: { transform: 'translateY(-10px)' },
        },
        '@keyframes pulseSoft': {
          '0%': { opacity: 0.22 },
          '50%': { opacity: 0.36 },
          '100%': { opacity: 0.22 },
        },
        '@keyframes cartPulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        '@keyframes imageFadeIn': {
          from: { opacity: 0.55, transform: 'scale(1.01)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      }}
    >
      <Box
          sx={{
            position: { xs: 'sticky', md: 'fixed' },
            top: 0,
            left: { md: 0 },
            right: { md: 0 },
            zIndex: 1200,
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
            backdropFilter: 'blur(12px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.92),
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, mode === 'dark' ? 0.28 : 0.08)}`,
            transform: headerScrolled ? 'translateY(2px)' : 'translateY(0px)',
            transition: 'transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease',
          }}
      >
        <Container maxWidth="lg" sx={{ py: headerScrolled ? 0.9 : 1.25, transition: 'padding 220ms ease' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.25}>
            <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
              <Avatar
                src={branding.logo_url || undefined}
                sx={{ width: 44, height: 44, bgcolor: 'primary.main', flexShrink: 0 }}
              >
                {branding.logo_url ? null : logoLetter}
              </Avatar>
              <Box minWidth={0}>
                <Typography variant="subtitle1" fontWeight={800} noWrap>
                  {loadingBranding ? 'Cargando...' : branding.store_name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {branding.tagline || DEFAULT_BRANDING.tagline}
                </Typography>
              </Box>
            </Stack>

	            <Stack
	              direction={{ xs: 'column', sm: 'row' }}
	              spacing={1}
	              alignItems={{ xs: 'stretch', sm: 'center' }}
	              sx={{ width: { xs: '100%', sm: 'auto' } }}
	            >
	              <Button
	                size="small"
	                startIcon={<AutoAwesomeRoundedIcon />}
	                variant="text"
	                onClick={() => scrollToSection('store-featured')}
	                sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}
	              >
	                Destacados
	              </Button>
	              <Button
	                size="small"
	                startIcon={<Inventory2RoundedIcon />}
	                variant="text"
	                onClick={() => scrollToSection('store-catalog')}
	                sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}
	              >
	                Catalogo
	              </Button>
	              <Button
	                size="small"
	                component={RouterLink}
	                to="/store/order-status"
	                variant="outlined"
	                sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}
	              >
	                Estado pedido
	              </Button>
	              <Button
	                ref={headerCartRef}
	                size="small"
	                component={RouterLink}
	                to="/store/cart"
                variant={cartCount > 0 ? 'contained' : 'outlined'}
                startIcon={<ShoppingBagRoundedIcon />}
                sx={{
                  fontWeight: 700,
                  minWidth: 122,
                  borderRadius: 999,
	                  animation: cartCount > 0 ? 'cartPulse 1.8s ease-in-out infinite' : 'none',
	                  boxShadow: cartCount > 0 ? `0 8px 18px ${alpha(theme.palette.primary.main, 0.32)}` : 'none',
	                  width: { xs: '100%', sm: 'auto' },
	                  justifyContent: { xs: 'flex-start', sm: 'center' },
	                }}
	              >
	                Carrito {cartCount > 0 ? `(${cartCount})` : ''}
	              </Button>
	              {!isAuthenticated && (
	                <>
	                  <Button size="small" component={RouterLink} to="/store/login" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}>Ingresar</Button>
	                  <Button size="small" component={RouterLink} to="/store/register" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}>Crear cuenta</Button>
	                </>
	              )}
	              {isAuthenticated && (
	                <>
	                  <Button size="small" component={RouterLink} to="/store/account" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}>Mi cuenta</Button>
	                  <Button size="small" variant="text" onClick={logout} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}>Salir</Button>
	                </>
	              )}
	              {canAccessManagement && (
	                <Button size="small" variant="outlined" component={RouterLink} to="/dashboard" startIcon={<DashboardRoundedIcon />} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
	                  Gestion
	                </Button>
	              )}
		              <IconButton onClick={toggleColorMode} color="primary" aria-label="Cambiar tema" sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
		                {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
		              </IconButton>
		            </Stack>
	          </Stack>
	        </Container>
	      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 13, lg: 12.5 } }}>
        <Stack spacing={2.5}>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              animation: 'fadeUp 420ms ease-out both',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, mode === 'dark' ? 0.22 : 0.16),
                top: -70,
                right: -50,
                filter: 'blur(14px)',
                animation: 'floatY 5.2s ease-in-out infinite alternate',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.info.main, mode === 'dark' ? 0.2 : 0.14),
                bottom: -50,
                left: -40,
                filter: 'blur(12px)',
                animation: 'pulseSoft 3.6s ease-in-out infinite',
              }}
            />

            <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AutoAwesomeRoundedIcon color="primary" />
                <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.65rem', md: '2.1rem' } }}>
                  {branding.hero_title || DEFAULT_BRANDING.hero_title}
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                {branding.hero_subtitle || DEFAULT_BRANDING.hero_subtitle}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip icon={<Inventory2RoundedIcon />} label={`${totalCount} productos`} size="small" />
                <Chip icon={<ShoppingBagRoundedIcon />} label={`${cartCount} en carrito`} size="small" color={cartCount > 0 ? 'primary' : 'default'} />
                <Chip label={mode === 'dark' ? 'Modo oscuro' : 'Modo claro'} size="small" variant="outlined" />
              </Stack>
            </Stack>
          </Paper>

          {catalogError && <Alert severity="error" onClose={() => setCatalogError(null)}>{catalogError}</Alert>}

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              animation: 'fadeUp 520ms ease-out both',
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre o marca"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                  startAdornment: <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.8 }} />,
                }}
              />
              <TextField
                fullWidth
                placeholder="Filtrar por marca"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              />
              <TextField
                select
                value={ordering}
                onChange={(event) => handleOrderingChange(event.target.value)}
                sx={{ minWidth: { md: 180 } }}
              >
                {ORDERING_VALUES.map((value) => (
                  <MenuItem key={value} value={value}>{ORDERING_LABEL[value]}</MenuItem>
                ))}
              </TextField>
              <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<TuneRoundedIcon />}
                  onClick={handleApplyFilters}
                  sx={{
                    minWidth: { md: 130 },
                    fontWeight: 700,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  }}
                >
                  Aplicar
                </Button>
                <Button fullWidth variant="outlined" onClick={handleClearFilters} sx={{ minWidth: { md: 110 } }}>
                  Limpiar
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Box id="store-featured" sx={{ animation: 'fadeUp 620ms ease-out both' }}>
            {branding.promo_top_enabled && (
              <Paper
                variant="outlined"
                sx={{
                  mb: 1.25,
                  p: 1.25,
                  borderRadius: 2.5,
                  backgroundColor: alpha(theme.palette.warning.main, mode === 'dark' ? 0.12 : 0.08),
                  borderColor: alpha(theme.palette.warning.main, 0.3),
                }}
              >
                {(branding.promo_top_image_desktop_url || branding.promo_top_image_mobile_url) && (
                  <Box sx={{ mb: 1 }}>
                    {branding.promo_top_image_desktop_url && (
                      <Box
                        component="img"
                        src={branding.promo_top_image_desktop_url}
                        alt={branding.promo_top_title || 'Promocion'}
                        sx={{
                          width: '100%',
                          height: { xs: 0, sm: 140 },
                          display: { xs: 'none', sm: 'block' },
                          borderRadius: 2,
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    {branding.promo_top_image_mobile_url && (
                      <Box
                        component="img"
                        src={branding.promo_top_image_mobile_url}
                        alt={branding.promo_top_title || 'Promocion'}
                        sx={{
                          width: { xs: '100%', sm: 0 },
                          height: { xs: 180, sm: 0 },
                          display: { xs: 'block', sm: 'none' },
                          borderRadius: 2,
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Box>
                )}
                <Typography variant="body2" fontWeight={700}>{branding.promo_top_title || 'Promocion especial'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {branding.promo_top_text || 'Descubre nuestras ofertas y beneficios por compra online.'}
                </Typography>
              </Paper>
            )}
            <Typography variant="h6" fontWeight={700} mb={1}>Destacados</Typography>
            {loadingFeatured ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={`featured-skeleton-${index}`} variant="rounded" width={140} height={32} />
                ))}
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {featuredProducts.map((product) => (
                  <Chip
                    key={`featured-chip-${product.id}`}
                    icon={<LocalMallRoundedIcon />}
                    label={product.name}
                    variant="outlined"
                    onClick={() => {
                      setSearch(product.name)
                      setBrand(product.brand)
                      setPage(1)
                      void loadProducts({ page: 1, q: product.name, brand: product.brand, ordering })
                      scrollToSection('store-catalog')
                      showToast(`Mostrando ${product.name}`, 'info')
                    }}
                    sx={{ transition: 'all 180ms ease', '&:hover': { transform: 'translateY(-2px)' } }}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Box id="store-catalog" sx={{ animation: 'fadeUp 720ms ease-out both' }}>
            <Typography variant="h6" fontWeight={700} mb={1}>Catalogo ({totalCount})</Typography>

            {loadingCatalog ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 2,
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={`catalog-skeleton-${index}`} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Stack spacing={1} sx={{ height: '100%' }}>
                        <Skeleton variant="text" width="70%" height={30} />
                        <Skeleton variant="text" width="45%" />
                        <Skeleton variant="text" width="35%" />
                        <Stack direction="row" spacing={1}>
                          <Skeleton variant="rounded" width={78} height={24} />
                          <Skeleton variant="rounded" width={78} height={24} />
                        </Stack>
                        <Skeleton variant="rounded" width="100%" height={34} />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 2,
                }}
              >
                {products.map((product, index) => {
                  const selectedVariant = getSelectedVariant(product)
                  const canAdd = canAddSelectedVariant(product)
                  return (
                    <Card
                      key={product.id}
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
                        animation: 'fadeUp 520ms ease-out both',
                        animationDelay: `${Math.min(index * 40, 320)}ms`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
                          borderColor: alpha(theme.palette.primary.main, 0.35),
                        },
                      }}
                    >
                      <CardMedia
                        key={`${product.id}-${selectedVariant?.id ?? 'default'}`}
                        component="img"
                        height="200"
                        image={getDisplayImageForProduct(product, selectedVariant?.id)}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        onClick={() => {
                          const previewUrl = getDisplayImageForProduct(product, selectedVariant?.id)
                          setImageViewer({
                            open: true,
                            url: previewUrl,
                            name: product.name,
                          })
                        }}
                        onError={(event) => {
                          const target = event.currentTarget
                          if (target.src !== FALLBACK_IMAGE) {
                            target.src = FALLBACK_IMAGE
                          }
                        }}
                        sx={{ cursor: 'zoom-in', animation: 'imageFadeIn 240ms ease' }}
                      />
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Stack spacing={1} sx={{ height: '100%' }}>
                          <Typography variant="subtitle1" fontWeight={700}>{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{product.brand}</Typography>
                          <Typography variant="body1" fontWeight={700}>
                            {selectedVariant
                              ? currencyFormatter.format(Number(selectedVariant.price))
                              : 'Consultar precio'}
                          </Typography>
                          {selectedVariant && selectedVariant.stock <= Math.max(1, Number(selectedVariant.stock_minimum || 1)) && (
                            <Chip
                              icon={<LocalFireDepartmentRoundedIcon />}
                              label={`Ultimas unidades (${selectedVariant.stock})`}
                              color="warning"
                              size="small"
                              sx={{ width: 'fit-content', fontWeight: 700 }}
                            />
                          )}

                          {renderVariantSelector(product)}

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                            {renderQuantityControl(product)}
	                            <Button
	                              size="small"
	                              variant="contained"
	                              startIcon={<ShoppingBagRoundedIcon />}
	                              disabled={!canAdd}
	                              onClick={(event) => void handleAddToCart(product, event.currentTarget)}
	                              sx={{ transition: 'transform 160ms ease', '&:hover': { transform: 'translateY(-1px)' }, width: { xs: '100%', sm: 'auto' } }}
	                            >
	                              Agregar
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  )
                })}
              </Box>
            )}

            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
            </Box>

            {branding.promo_bottom_enabled && (
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 1.25,
                  borderRadius: 2.5,
                  backgroundColor: alpha(theme.palette.info.main, mode === 'dark' ? 0.14 : 0.08),
                  borderColor: alpha(theme.palette.info.main, 0.3),
                }}
              >
                <Typography variant="body2" fontWeight={700}>{branding.promo_bottom_title || 'Mensaje comercial'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {branding.promo_bottom_text || 'Pagos seguros, cobertura nacional y soporte personalizado.'}
                </Typography>
              </Paper>
            )}
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              borderColor: alpha(theme.palette.primary.main, 0.16),
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Typography variant="caption" color="text.secondary">
                {branding.store_name} - Informacion legal y de privacidad
              </Typography>
	              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75} sx={{ width: { xs: '100%', sm: 'auto' } }}>
	                <Button size="small" variant="text" component={RouterLink} to="/store/terms" sx={{ justifyContent: { xs: 'flex-start', sm: 'center' } }}>Terminos</Button>
	                <Button size="small" variant="text" component={RouterLink} to="/store/privacy" sx={{ justifyContent: { xs: 'flex-start', sm: 'center' } }}>Privacidad</Button>
	                <Button
	                  size="small"
	                  variant="text"
	                  component="a"
	                  href="https://www.sic.gov.co"
	                  target="_blank"
	                  rel="noopener noreferrer"
	                  sx={{ justifyContent: { xs: 'flex-start', sm: 'center' } }}
	                >
	                  SIC
	                </Button>
	              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <Zoom in={showBackToTop}>
        <Fab
          color="primary"
          size="medium"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1201 }}
          aria-label="Volver arriba"
        >
          <KeyboardArrowUpRoundedIcon />
        </Fab>
      </Zoom>

      {WHATSAPP_NUMBER && (
        <Fab
          component="a"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1201,
            bgcolor: '#25D366',
            color: '#ffffff',
            transition: 'transform 180ms ease, box-shadow 180ms ease',
            '&:hover': {
              bgcolor: '#1ebe5d',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 22px rgba(37, 211, 102, 0.35)',
            },
          }}
          aria-label="Contactar por WhatsApp"
        >
          <WhatsAppIcon />
        </Fab>
      )}

      <Zoom in={isMobile} unmountOnExit>
        <Fab
          component={RouterLink}
          to="/store/cart"
          size="small"
          ref={(node: HTMLAnchorElement | null) => {
            cartFabRef.current = node
          }}
          sx={{
            position: 'fixed',
            bottom: 92,
            right: 14,
            zIndex: 1202,
            bgcolor: cartCount > 0 ? theme.palette.primary.main : alpha(theme.palette.background.paper, 0.96),
            color: cartCount > 0 ? '#ffffff' : theme.palette.text.primary,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
            boxShadow: cartCount > 0 ? `0 12px 24px ${alpha(theme.palette.primary.main, 0.34)}` : `0 10px 22px ${alpha(theme.palette.common.black, 0.2)}`,
            transition: 'transform 220ms ease, box-shadow 220ms ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              bgcolor: cartCount > 0 ? theme.palette.primary.dark : alpha(theme.palette.background.paper, 0.98),
              color: cartCount > 0 ? '#ffffff' : theme.palette.text.primary,
            },
          }}
          aria-label="Abrir carrito"
        >
          <Badge
            badgeContent={cartCount}
            color="error"
            overlap="circular"
            max={99}
            invisible={cartCount <= 0}
          >
            <ShoppingBagRoundedIcon />
          </Badge>
        </Fab>
      </Zoom>

      {flyToCart && (
        <Box
          sx={{
            position: 'fixed',
            left: `${flyToCart.startX}px`,
            top: `${flyToCart.startY}px`,
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1300,
            pointerEvents: 'none',
            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
            transform: flyToCart.active
              ? `translate(${flyToCart.deltaX}px, ${flyToCart.deltaY}px) scale(0.5) rotate(14deg)`
              : 'translate(0px, 0px) scale(1) rotate(0deg)',
            opacity: flyToCart.active ? 0.05 : 1,
            transition: 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms ease',
          }}
        >
          <LocalMallRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={2600}
        onClose={() => setToast((previous) => ({ ...previous, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((previous) => ({ ...previous, open: false }))}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={imageViewer.open}
        onClose={() => setImageViewer({ open: false, url: '', name: '' })}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 1.5 }}>
          <Box
            component="img"
            src={imageViewer.url || FALLBACK_IMAGE}
            alt={imageViewer.name}
            loading="eager"
            decoding="async"
            sx={{ width: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: 1 }}
            onError={(event) => {
              const target = event.currentTarget
              if (target.src !== FALLBACK_IMAGE) {
                target.src = FALLBACK_IMAGE
              }
            }}
          />
          <Typography variant="body2" sx={{ mt: 1 }} fontWeight={600}>
            {imageViewer.name}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  )
}







