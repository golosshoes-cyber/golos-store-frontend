import React from 'react'
import {
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ProductVariant, Product } from '../../types'
import { formatCurrency } from '../../utils/currency'
import DialogShell from '../common/DialogShell'

interface VariantViewDialogProps {
  open: boolean
  variant: ProductVariant | null
  product: Product | null
  images: any[]
  onClose: () => void
}

const VariantViewDialog: React.FC<VariantViewDialogProps> = ({
  open,
  variant,
  product,
  images,
  onClose,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!variant || !product) return null

  const assignedImage = images.find(img => img.variant === variant.id)

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullScreen={isMobile}
      scroll="paper"
      dialogTitle="Detalles de Variante"
      subtitle={`${product.name} — ${variant.size} ${variant.color || ''}`}
      actions={
        <Button
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: 1.5,
            fontSize: '12px',
            textTransform: 'none',
            px: 2,
            border: `1px solid ${theme.palette.divider}`,
            color: 'text.secondary',
            '&:hover': { borderColor: 'text.disabled', color: 'text.primary' },
          }}
        >
          Cerrar
        </Button>
      }
    >
      {/* Status + SKU */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip
          label={variant.active ? 'Activo' : 'Inactivo'}
          size="small"
          sx={{
            height: 20,
            fontSize: '10px',
            fontWeight: 500,
            bgcolor: variant.active ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
            color: variant.active ? 'success.main' : 'error.main',
            border: 'none',
          }}
        />
        <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
          SKU: {variant.sku || `VAR-${variant.id}`}
        </Typography>
      </Box>

      {/* Details Section */}
      <Box sx={{
        bgcolor: alpha(theme.palette.text.primary, 0.02),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        mb: 2,
      }}>
        <Typography sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
          Información de la variante
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Producto</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{product.name}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Talla</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{variant.size}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Color</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{variant.color || 'Sin color'}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Género</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
              {variant.gender === 'male' ? 'Masculino' : variant.gender === 'female' ? 'Femenino' : 'Unisex'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Economics Section */}
      <Box sx={{
        bgcolor: alpha(theme.palette.text.primary, 0.02),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        mb: 2,
      }}>
        <Typography sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
          Información económica
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Stock</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: variant.stock === 0 ? 'error.main' : 'success.main' }}>
              {variant.stock} uds
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Precio</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{formatCurrency(variant.price)}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Costo</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{formatCurrency(variant.cost)}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Image Section */}
      {assignedImage && (
        <Box sx={{
          bgcolor: alpha(theme.palette.text.primary, 0.02),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
        }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
            Imagen
          </Typography>
          <Box
            component="img"
            src={assignedImage.image}
            alt={`${product.name} - ${variant.size} ${variant.color || ''}`}
            sx={{
              maxWidth: '100%',
              maxHeight: 200,
              objectFit: 'contain',
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      )}
    </DialogShell>
  )
}

export default VariantViewDialog
