import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  IconButton,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Add as AddIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import { Sale } from '../../types'
import { formatCurrency } from '../../utils/currency'

interface SaleFormProps {
  sale: Sale | null
  onSubmit: (saleData: any) => void
  onCancel: () => void
  loading?: boolean
}

const SaleForm: React.FC<SaleFormProps> = ({ sale, onSubmit, onCancel, loading = false }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [saleCustomer, setSaleCustomer] = useState('')
  const [isOrder, setIsOrder] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'TRANSFER' | 'PSE' | 'OTHER'>('CASH')
  const [paymentReference, setPaymentReference] = useState('')
  const [saleItems, setSaleItems] = useState<{variantId: string; quantity: string; price: string}[]>([])

  // Fetch variants for better display
  const { data: variantsData } = useQuery({
    queryKey: ['variants'],
    queryFn: () => productService.getVariants({ limit: 1000 }),
  })

  // Fetch products to get product names
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
  })

  const variants = variantsData?.results || []
  const products = productsData?.results || []


  // Cargar datos de la venta si se está editando
  useEffect(() => {
    if (sale) {
      setSaleCustomer(sale.customer)
      setIsOrder(sale.is_order || false)
      setPaymentMethod((sale.payment_method as any) || 'CASH')
      setPaymentReference(sale.payment_reference || '')
      const saleItemsData = sale.details.map(detail => ({
        variantId: typeof detail.variant === 'object' ? detail.variant.id.toString() : detail.variant.toString(),
        quantity: detail.quantity.toString(),
        price: typeof detail.price === 'string' ? detail.price : detail.price.toString(),
      }))
      setSaleItems(saleItemsData)
    } else {
      setSaleCustomer('')
      setIsOrder(false)
      setPaymentMethod('CASH')
      setPaymentReference('')
      setSaleItems([])
    }
  }, [sale])

  const getProductName = (product: any) => {
    if (!product) return 'Producto desconocido'
    
    // Si product es un objeto completo con nombre
    if (typeof product === 'object' && product.name) {
      return product.name
    }
    
    // Si product es solo un ID numérico, buscar en la lista de products
    if (typeof product === 'number' || (typeof product === 'object' && product.id && !product.name)) {
      const productId = typeof product === 'number' ? product : product.id
      const foundProduct = products.find(p => p.id === productId)
      if (foundProduct) {
        return foundProduct.name || foundProduct.brand || `Producto ${productId}`
      }
    }
    
    // Fallback
    return product.brand || product.name || 'Producto desconocido'
  }

  const handleUpdateSaleItem = (index: number, field: 'variantId' | 'quantity' | 'price', value: string) => {
    const updatedItems = [...saleItems]
    updatedItems[index][field] = value

    // Auto-fill price when variant is selected
    if (field === 'variantId' && value) {
      const selectedVariant = variants.find(v => v.id.toString() === value)
      if (selectedVariant && selectedVariant.price) {
        updatedItems[index].price = selectedVariant.price.toString()
      }
    }

    setSaleItems(updatedItems)
  }

  const handleAddSaleItem = () => {
    setSaleItems([...saleItems, { variantId: '', quantity: '', price: '' }])
  }

  const handleRemoveSaleItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index))
  }

  const getValidationErrors = () => {
    const errors: string[] = []
    
    if (!saleCustomer.trim()) {
      errors.push('El nombre del cliente es requerido')
    }
    if (!paymentMethod) {
      errors.push('El metodo de pago es requerido')
    }
    
    if (saleItems.length === 0) {
      errors.push('Debe agregar al menos un producto')
    }
    
    saleItems.forEach((item, index) => {
      if (!item.variantId) {
        errors.push(`Producto ${index + 1}: Debe seleccionar una variante`)
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        errors.push(`Producto ${index + 1}: La cantidad debe ser mayor a 0`)
      }
      if (!item.price || parseFloat(item.price) <= 0) {
        errors.push(`Producto ${index + 1}: El precio debe ser mayor a 0`)
      }
    })
    
    return errors
  }

  const isFormValid = () => {
    return getValidationErrors().length === 0
  }

  const handleSubmit = () => {
    if (!isFormValid()) return

    const saleData = {
      customer: saleCustomer,
      is_order: isOrder,
      payment_method: paymentMethod,
      payment_reference: paymentReference.trim() || undefined,
      items: saleItems,
    }

    onSubmit(saleData)
  }

  const total = saleItems.reduce((total, item) =>
    total + (parseFloat(item.quantity || '0') * parseFloat(item.price || '0')), 0
  ).toFixed(2)

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <TextField
        fullWidth
        label="Nombre del Cliente"
        value={saleCustomer}
        onChange={(e) => setSaleCustomer(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isOrder}
              onChange={(e) => setIsOrder(e.target.checked)}
            />
          }
          label="Es Orden"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
          No afecta inventario hasta confirmar
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <TextField
          select
          label="Metodo de pago"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as any)}
          fullWidth
        >
          <MenuItem value="CASH">Efectivo</MenuItem>
          <MenuItem value="NEQUI">Nequi</MenuItem>
          <MenuItem value="DAVIPLATA">Daviplata</MenuItem>
          <MenuItem value="CARD">Tarjeta</MenuItem>
          <MenuItem value="TRANSFER">Transferencia</MenuItem>
          <MenuItem value="PSE">PSE</MenuItem>
          <MenuItem value="OTHER">Otro</MenuItem>
        </TextField>
        <TextField
          label="Referencia pago (opcional)"
          value={paymentReference}
          onChange={(e) => setPaymentReference(e.target.value)}
          fullWidth
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Productos
      </Typography>

      {saleItems.map((item, index) => (
        <Box key={index} sx={{ mb: 3, p: { xs: 1.5, sm: 2 }, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Variante */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Variante
              </Typography>
              <Autocomplete
                options={variants}
                getOptionLabel={(option) => `${getProductName(option.product)} - ${option.size} - ${option.color || 'Sin color'}`}
                getOptionKey={(option) => option.id}
                value={variants.find(v => v.id.toString() === item.variantId) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleUpdateSaleItem(index, 'variantId', newValue.id.toString())
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar variante..."
                    fullWidth
                    size="small"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                size="small"
              />
            </Box>

            {/* Cantidad, Precio y Eliminar en columna vertical */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Cantidad */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Cantidad
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleUpdateSaleItem(index, 'quantity', e.target.value)}
                  inputProps={{ min: 1 }}
                  size="small"
                />
              </Box>

              {/* Precio Unitario */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Precio Unitario
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={item.price}
                  onChange={(e) => handleUpdateSaleItem(index, 'price', e.target.value)}
                  size="small"
                />
              </Box>

              {/* Botón eliminar */}
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveSaleItem(index)}
                  size="small"
                  sx={{ 
                    border: 1, 
                    borderColor: 'error.main', 
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'error.main',
                      color: 'white'
                    }
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddSaleItem}
        sx={{ mb: 2 }}
      >
        Agregar Producto
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Total: {formatCurrency(total)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button 
          onClick={onCancel} 
          fullWidth={isMobile}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
          fullWidth={isMobile}
        >
          {loading ? (sale ? 'Actualizando...' : 'Creando...') : (sale ? 'Actualizar Venta' : 'Crear Venta')}
        </Button>
      </Box>

      {/* Validation Errors */}
      {!isFormValid() && saleItems.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {getValidationErrors().map((error, index) => (
            <FormHelperText key={index} error sx={{ mb: 0.5 }}>
              • {error}
            </FormHelperText>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default SaleForm
