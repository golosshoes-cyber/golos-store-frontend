import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Breadcrumbs, Button, Chip,
  Container, Divider, Grid, IconButton, Skeleton, Typography, alpha
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

import { useThemeMode } from '../../contexts/ThemeModeContext'
import { storeService } from '../../services/storeService'
import type { StoreProduct, StoreBranding } from '../../types/store'
import { addItemToStoreCart } from '../../utils/storeCart'
import { toggleWishlistItem, isInWishlist } from '../../utils/wishlistUtils'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import StoreHeader from '../../components/store/StoreHeader'
import StoreFooter from '../../components/store/StoreFooter'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'>
    <rect width='800' height='800' fill='#f5f5f5'/>
    <path d='M200 500 Q300 350 500 340 Q650 330 700 450 L720 550 Q600 520 450 580 Q300 640 200 650Z' fill='#c8c8c8'/>
  </svg>
`)}`

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { mode } = useThemeMode()

  const [product, setProduct] = useState<StoreProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [branding, setBranding] = useState<StoreBranding | null>(null)

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlistVersion, setWishlistVersion] = useState(0)
  const [zoomShow, setZoomShow] = useState(false)
  const [sizeFormat, setSizeFormat] = useState<'EUR' | 'US' | 'UK' | 'CM'>('EUR')
  const zoomImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setActiveImage(0)
  }, [selectedVariantId])

  const isDark = mode === 'dark'
  const css = isDark ? {
    bg: '#0a0a0a', bgSubtle: '#141414', border: '#222', text: '#fff', textMuted: '#888', accent: '#fff', accentFg: '#000'
  } : {
    bg: '#fff', bgSubtle: '#f9f9f9', border: '#eee', text: '#000', textMuted: '#666', accent: '#000', accentFg: '#fff'
  }

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const [prodResp, branResp] = await Promise.all([
          storeService.getProductDetail(Number(id)),
          storeService.getBranding()
        ])
        setProduct(prodResp.product)
        setBranding(branResp.branding)
        const firstAvailable = prodResp.product.variants.find(v => v.stock > 0) || prodResp.product.variants[0]
        if (firstAvailable) setSelectedVariantId(firstAvailable.id)
      } catch (err) {
        setError('Error al cargar el producto.')
      } finally {
        setLoading(false)
      }
    }
    void loadData()
  }, [id])

  const selectedVariant = useMemo(() =>
    product?.variants.find(v => v.id === selectedVariantId) || null
    , [product, selectedVariantId])

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return
    addItemToStoreCart(selectedVariant.id, quantity)
    navigate('/store/cart')
  }

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlistItem(product.id)
      setWishlistVersion(v => v + 1)
    }
  }

  const images = useMemo(() => {
    if (!product) return []
    
    // 1. Fotos estrictamente asignadas a esta variante
    const variantImages = product.images
      .filter(img => img.variant_id === selectedVariantId)
      .map(img => img.url)
      .filter(Boolean) as string[]
    
    if (variantImages.length > 0) return variantImages

    // 2. Si la variante NO tiene fotos, usamos las fotos "base" (sin variante)
    const baseImages = product.images
      .filter(img => img.variant_id === null)
      .map(img => img.url)
      .filter(Boolean) as string[]
    
    // Agregar la imagen principal del producto a las base si no está
    if (product.image_url && !baseImages.includes(product.image_url)) {
      baseImages.unshift(product.image_url)
    }

    if (baseImages.length > 0) return baseImages

    // 3. Fallback a mostrar absolutamente todas las fotos si no hay de otra
    const allImages = product.images.map(img => img.url).filter(Boolean) as string[]
    if (allImages.length > 0) return allImages

    return [FALLBACK_IMAGE]
  }, [product, selectedVariantId])

  const inWishlist = useMemo(() => 
    product ? isInWishlist(product.id) : false, 
    [product?.id, wishlistVersion]
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomImgRef.current) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    zoomImgRef.current.style.transformOrigin = `${x}% ${y}%`
  }

  if (loading) return <Box sx={{ p: 8 }}><Skeleton variant="rectangular" height={600} sx={{ borderRadius: 4 }} /></Box>
  if (error || !product) return <Box sx={{ p: 8, textAlign: 'center' }}><Typography>{error || 'Producto no encontrado'}</Typography></Box>

  return (
    <Box sx={{ bgcolor: css.bg, color: css.text, minHeight: '100vh' }}>
      <StoreHeader branding={branding || undefined} />

      <Container maxWidth="lg" sx={{ pt: 2, pb: 10 }}>
        {/* Breadcrumbs & Back */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Breadcrumbs separator="·" sx={{ '& .MuiBreadcrumbs-li': { fontSize: 11, fontWeight: 600, color: css.textMuted, textTransform: 'uppercase', letterSpacing: 1 } }}>
            <RouterLink to="/store" style={{ color: 'inherit', textDecoration: 'none' }}>Tienda</RouterLink>
            <Typography variant="caption" sx={{ color: css.text, fontWeight: 700, letterSpacing: 1 }}>{product.name}</Typography>
          </Breadcrumbs>
          <Button
            onClick={() => navigate('/store')}
            startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{ color: css.textMuted, fontSize: 11, fontWeight: 700, textTransform: 'none' }}
          >
            Regresar
          </Button>
        </Box>

        <Grid container spacing={6}>
          {/* Left: Gallery */}
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Box 
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setZoomShow(true)}
                onMouseLeave={() => setZoomShow(false)}
                sx={{ 
                bgcolor: css.bgSubtle, borderRadius: 4, overflow: 'hidden', aspectRatio: '1/1',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
                border: `1px solid ${css.border}`,
                cursor: zoomShow ? 'crosshair' : 'default',
                '&:hover .carousel-nav': { opacity: 1 }
              }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 100) {
                        setActiveImage(prev => (prev - 1 + images.length) % images.length)
                      } else if (info.offset.x < -100) {
                        setActiveImage(prev => (prev + 1) % images.length)
                      }
                    }}
                  />
                </AnimatePresence>

                {/* Overposición de Zoom */}
                <Box sx={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
                  pointerEvents: 'none',
                  opacity: zoomShow ? 1 : 0,
                  transition: 'opacity 0.2s',
                  bgcolor: css.bgSubtle,
                  overflow: 'hidden'
                }}>
                  {images.length > 0 && (
                    <img 
                      ref={zoomImgRef}
                      src={images[activeImage]} 
                      alt="zoom"
                      style={{
                        width: '100%', height: '100%', objectFit: 'contain',
                        transform: 'scale(2.5)',
                        transition: 'transform-origin 0.05s ease-out'
                      }}
                    />
                  )}
                </Box>

                {/* Carousel Nav Arrows */}
                {images.length > 1 && (
                  <>
                    <IconButton
                      className="carousel-nav"
                      onClick={() => setActiveImage(prev => (prev - 1 + images.length) % images.length)}
                      sx={{
                        position: 'absolute', left: 16, zIndex: 2,
                        bgcolor: alpha(css.bg, 0.8), color: css.text,
                        opacity: 0, transition: '0.2s',
                        backdropFilter: 'blur(8px)',
                        '&:hover': { bgcolor: css.bg }
                      }}
                    >
                      <ChevronLeftRoundedIcon />
                    </IconButton>
                    <IconButton
                      className="carousel-nav"
                      onClick={() => setActiveImage(prev => (prev + 1) % images.length)}
                      sx={{
                        position: 'absolute', right: 16, zIndex: 2,
                        bgcolor: alpha(css.bg, 0.8), color: css.text,
                        opacity: 0, transition: '0.2s',
                        backdropFilter: 'blur(8px)',
                        '&:hover': { bgcolor: css.bg }
                      }}
                    >
                      <ChevronRightRoundedIcon />
                    </IconButton>

                    {/* Indicators */}
                    <Box sx={{
                      position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                      display: 'flex', gap: 1, zIndex: 2
                    }}>
                      {images.map((_, idx) => (
                        <Box
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          sx={{
                            width: activeImage === idx ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: activeImage === idx ? css.text : alpha(css.text, 0.3),
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: alpha(css.text, 0.1), borderRadius: 2 } }}>
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      sx={{ 
                        width: 70, height: 70, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                        border: `2px solid ${activeImage === idx ? css.accent : 'transparent'}`,
                        bgcolor: css.bgSubtle, flexShrink: 0, opacity: activeImage === idx ? 1 : 0.6,
                        transition: '0.2s'
                      }}
                    >
                      <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right: Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ pl: { md: 2 } }}>
              <Typography variant="overline" sx={{ color: css.textMuted, fontWeight: 800, letterSpacing: 2.5, fontSize: 10 }}>
                {product.brand}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px', lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.2rem' } }}>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {selectedVariant ? currencyFormatter.format(Number(selectedVariant.price)) : '---'}
                </Typography>
                {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                  <Chip label={`¡Solo queda${selectedVariant.stock === 1 ? '' : 'n'} ${selectedVariant.stock}!`} size="small" color="error" sx={{ fontWeight: 800, fontSize: 10, height: 20 }} />
                )}
              </Box>

              <Typography sx={{ color: css.textMuted, lineHeight: 1.6, mb: 4, fontSize: '0.95rem' }}>
                {product.description}
              </Typography>

              <Divider sx={{ mb: 4, opacity: 0.5 }} />

              {/* Variants */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: css.textMuted }}>
                    Talla / Color
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {['EUR', 'US', 'UK', 'CM'].map((fmt) => (
                      <Chip
                        key={fmt}
                        label={fmt}
                        onClick={() => setSizeFormat(fmt as any)}
                        sx={{
                          height: 20, fontSize: 9, fontWeight: 800, cursor: 'pointer',
                          bgcolor: sizeFormat === fmt ? css.accent : 'transparent',
                          color: sizeFormat === fmt ? css.accentFg : css.textMuted,
                          border: `1px solid ${sizeFormat === fmt ? css.accent : css.border}`
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {product.variants.map((v) => {
                    const labelValue = sizeFormat === 'EUR' ? v.size : 
                                       sizeFormat === 'US' ? (v.size_us || v.size) : 
                                       sizeFormat === 'UK' ? (v.size_uk || v.size) : 
                                       (v.size_cm || v.size);
                    return (
                      <Chip
                        key={v.id}
                        label={`${labelValue} ${sizeFormat} · ${v.color}`}
                        onClick={() => v.stock > 0 && setSelectedVariantId(v.id)}
                        disabled={v.stock <= 0}
                        sx={{
                          borderRadius: 1.5, height: 32, fontSize: 12,
                          fontWeight: v.id === selectedVariantId ? 800 : 500,
                          bgcolor: v.id === selectedVariantId ? css.accent : 'transparent',
                          color: v.id === selectedVariantId ? css.accentFg : css.text,
                          border: `1px solid ${v.id === selectedVariantId ? css.accent : css.border}`,
                          '&:hover': { bgcolor: alpha(css.accent, 0.05) }
                        }}
                      />
                    );
                  })}
                </Box>
                
                {/* Asistente "Double Check" */}
                {selectedVariant && (
                  <Typography variant="caption" sx={{ display: 'block', color: css.textMuted, fontSize: 11, fontStyle: 'italic', mt: 1, px: 0.5 }}>
                   * Seleccionaste la talla <strong>{selectedVariant.size} EUR</strong>. 
                   Equivale a <strong>{selectedVariant.size_us || '..'} US</strong> / <strong>{selectedVariant.size_cm || '..'} CM</strong>.
                  </Typography>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 6 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${css.border}`, borderRadius: 3, p: 0.5 }}>
                    <IconButton size="small" onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{ color: css.text, p: 1 }}><Typography sx={{ fontWeight: 900 }}>−</Typography></IconButton>
                    <Typography sx={{ width: 34, textAlign: 'center', fontWeight: 800 }}>{quantity}</Typography>
                    <IconButton size="small" onClick={() => setQuantity(q => Math.min(selectedVariant?.stock || 1, q + 1))} sx={{ color: css.text, p: 1 }}><Typography sx={{ fontWeight: 900 }}>+</Typography></IconButton>
                  </Box>
                  <Button
                    fullWidth variant="contained" disabled={!selectedVariant || selectedVariant.stock <= 0}
                    onClick={handleAddToCart}
                    sx={{ bgcolor: css.accent, color: css.accentFg, borderRadius: 3, fontWeight: 800, textTransform: 'none', fontSize: 15, boxShadow: 'none', '&:hover': { bgcolor: alpha(css.accent, 0.9), boxShadow: 'none' } }}
                  >
                    Añadir al Carrito
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth variant="outlined" startIcon={inWishlist ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                    onClick={handleToggleWishlist}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, textTransform: 'none', borderColor: css.border, color: inWishlist ? '#ef4444' : css.text, '&:hover': { borderColor: css.accent, bgcolor: alpha(css.accent, 0.03) } }}
                  >
                    {inWishlist ? 'En tu Wishlist' : 'Guardar en Wishlist'}
                  </Button>
                  <IconButton
                    component="a" href={`https://wa.me/573189374198?text=Hola,%20me%20interesa%20${encodeURIComponent(product.name)}`} target="_blank"
                    sx={{ border: `1px solid ${css.border}`, borderRadius: 3, width: 56, color: '#25D366' }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Trust Badges */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, borderRadius: 4, bgcolor: css.bgSubtle, border: `1px solid ${css.border}` }}>
                <Box sx={{ textAlign: 'center' }}>
                  <LocalShippingRoundedIcon sx={{ fontSize: 20, mb: 0.5, color: css.textMuted }} />
                  <Typography variant="caption" display="block" sx={{ fontWeight: 700, fontSize: 10 }}>Envío Rápido</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <VerifiedUserRoundedIcon sx={{ fontSize: 20, mb: 0.5, color: css.textMuted }} />
                  <Typography variant="caption" display="block" sx={{ fontWeight: 700, fontSize: 10 }}>100% Original</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <AssignmentReturnRoundedIcon sx={{ fontSize: 20, mb: 0.5, color: css.textMuted }} />
                  <Typography variant="caption" display="block" sx={{ fontWeight: 700, fontSize: 10 }}>Garantía</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <StoreFooter />
    </Box>
  )
}
