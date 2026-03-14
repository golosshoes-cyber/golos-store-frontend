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
  Inventory as InventoryIcon
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
  const isLight = theme.palette.mode === 'light'

  return (
    <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', pl: 2 }}>Producto</TableCell>
            <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Talla / Color / Género</TableCell>
            <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Estado de Stock</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', pr: 2 }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                <Typography variant="body2" color="text.secondary">No hay datos disponibles</Typography>
              </TableCell>
            </TableRow>
          ) : (
            variants.map((variant) => {
              const productInfo = getProductInfo(variant.product)
              const status = getStockStatus(variant.stock)

              return (
                <TableRow 
                  key={variant.id}
                  hover
                  sx={{ 
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) },
                  }}
                >
                  <TableCell sx={{ py: 1.2, pl: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Box sx={{ 
                        width: 28, height: 28, borderRadius: 1.2, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <InventoryIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '12px', lineHeight: 1.2 }}>
                          {productInfo?.name || 'Producto desconocido'}
                        </Typography>
                        <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                          {productInfo?.brand || 'Sin marca'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 500 }}>
                        Talla {variant.size} • {variant.color || 'Sin Color'}
                      </Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary', textTransform: 'capitalize' }}>
                        {variant.gender}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, minWidth: 24 }}>
                        {variant.stock}
                      </Typography>
                      <Box sx={{
                        px: 1,
                        py: 0.2,
                        borderRadius: 1,
                        fontSize: '9px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        bgcolor: alpha(theme.palette[status.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main, 0.1),
                        color: `${status.color}.main`,
                        border: `1px solid ${alpha(theme.palette[status.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main, 0.2)}`
                      }}>
                        {status.label}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <Tooltip title="Ajustar Stock" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onAdjustStock(variant)}
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: isLight ? '#f5f5f5' : alpha('#fff', 0.05),
                          color: 'text.secondary',
                          '&:hover': { 
                            bgcolor: alpha(theme.palette.primary.main, 0.1), 
                            color: 'primary.main',
                            transform: 'translateY(-1px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default InventoryTable
