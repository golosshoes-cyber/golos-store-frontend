import React, { useState } from 'react'
import {
  TextField,
  Button,
  CircularProgress,
  MenuItem,
} from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import { Product } from '../../types'
import ProductFormHeader from '../../components/common/ProductFormHeader'
import DialogShell from '../common/DialogShell'

// Componente para el diálogo de producto
interface ProductDialogProps {
  open: boolean
  product: Product | null
  onClose: () => void
  onSubmit: (product: Partial<Product>) => void
  loading: boolean
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  product,
  onClose,
  onSubmit,
  loading,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const productTypeOptions = [
    { value: 'sneakers', label: 'Tenis' },
    { value: 'heels', label: 'Tacones' },
    { value: 'classics', label: 'Clásicos' },
    { value: 'boots', label: 'Botas' },
    { value: 'sandals', label: 'Sandalias' },
    { value: 'flats', label: 'Planas' },
    { value: 'loafers', label: 'Mocasines' },
    { value: 'other', label: 'Otro' },
  ]

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    product_type: 'sneakers',
    active: true,
  })

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        product_type: product.product_type || 'sneakers',
        active: product.active !== undefined ? product.active : true,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        brand: '',
        product_type: 'sneakers',
        active: true,
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <DialogShell
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullScreen={isMobile}
      scroll="paper"
      disableEscapeKeyDown
      header={<ProductFormHeader isEditing={!!product} />}
      headerInTitle={false}
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading} form="product-dialog-form">
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              product ? 'Actualizar' : 'Crear'
            )}
          </Button>
        </>
      }
    >
      <form id="product-dialog-form" onSubmit={handleSubmit}>
          <TextField
            id="name"
            name="name"
            autoFocus
            margin="dense"
            label="Nombre/Modelo"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
          />
          <TextField
            id="brand"
            name="brand"
            margin="dense"
            label="Marca"
            fullWidth
            required
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            disabled={loading}
          />
          <TextField
            id="description"
            name="description"
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />
          <TextField
            id="product_type"
            name="product_type"
            margin="dense"
            label="Tipo de Producto"
            fullWidth
            select
            value={formData.product_type}
            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
            disabled={loading}
          >
            {productTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
      </form>
    </DialogShell>
  )
}

export default ProductDialog
