import React, { useState } from 'react'
import {
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Box,
} from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import { Product } from '../../types'
import DialogShell from '../common/DialogShell'

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
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      disableEscapeKeyDown
      dialogTitle={product ? 'Editar Producto' : 'Nuevo Producto'}
      subtitle={product ? 'Modifica los detalles del producto existente' : 'Agrega un nuevo producto al catálogo'}
      actions={
        <>
          <Button
            onClick={onClose}
            disabled={loading}
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
            Cancelar
          </Button>
          <Button
            type="submit"
            form="product-dialog-form"
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
            {loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              product ? 'Actualizar producto' : 'Crear producto'
            )}
          </Button>
        </>
      }
    >
      <form id="product-dialog-form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
          <TextField
            id="name"
            name="name"
            autoFocus
            size="small"
            label="Nombre / Modelo"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
          <TextField
            id="brand"
            name="brand"
            size="small"
            label="Marca"
            fullWidth
            required
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
        </Box>
        <TextField
          id="description"
          name="description"
          size="small"
          label="Descripción"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={loading}
          sx={{ mb: 1.5 }}
          InputLabelProps={{ sx: { fontSize: '12px' } }}
          InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField
            id="product_type"
            name="product_type"
            size="small"
            label="Tipo de Producto"
            fullWidth
            select
            value={formData.product_type}
            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          >
            {productTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="active"
            name="active"
            size="small"
            label="Estado"
            fullWidth
            select
            value={formData.active ? 'active' : 'inactive'}
            onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          >
            <MenuItem value="active">Activo</MenuItem>
            <MenuItem value="inactive">Inactivo</MenuItem>
          </TextField>
        </Box>
      </form>
    </DialogShell>
  )
}

export default ProductDialog
