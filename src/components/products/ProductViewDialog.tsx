import React from 'react'
import {
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import { useTheme, useMediaQuery, alpha } from '@mui/material'
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

  if (!product) return null

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)

  return (
    <DialogShell
      open={open}
      onClose={onClose}
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
      {/* Status Tag + ID */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip
          label={product.active ? 'Activo' : 'Inactivo'}
          size="small"
          sx={{
            height: 20,
            fontSize: '10px',
            fontWeight: 500,
            bgcolor: product.active ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
            color: product.active ? 'success.main' : 'error.main',
            border: 'none',
          }}
        />
        <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
          ID: PRD-{String(product.id).padStart(3, '0')}
        </Typography>
      </Box>

      {/* General Info Section */}
      <Box sx={{
        bgcolor: alpha(theme.palette.text.primary, 0.02),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        mb: 2,
      }}>
        <Typography sx={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mb: 1.5,
        }}>
          Información general
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Nombre / Modelo
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{product.name}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Marca
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>{product.brand}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Tipo
            </Typography>
            <Chip
              label={product.product_type}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '10px', borderColor: theme.palette.divider }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Estado
            </Typography>
            <Chip
              label={product.active ? 'Activo' : 'Inactivo'}
              size="small"
              sx={{
                height: 20,
                fontSize: '10px',
                fontWeight: 500,
                bgcolor: product.active ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
                color: product.active ? 'success.main' : 'error.main',
                border: 'none',
              }}
            />
          </Box>
        </Box>
        {product.description && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Descripción
            </Typography>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', lineHeight: 1.6 }}>
              {product.description}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Stats Section */}
      <Box sx={{
        bgcolor: alpha(theme.palette.text.primary, 0.02),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
      }}>
        <Typography sx={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mb: 1.5,
        }}>
          Estadísticas
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Stock total
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: totalStock === 0 ? 'error.main' : 'text.primary' }}>
              {totalStock} unidades
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              Variantes
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
              {product.variants.length}
            </Typography>
          </Box>
        </Box>
      </Box>
    </DialogShell>
  )
}

export default ProductViewDialog
