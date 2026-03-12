import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid,
  TextField,
  Autocomplete,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import type { PurchaseItem, VariantOption } from '../../types/purchases'
import type { ProductVariant, Supplier, Product } from '../../types'

interface PurchaseItemCardProps {
  item: PurchaseItem
  index: number
  variantOptions: VariantOption[]
  allProducts: Product[]
  suppliers: Supplier[]
  onItemChange: (index: number, field: string, value: string | boolean) => void
  onVariantChange: (index: number, variantId: string, variants: ProductVariant[]) => void
  onRemove: (index: number) => void
}

const PurchaseItemCard: React.FC<PurchaseItemCardProps> = ({
  item,
  index,
  variantOptions,
  allProducts,
  suppliers,
  onItemChange,
  onVariantChange,
  onRemove,
}) => {
  const theme = useTheme()
  return (
    <Box 
      sx={{ 
        borderRadius: 2, 
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header del Card */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Item #{index + 1}
          </Typography>
          <IconButton 
            onClick={() => onRemove(index)} 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08), color: 'error.main' }
            }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Checkbox Nueva Variante */}
        <FormControlLabel
          control={
            <Checkbox
              checked={item.isNew}
              onChange={(e) => onItemChange(index, 'isNew', e.target.checked)}
              size="small"
            />
          }
          label="Crear nueva variante"
          sx={{ mb: 2 }}
        />

        {/* Campos del formulario */}
        <Grid container spacing={2}>
          {item.isNew ? (
            <>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Producto"
                  value={item.newProductId}
                  onChange={(e) => onItemChange(index, 'newProductId', e.target.value)}
                  size="small"
                  fullWidth
                >
                  {allProducts.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Talla"
                  value={item.newSize}
                  onChange={(e) => onItemChange(index, 'newSize', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Color"
                  value={item.newColor}
                  onChange={(e) => onItemChange(index, 'newColor', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Género"
                  value={item.newGender}
                  onChange={(e) => onItemChange(index, 'newGender', e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="male">Masculino</MenuItem>
                  <MenuItem value="female">Femenino</MenuItem>
                  <MenuItem value="unisex">Unisex</MenuItem>
                </TextField>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Autocomplete
                options={variantOptions}
                getOptionLabel={(option) => option.label}
                value={variantOptions.find(v => v.id === parseInt(item.variantId)) || null}
                onChange={(_, newValue) => {
                  onVariantChange(index, newValue ? newValue.id.toString() : '', [])
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Variante" size="small" />
                )}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Cantidad"
              value={item.quantity}
              onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
              size="small"
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Costo Unit."
              value={item.unitCost}
              onChange={(e) => onItemChange(index, 'unitCost', e.target.value)}
              size="small"
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Proveedor"
              value={item.supplierId}
              onChange={(e) => onItemChange(index, 'supplierId', e.target.value)}
              size="small"
              fullWidth
            >
              <MenuItem value="">
                <em>Sin proveedor</em>
              </MenuItem>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default PurchaseItemCard
