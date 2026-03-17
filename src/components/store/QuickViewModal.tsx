import { 
  Box, Button, Chip, Dialog, IconButton, Typography, alpha
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useThemeMode } from '../../contexts/ThemeModeContext'
import type { StoreProduct } from '../../types/store'
import { addItemToStoreCart } from '../../utils/storeCart'
import { toggleWishlistItem, isInWishlist } from '../../utils/wishlistUtils'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

interface QuickViewModalProps {
  product: StoreProduct | null
  open: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const navigate = useNavigate()
  const { mode } = useThemeMode()
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlistVersion, setWishlistVersion] = useState(0)

  if (!product) return null

  const isDark = mode === 'dark'
  const css = isDark ? {
    bg: '#121212', bgSubtle: '#1a1a1a', border: '#2a2a2a', text: '#f5f5f5', textMuted: '#a0a0a0', accent: '#f5f5f5', accentFg: '#111111'
  } : {
    bg: '#ffffff', bgSubtle: '#f8f8f8', border: '#e5e5e5', text: '#111111', textMuted: '#6b6b6b', accent: '#111111', accentFg: '#ffffff'
  }

  const selectedVariant = product.variants.find(v => v.id === (selectedVariantId || product.variants[0]?.id))
  const canAdd = selectedVariant && selectedVariant.stock > 0

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItemToStoreCart(selectedVariant.id, quantity)
    onClose()
    navigate('/store/cart')
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product) return
    toggleWishlistItem(product.id)
    setWishlistVersion(v => v + 1)
  }

  const inWishlist = product ? isInWishlist(product.id) : false

  return (
    <Dialog 
      key={wishlistVersion}
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: css.bg,
          backgroundImage: 'none',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: { md: 480 } }}>
        {/* Left: Image (45%) */}
        <Box sx={{ 
          width: { xs: '100%', md: '45%' }, 
          bgcolor: css.bgSubtle,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRight: { md: `1px solid ${css.border}` }
        }}>
          <img 
            src={product?.image_url || '/placeholder-sneaker.png'} 
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        {/* Right: Details (55%) */}
        <Box sx={{ 
          width: { xs: '100%', md: '55%' }, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          bgcolor: css.bg
        }}>
          {/* Close for Desktop */}
          <IconButton 
            onClick={onClose}
            sx={{ position: 'absolute', top: 12, right: 12, color: css.textMuted, '&:hover': { color: css.text } }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>

          <Box sx={{ mb: 1 }}>
            <Typography variant="overline" sx={{ color: css.textMuted, fontWeight: 700, letterSpacing: 1.5, fontSize: 10 }}>
              {product.brand}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: css.text, mb: 0.5, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              {product.name}
            </Typography>
            <Typography sx={{ color: css.text, fontWeight: 700, fontSize: '1.25rem' }}>
              {selectedVariant ? currencyFormatter.format(Number(selectedVariant.price)) : '---'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, opacity: 0.5 }} />

          {/* Variants Grid (High Density) */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1.5, display: 'block', color: css.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Talla / Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {product.variants.map((v) => (
                <Chip
                  key={v.id}
                  label={`${v.size} · ${v.color}`}
                  size="small"
                  onClick={() => v.stock > 0 && setSelectedVariantId(v.id)}
                  disabled={v.stock <= 0}
                  sx={{
                    borderRadius: 1.5,
                    fontSize: 11,
                    height: 28,
                    fontWeight: v.id === (selectedVariantId || product.variants[0]?.id) ? 700 : 500,
                    bgcolor: v.id === (selectedVariantId || product.variants[0]?.id) ? css.accent : 'transparent',
                    color: v.id === (selectedVariantId || product.variants[0]?.id) ? css.accentFg : css.text,
                    border: `1px solid ${v.id === (selectedVariantId || product.variants[0]?.id) ? css.accent : css.border}`,
                    transition: 'all 0.1s',
                    '&:hover': { bgcolor: v.stock > 0 ? alpha(css.accent, 0.05) : 'none' },
                    '&.Mui-disabled': { opacity: 0.4 }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${css.border}`, borderRadius: '10px', p: 0.25 }}>
                <IconButton size="small" onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{ color: css.text, p: 1 }}><Typography sx={{ fontWeight: 700, lineHeight: 1 }}>−</Typography></IconButton>
                <Typography sx={{ width: 28, textAlign: 'center', fontWeight: 700, fontSize: 13 }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity(q => Math.min(selectedVariant?.stock || 1, q + 1))} sx={{ color: css.text, p: 1 }}><Typography sx={{ fontWeight: 700, lineHeight: 1 }}>+</Typography></IconButton>
              </Box>
              
              <IconButton 
                onClick={handleToggleWishlist}
                sx={{ 
                  border: `1px solid ${css.border}`, borderRadius: '10px',
                  color: inWishlist ? '#ef4444' : css.textMuted,
                  width: 40, height: 40,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: alpha('#ef4444', 0.05), borderColor: alpha('#ef4444', 0.2) }
                }}
              >
                {inWishlist ? <FavoriteRoundedIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                fullWidth
                variant="contained"
                disabled={!canAdd}
                onClick={handleAddToCart}
                sx={{ 
                  bgcolor: css.accent, color: css.accentFg, py: 1.25, borderRadius: '10px', fontWeight: 700,
                  textTransform: 'none', fontSize: 14,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: alpha(css.accent, 0.9), boxShadow: 'none' }
                }}
              >
                {canAdd ? 'Agregar al Carrito' : 'Agotado'}
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => navigate(`/store/product/${product.id}`)}
                sx={{ 
                  borderColor: css.border, color: css.text, borderRadius: '10px', px: 2, 
                  minWidth: 'fit-content', textTransform: 'none', fontSize: 12, fontWeight: 600,
                  '&:hover': { bgcolor: alpha(css.accent, 0.05), borderColor: css.accent }
                }}
              >
                Ver detalle
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}
