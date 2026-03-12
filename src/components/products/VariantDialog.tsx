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
import VariantFormHeader from '../../components/common/VariantFormHeader'
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
      header={<VariantFormHeader isEditing={!!variant} />}
      headerInTitle={false}
      actions={
        <>
          <Button onClick={handleSafeClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading} form="variant-dialog-form">
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              variant ? 'Actualizar' : 'Crear'
            )}
          </Button>
        </>
      }
    >
      <Box sx={{ 
        maxHeight: '60vh', 
        overflowY: 'auto',
      }}>
        <form id="variant-dialog-form" onSubmit={handleSubmit}>
          <TextField
            id="product"
            name="product"
            margin="dense"
            label="Producto"
            select
            fullWidth
            required
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            disabled={loading}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            id="size"
            name="size"
            autoFocus
            margin="dense"
            label="Talla"
            fullWidth
            required
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            disabled={loading}
          />
          <TextField
            id="color"
            name="color"
            margin="dense"
            label="Color"
            fullWidth
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            disabled={loading}
          />
          <TextField
            id="gender"
            name="gender"
            margin="dense"
            label="Género"
            select
            fullWidth
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            disabled={loading}
          >
            <MenuItem value="male">Masculino</MenuItem>
            <MenuItem value="female">Femenino</MenuItem>
            <MenuItem value="unisex">Unisex</MenuItem>
          </TextField>
          <TextField
            id="price"
            name="price"
            margin="dense"
            label="Precio"
            fullWidth
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            disabled={loading}
          />
          <TextField
            id="cost"
            name="cost"
            margin="dense"
            label="Costo"
            fullWidth
            type="number"
            required
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            disabled={loading}
          />
        </form>
      </Box>
    </DialogShell>
  )
}

export default VariantDialog
