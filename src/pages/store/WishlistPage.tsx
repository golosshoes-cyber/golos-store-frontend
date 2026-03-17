import { useEffect, useState } from 'react'
import { Container, Typography, Grid, Box, Button, Breadcrumbs, IconButton, alpha } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'

import StoreHeader from '../../components/store/StoreHeader'
import StoreFooter from '../../components/store/StoreFooter'
import { getWishlistIds, toggleWishlistItem } from '../../utils/wishlistUtils'
import { storeService } from '../../services/storeService'
import type { StoreProduct, StoreBranding } from '../../types/store'
import { addItemToStoreCart } from '../../utils/storeCart'
import { useThemeMode } from '../../contexts/ThemeModeContext'

export default function WishlistPage() {
  const navigate = useNavigate()
  const { mode } = useThemeMode()
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlistState, setWishlistState] = useState(0)
  const [branding, setBranding] = useState<StoreBranding | null>(null)

  const isDark = mode === 'dark'
  const css = isDark ? {
    bg: '#0a0a0a', bgCard: '#141414', border: '#222', text: '#fff', textMuted: '#888', accent: '#fff', accentFg: '#000'
  } : {
    bg: '#fcfcfc', bgCard: '#ffffff', border: '#eee', text: '#000', textMuted: '#666', accent: '#000', accentFg: '#fff'
  }

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true)
      const ids = getWishlistIds()
      try {
        const [prodResp, branResp] = await Promise.all([
          storeService.getProducts({ page_size: 100 }),
          storeService.getBranding()
        ])
        setBranding(branResp.branding)
        if (prodResp?.products) {
          const filtered = prodResp.products.filter(p => ids.includes(p.id))
          setProducts(filtered)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [wishlistState])

  const handleToggleFav = (id: number) => {
    toggleWishlistItem(id)
    setWishlistState(prev => prev + 1)
  }

  return (
    <Box sx={{ minHeight: '100vh', background: css.bg, color: css.text }}>
      <StoreHeader branding={branding || undefined} />

      <Container maxWidth="lg" sx={{ pt: 3, pb: 10 }}>
        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Breadcrumbs separator="·" sx={{ '& .MuiBreadcrumbs-li': { fontSize: 11, fontWeight: 700, color: css.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 } }}>
            <RouterLink to="/store" style={{ color: 'inherit', textDecoration: 'none' }}>Tienda</RouterLink>
            <Typography variant="caption" sx={{ color: css.text, fontWeight: 700, letterSpacing: 1.5 }}>Favoritos</Typography>
          </Breadcrumbs>
          <Button
            size="small"
            startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/store')}
            sx={{ fontWeight: 700, color: css.textMuted, fontSize: 11, textTransform: 'none' }}
          >
            Regresar
          </Button>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Mi Wishlist
          </Typography>
          <Typography variant="body2" sx={{ color: css.textMuted, fontWeight: 500 }}>
            {products.length} {products.length === 1 ? 'artículo guardado' : 'artículos guardados'} en tu colección.
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map(i => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Box sx={{ height: 320, bgcolor: css.bgCard, borderRadius: 3, border: `1px solid ${css.border}` }} />
              </Grid>
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', py: 15, bgcolor: css.bgCard, borderRadius: 5, border: `1px solid ${css.border}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <Box sx={{ 
              width: 80, height: 80, borderRadius: '50%', bgcolor: css.bg, display: 'flex', 
              alignItems: 'center', justifyContent: 'center', mb: 3, opacity: 0.5
            }}>
              <FavoriteBorderRoundedIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>Aún no tienes favoritos</Typography>
            <Typography variant="body2" sx={{ color: css.textMuted, mb: 4, maxWidth: 300 }}>
              Explora nuestra colección y guarda lo que más te guste para verlo aquí más tarde.
            </Typography>
            <Button
              variant="contained" onClick={() => navigate('/store')}
              sx={{ bgcolor: css.accent, color: css.accentFg, borderRadius: 3, px: 5, py: 1.5, fontWeight: 800, textTransform: 'none', boxShadow: 'none' }}
            >
              Explorar productos
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <AnimatePresence>
              {products.map((p) => (
                <Grid item xs={6} sm={4} md={3} key={p.id}>
                  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Box sx={{
                      background: css.bgCard, borderRadius: 3, overflow: 'hidden', position: 'relative',
                      border: `1px solid ${css.border}`, transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { transform: 'translateY(-6px)', borderColor: css.accent, boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }
                    }}>
                      <Box
                        sx={{ height: { xs: 200, md: 280 }, bgcolor: css.bg, position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                        onClick={() => navigate(`/store/product/${p.id}`)}
                      >
                        <img
                          src={p.image_url || '/placeholder-sneaker.png'}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleToggleFav(p.id) }}
                          sx={{ 
                            position: 'absolute', top: 10, right: 10, bgcolor: alpha(css.bg, 0.8), backdropFilter: 'blur(4px)',
                            width: 34, height: 34, '&:hover': { bgcolor: css.bg }
                          }}
                        >
                          <FavoriteRoundedIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                        </IconButton>
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="overline" sx={{ color: css.textMuted, fontWeight: 800, fontSize: 9, letterSpacing: 1, mb: 0.5, display: 'block' }}>
                          {p.brand}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, height: 36, overflow: 'hidden', lineHeight: 1.2, color: css.text }}>
                          {p.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body1" sx={{ fontWeight: 800 }}>
                            {p.variants?.[0] ? `$${Number(p.variants[0].price).toLocaleString()}` : '---'}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => {
                              const variant = p.variants?.[0]
                              if (variant && variant.stock > 0) {
                                addItemToStoreCart(variant.id, 1)
                                navigate('/store/cart')
                              }
                            }}
                            disabled={!p.variants?.[0] || p.variants[0].stock <= 0}
                            sx={{ bgcolor: css.accent, color: css.accentFg, borderRadius: 1.5, '&:hover': { bgcolor: alpha(css.accent, 0.9) } }}
                          >
                            <ShoppingCartRoundedIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
      <StoreFooter />
    </Box>
  )
}
