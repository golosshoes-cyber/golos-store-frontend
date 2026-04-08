import React, { useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import { Product, ProductVariant } from '../../types'
import DialogShell from '../common/DialogShell'

interface VariantDialogProps {
  open: boolean
  variant: ProductVariant | null
  products: Product[]
  onClose: () => void
  onSubmit: (variant: Partial<ProductVariant>) => void
  loading: boolean
}

const VariantDialog: React.FC<VariantDialogProps> = ({
  open,
  variant,
  products,
  onClose,
  onSubmit,
  loading,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [formData, setFormData] = useState({
    product: '',
    size: '',
    size_us: '',
    size_uk: '',
    size_cm: '',
    gender: '',
    color: '',
    price: '' as number | string,
    cost: '' as number | string,
    active: true,
  })

  React.useEffect(() => {
    if (variant) {
      setFormData({
        product: variant.product.toString(),
        size: variant.size || '',
        size_us: variant.size_us || '',
        size_uk: variant.size_uk || '',
        size_cm: variant.size_cm || '',
        gender: variant.gender || '',
        color: variant.color || '',
        price: variant.price || 0,
        cost: variant.cost || 0,
        active: variant.active !== undefined ? variant.active : true,
      })
    } else {
      setFormData({
        product: '',
        size: '',
        size_us: '',
        size_uk: '',
        size_cm: '',
        gender: '',
        color: '',
        price: '',
        cost: '',
        active: true,
      })
    }
  }, [variant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      product: parseInt(formData.product),
      price: parseFloat(formData.price.toString()) || 0,
      cost: parseFloat(formData.cost.toString()) || 0,
    })
  }

  const handleSafeClose = () => {
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) {
      activeElement.blur()
    }
    onClose()
  }

  return (
    <DialogShell
      open={open}
      onClose={!loading ? handleSafeClose : undefined}
      maxWidth="sm"
      fullScreen={isMobile}
      scroll="paper"
      disableEscapeKeyDown
      dialogTitle={variant ? 'Editar Variante' : 'Nueva Variante'}
      subtitle={variant ? 'Modifica los detalles de la variante' : 'Agrega una nueva variante al producto'}
      actions={
        <>
          <Button
            onClick={handleSafeClose}
            disabled={loading}
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
            Cancelar
          </Button>
          <Button
            type="submit"
            form="variant-dialog-form"
            disabled={loading}
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 2,
              bgcolor: 'text.primary',
              color: 'background.default',
              '&:hover': { bgcolor: 'text.secondary' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : (variant ? 'Actualizar' : 'Crear variante')}
          </Button>
        </>
      }
    >
      <form id="variant-dialog-form" onSubmit={handleSubmit}>
        <TextField
          name="product"
          size="small"
          label="Producto"
          select
          fullWidth
          required
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          disabled={loading}
          sx={{ mb: 1.5 }}
          InputLabelProps={{ sx: { fontSize: '12px' } }}
          InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
        >
          {products.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
          <TextField
            name="size"
            autoFocus
            size="small"
            label="Talla Principal"
            fullWidth
            required
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
          <TextField
            name="color"
            size="small"
            label="Color"
            fullWidth
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
        </Box>

        <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>Conversión Internacional (Opcional)</Typography>
        <Box display="flex" gap={1.5} mb={1.5}>
          <TextField name="size_us" size="small" label="US" fullWidth value={formData.size_us} onChange={(e) => setFormData({ ...formData, size_us: e.target.value })} disabled={loading} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }} />
          <TextField name="size_uk" size="small" label="UK" fullWidth value={formData.size_uk} onChange={(e) => setFormData({ ...formData, size_uk: e.target.value })} disabled={loading} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }} />
          <TextField name="size_cm" size="small" label="CM/MM" fullWidth value={formData.size_cm} onChange={(e) => setFormData({ ...formData, size_cm: e.target.value })} disabled={loading} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }} />
        </Box>
        <TextField
          name="gender"
          size="small"
          label="Género"
          select
          fullWidth
          required
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          disabled={loading}
          sx={{ mb: 1.5 }}
          InputLabelProps={{ sx: { fontSize: '12px' } }}
          InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
        >
          <MenuItem value="male">Masculino</MenuItem>
          <MenuItem value="female">Femenino</MenuItem>
          <MenuItem value="unisex">Unisex</MenuItem>
        </TextField>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField
            name="price"
            size="small"
            label="Precio"
            fullWidth
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
          <TextField
            name="cost"
            size="small"
            label="Costo"
            fullWidth
            type="number"
            required
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
        </Box>
      </form>
    </DialogShell>
  )
}

export default VariantDialog
