import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  useTheme,
  alpha,
  IconButton,
  Box,
} from '@mui/material'
import {
  Edit as EditIcon,
} from '@mui/icons-material'

interface InventoryTableProps {
  variants: any[]
  getProductInfo: (productId: number) => any
  getStockStatus: (stock: number) => { label: string; color: any }
  onAdjustStock: (variant: any) => void
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  variants,
  getProductInfo,
  getStockStatus,
  onAdjustStock,
}) => {
  const theme = useTheme()
  return (
    <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Talla/Color</TableCell>
            <TableCell>Género</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variants.map((variant) => {
            const productInfo = getProductInfo(variant.product)
            const status = getStockStatus(variant.stock)

            return (
              <TableRow key={variant.id}>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {productInfo?.name || 'Producto desconocido'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {variant.sku}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {variant.size} - {variant.color || 'SC'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {variant.gender}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{
                    display: 'inline-flex',
                    px: 1,
                    py: 0.25,
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    bgcolor: alpha(theme.palette[status.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main, 0.08),
                    color: `${status.color}.main`,
                    border: `1px solid ${alpha(theme.palette[status.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main, 0.2)}`
                  }}>
                    {variant.stock} ({status.label})
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" gap={0.5} justifyContent="flex-end">
                    <Tooltip title="Ajustar Stock">
                      <IconButton
                        size="small"
                        onClick={() => onAdjustStock(variant)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main' }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
