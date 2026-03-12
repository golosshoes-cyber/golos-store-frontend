import React from 'react'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material'
import type { PurchaseFilters } from '../../types/purchases'
import type { Supplier } from '../../types'
import type { Product } from '../../types'

interface PurchaseFiltersProps {
  filters: PurchaseFilters
  suppliers: Supplier[]
  products: Product[]
  isMobile: boolean
  onFilterChange: (key: keyof PurchaseFilters, value: string) => void
}

const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({
  filters,
  suppliers,
  products,
  isMobile,
  onFilterChange,
}) => {
  const theme = useTheme()
  return (
    <>
      <Box 
        sx={{ 
          p: 2.5, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2} flexWrap="wrap">
          <TextField
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            size="small"
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02),
                borderRadius: 1.5,
              }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel sx={{ fontSize: '13px' }}>Proveedor</InputLabel>
            <Select
              value={filters.supplier}
              onChange={(e) => onFilterChange('supplier', e.target.value)}
              label="Proveedor"
              sx={{ borderRadius: 1.5, bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02) }}
            >
              <MenuItem value="" sx={{ fontSize: '13px' }}>
                <em>Todos los proveedores</em>
              </MenuItem>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id} sx={{ fontSize: '13px' }}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel sx={{ fontSize: '13px' }}>Producto</InputLabel>
            <Select
              value={filters.product}
              onChange={(e) => onFilterChange('product', e.target.value)}
              label="Producto"
              sx={{ borderRadius: 1.5, bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02) }}
            >
              <MenuItem value="" sx={{ fontSize: '13px' }}>
                <em>Todos los productos</em>
              </MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id} sx={{ fontSize: '13px' }}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Desde"
            type="date"
            value={filters.start_date}
            onChange={(e) => onFilterChange('start_date', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true, sx: { fontSize: '13px' } }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02)
              }
            }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={filters.end_date}
            onChange={(e) => onFilterChange('end_date', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true, sx: { fontSize: '13px' } }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02)
              }
            }}
          />
        </Box>
      </Box>
    </>
  )
}

export default PurchaseFilters
