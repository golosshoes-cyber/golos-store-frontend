import { 
  Box, Button, Dialog, IconButton, Typography, alpha
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useNavigate } from 'react-router-dom'

import { useThemeMode } from '../../contexts/ThemeModeContext'
import type { StoreProduct } from '../../types/store'

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

  if (!product) return null

  const isDark = mode === 'dark'
  const css = isDark ? {
    bg: '#121212', text: '#f5f5f5', 
  } : {
    bg: '#ffffff', text: '#111111', 
  }

  // Precios para mostrar un rango o el primer precio si hay variantes
  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map(v => Number(v.price)))
    : 0

  return (
    <Dialog 
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', minHeight: { xs: 400, md: 550 }, display: 'flex', flexDirection: 'column' }}>
        {/* Botón de Cerrar (Flotante) */}
        <IconButton 
          onClick={onClose}
          sx={{ 
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            bgcolor: alpha('#000', 0.1), color: '#000',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: alpha('#000', 0.2), transform: 'scale(1.05)' }
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        {/* Imagen Gigante del Producto */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? '#1a1a1a' : '#f8f8f8', p: { xs: 2, md: 4 } }}>
          <img 
            src={product?.image_url || '/placeholder-sneaker.png'} 
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              maxHeight: '500px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.15))'
            }}
          />
        </Box>

        {/* Overlay o barra inferior de Info & CTA */}
        <Box sx={{ 
          p: { xs: 3, md: 4 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: css.bg
        }}>
          <Box>
            <Typography variant="overline" sx={{ color: isDark ? '#aaa' : '#666', fontWeight: 800, letterSpacing: 2 }}>
              {product.brand}
            </Typography>
            <Typography variant="h4" sx={{ color: css.text, fontWeight: 900, lineHeight: 1.1, mb: 0.5, letterSpacing: '-0.5px' }}>
              {product.name}
            </Typography>
            <Typography variant="h6" sx={{ color: isDark ? '#ccc' : '#444', fontWeight: 700 }}>
              {minPrice > 0 ? currencyFormatter.format(minPrice) : ''}
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => { onClose(); navigate(`/store/product/${product.id}`) }}
            sx={{ 
              bgcolor: isDark ? '#fff' : '#000', 
              color: isDark ? '#000' : '#fff',
              borderRadius: 3, px: 4, py: 1.5,
              fontWeight: 800, fontSize: 15, textTransform: 'none',
              minWidth: { xs: '100%', sm: 'auto' },
              boxShadow: 'none',
              '&:hover': { bgcolor: isDark ? '#ccc' : '#333', boxShadow: 'none', transform: 'translateY(-2px)' },
              transition: 'all 0.2s'
            }}
          >
            Ver Detalles Completos
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
