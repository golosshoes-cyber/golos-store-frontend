import React from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
} from '@mui/material'
import {
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import { ProductVariant } from '../../types'

interface InventoryTableProps {
  variants: ProductVariant[]
  getProductInfo: (productId: number | string) => { name: string; brand: string }
  getStockStatus: (stock: number) => { label: string; color: 'success' | 'warning' | 'error' | 'info' }
  onAdjustStock: (variant: ProductVariant) => void
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  variants,
  getProductInfo,
  getStockStatus,
  onAdjustStock,
}) => {
  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Talla/Color</TableCell>
            <TableCell align="center">Stock</TableCell>
            <TableCell align="center">Precio</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variants.map((variant) => {
            const stockStatus = getStockStatus(variant.stock)
            const productInfo = getProductInfo(variant.product)

            return (
              <TableRow key={variant.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {productInfo.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {productInfo.brand}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {variant.sku}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {variant.size} • {variant.color || 'Sin color'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {variant.stock}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    ${variant.price}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={stockStatus.label}
                    color={stockStatus.color}
                    size="small"
                    icon={variant.stock < 10 ? <WarningIcon /> : <TrendingUpIcon />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={<EditIcon />}
                    onClick={() => onAdjustStock(variant)}
                  >
                    Ajustar
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default InventoryTable
