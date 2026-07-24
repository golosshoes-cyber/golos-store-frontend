import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import type { Product, ProductVariant } from '../../types'

interface PosProductSelectorProps {
  onAddToCart: (variant: ProductVariant, quantity: number) => void
}

const PosProductSelector: React.FC<PosProductSelectorProps> = ({ onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['pos-products'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
    staleTime: 5 * 60_000,
  })

  const { data: variantsData, isLoading: isLoadingVariants } = useQuery({
    queryKey: ['pos-variants'],
    queryFn: () => productService.getVariants({ limit: 1000 }),
    staleTime: 5 * 60_000,
  })

  const products = productsData?.results || []
  const variants = variantsData?.results || []
  
  // Filter out products without variants or without stock
  const availableProducts = products.filter(p => {
    return variants.some(v => v.product === p.id && v.stock > 0 && v.active && !v.is_deleted)
  })

  const availableVariants = selectedProduct 
    ? variants.filter(v => v.product === selectedProduct.id && v.stock > 0 && v.active && !v.is_deleted)
    : []

  const handleProductChange = (newValue: Product | null) => {
    setSelectedProduct(newValue)
    setSelectedVariant(null) // Reset variant when product changes
  }

  const handleAdd = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      onAddToCart(selectedVariant, 1)
      setSelectedProduct(null)
      setSelectedVariant(null)
    }
  }

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
        {/* Product Selector */}
        <Box sx={{ flex: '1 1 250px' }}>
        <Autocomplete
          options={availableProducts}
          getOptionLabel={(option) => `${option.name} ${option.brand ? `(${option.brand})` : ''}`}
          value={selectedProduct}
          onChange={(_, newValue) => handleProductChange(newValue)}
          loading={isLoadingProducts || isLoadingVariants}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nombre"
              placeholder="Buscar producto..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {(isLoadingProducts || isLoadingVariants) ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
        />
        </Box>

        {/* Variant/Size Selector */}
        <Box sx={{ flex: '1 1 200px' }}>
          <Autocomplete
          options={availableVariants}
          getOptionLabel={(option) => {
            const parts = [option.size]
            if (option.color) parts.push(option.color)
            return parts.join(' - ')
          }}
          value={selectedVariant}
          onChange={(_, newValue) => setSelectedVariant(newValue)}
          disabled={!selectedProduct || availableVariants.length === 0}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Talla / Color"
              placeholder={!selectedProduct ? 'Selecciona un producto primero' : 'Seleccionar...'}
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
        />
        </Box>

        {/* Stock and Button Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 24 }}>
            <Typography variant="caption" color="text.secondary">Stock:</Typography>
            {selectedVariant ? (
              <Chip 
                label={selectedVariant.stock} 
                size="small"
                color={selectedVariant.stock > 5 ? 'success' : 'warning'}
                sx={{ fontWeight: 'bold', height: 20, fontSize: '0.7rem' }}
              />
            ) : (
              <Typography variant="caption" color="text.disabled">--</Typography>
            )}
          </Box>
          <Button
            variant="contained"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={handleAdd}
            sx={{ borderRadius: 1.5, height: 40 }}
          >
            Agregar
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default PosProductSelector
