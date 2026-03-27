import React, { useState } from 'react'
import {
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import { useTheme, useMediaQuery, alpha } from '@mui/material'
import {
  Inventory2Outlined as StockIcon,
} from '@mui/icons-material'
import { Product } from '../../types'
import DialogShell from '../common/DialogShell'

interface ProductViewDialogProps {
  open: boolean
  product: Product | null
  onClose: () => void
}

const ProductViewDialog: React.FC<ProductViewDialogProps> = ({
  open,
  product,
  onClose,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)

  if (!product) return null

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)

  // Determine displayed image: variant-specific if selected, else product primary
  const getDisplayImage = () => {
    if (selectedVariantId !== null) {
      const variantImg = product.images?.find(img => img.variant === selectedVariantId)
      if (variantImg) return variantImg.image || (variantImg as any)?.url || null
    }
    const primaryImage = product.images?.find(img => img.is_primary && !img.variant) || product.images?.find(img => img.is_primary) || product.images?.[0]
    return primaryImage?.image || (primaryImage as any)?.url || null
  }
  const imageUrl = getDisplayImage()
  const priceRange = product.variants.length > 0
    ? {
        min: Math.min(...product.variants.map(v => Number(v.price))),
        max: Math.max(...product.variants.map(v => Number(v.price))),
      }
    : null


  return (
    <DialogShell
      open={open}
      onClose={() => { setSelectedVariantId(null); onClose(); }}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      dialogTitle="Detalles del Producto"
      subtitle="Revisa toda la información del producto"
      actions={
        <Button
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: 1.5,
            fontSize: '12px',
            textTransform: 'none',
            px: 2,
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          Cerrar
        </Button>
      }
    >
      {/* Top: Image + Key Info side by side */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {/* Product Image */}
        <Box sx={{
          width: 110,
          height: 110,
          borderRadius: 2,
          overflow: 'hidden',
          flexShrink: 0,
          bgcolor: alpha(theme.palette.text.primary, 0.04),
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <StockIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
          )}
        </Box>

        {/* Key info */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip
              label={product.active ? 'Activo' : 'Inactivo'}
              size="small"
              sx={{
                height: 18,
                fontSize: '9px',
                fontWeight: 600,
                bgcolor: product.active ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
                color: product.active ? 'success.main' : 'error.main',
                border: 'none',
              }}
            />
            <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>
              ID: PRD-{String(product.id).padStart(3, '0')}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.3 }} noWrap>
            {product.name}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 0.5 }}>
            {product.brand} · {product.product_type}
          </Typography>

          {/* Price range */}
          {priceRange && (
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'text.primary' }}>
              {priceRange.min === priceRange.max
                ? `$${priceRange.min.toLocaleString('es-CO')}`
                : `$${priceRange.min.toLocaleString('es-CO')} — $${priceRange.max.toLocaleString('es-CO')}`
              }
            </Typography>
          )}

          {/* Stock summary inline */}
          <Typography sx={{ fontSize: '11px', color: totalStock === 0 ? 'error.main' : totalStock <= 10 ? 'warning.main' : 'success.main', fontWeight: 600, mt: 0.3 }}>
            {totalStock} unidades en stock
          </Typography>
        </Box>
      </Box>

      {/* Description */}
      {product.description && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary', lineHeight: 1.6 }}>
            {product.description}
          </Typography>
        </Box>
      )}

      {/* Variants Table */}
      {product.variants.length > 0 && (
        <Box sx={{
          bgcolor: alpha(theme.palette.text.primary, 0.02),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <Box sx={{ px: 2, py: 1.2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography sx={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Variantes ({product.variants.length})
            </Typography>
          </Box>

          {/* Header row */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 0.7fr 0.7fr 0.6fr 0.6fr',
            px: 2,
            py: 0.8,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.text.primary, 0.02),
          }}>
            {['Variante', 'Talla', 'Color', 'Precio', 'Stock'].map(h => (
              <Typography key={h} sx={{ fontSize: '9px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {h}
              </Typography>
            ))}
          </Box>

          {/* Variant rows */}
          {product.variants.map((v, idx) => {
            const stockColor = v.stock <= 0 ? 'error.main' : v.stock <= 5 ? 'warning.main' : 'success.main'
            return (
              <Box
                key={v.id}
                onClick={() => setSelectedVariantId(selectedVariantId === v.id ? null : v.id)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 0.7fr 0.7fr 0.6fr 0.6fr',
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  borderBottom: idx < product.variants.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
                  bgcolor: selectedVariantId === v.id ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
                  borderLeft: selectedVariantId === v.id ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                  '&:hover': { bgcolor: selectedVariantId === v.id ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.action.hover, 0.5) },
                  alignItems: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <Typography noWrap sx={{ fontSize: '12px', fontWeight: 500 }}>
                  {v.gender || '—'}
                </Typography>
                <Typography sx={{ fontSize: '12px' }}>
                  {v.size || '—'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {v.color && (
                    <Box sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: v.color.toLowerCase(),
                      border: `1px solid ${theme.palette.divider}`,
                      flexShrink: 0,
                    }} />
                  )}
                  <Typography sx={{ fontSize: '12px' }}>
                    {v.color || '—'}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                  ${Number(v.price).toLocaleString('es-CO')}
                </Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: stockColor }}>
                  {v.stock}
                </Typography>
              </Box>
            )
          })}
        </Box>
      )}
    </DialogShell>
  )
}

export default ProductViewDialog
