import React, { useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
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
            label="Talla"
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
