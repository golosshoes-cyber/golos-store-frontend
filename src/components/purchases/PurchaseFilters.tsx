import React from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Filtros
        </Typography>
      </Box>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2} flexWrap="wrap">
          <TextField
            label="Buscar"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={filters.supplier}
              onChange={(e) => onFilterChange('supplier', e.target.value)}
              label="Proveedor"
            >
              <MenuItem value="">
                <em>Todos los proveedores</em>
              </MenuItem>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Producto</InputLabel>
            <Select
              value={filters.product}
              onChange={(e) => onFilterChange('product', e.target.value)}
              label="Producto"
            >
              <MenuItem value="">
                <em>Todos los productos</em>
              </MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Fecha inicio"
            type="date"
            value={filters.start_date}
            onChange={(e) => onFilterChange('start_date', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha fin"
            type="date"
            value={filters.end_date}
            onChange={(e) => onFilterChange('end_date', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Paper>
    </>
  )
}

export default PurchaseFilters
