import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material'
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material'
import type { Purchase } from '../../types/purchases'
import { formatCurrency } from '../../utils/currency'

interface PurchasesTableProps {
  purchases: Purchase[]
  isLoading: boolean
  currentSort: string
  onSortChange: (sort: string) => void
}

const PurchasesTable: React.FC<PurchasesTableProps> = ({ 
  purchases, 
  isLoading,
  currentSort,
  onSortChange,
}) => {
  const theme = useTheme()

  // Lógica de ordenamiento interactivo
  const handleSortToggle = (field: string) => {
    if (currentSort === `${field}-asc`) {
      onSortChange(`${field}-desc`)
    } else {
      onSortChange(`${field}-asc`)
    }
  }

  const getSortIcon = (field: string) => {
    if (currentSort === `${field}-asc`) return <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
    if (currentSort === `${field}-desc`) return <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
    return null
  }

  return (
    <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <TableRow>
            <TableCell 
              onClick={() => onSortChange(currentSort === 'newest' ? 'oldest' : 'newest')}
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, fontWeight: 700, py: 1.2, pl: 2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Fecha {currentSort === 'newest' ? <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} /> : currentSort === 'oldest' ? <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} /> : null}
              </Box>
            </TableCell>
            <TableCell 
              onClick={() => handleSortToggle('product')}
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Producto {getSortIcon('product')}
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', borderBottom: `1px solid ${theme.palette.divider}` }}>
              Proveedor
            </TableCell>
            <TableCell 
              onClick={() => handleSortToggle('quantity')}
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', borderBottom: `1px solid ${theme.palette.divider}` }}
              align="right"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                Cant {getSortIcon('quantity')}
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', borderBottom: `1px solid ${theme.palette.divider}` }} align="right">
              Costo Unit.
            </TableCell>
            <TableCell 
              onClick={() => handleSortToggle('total')}
              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase', borderBottom: `1px solid ${theme.palette.divider}` }}
              align="right"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                Total {getSortIcon('total')}
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">Cargando compras...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                <Typography variant="body2" color="text.secondary">No se encontraron compras</Typography>
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <TableRow 
                key={purchase.id}
                hover
                sx={{ 
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) }
                }}
              >
                <TableCell sx={{ py: 1.2, pl: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                      {purchase.variant?.product?.name || 'Producto desconocido'}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>
                      {purchase.variant ? `${purchase.variant.size} - ${purchase.variant.color || 'SC'} - ${purchase.variant.gender === 'male' ? 'M' : purchase.variant.gender === 'female' ? 'F' : 'U'}` : '-'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '12px' }}>
                    {purchase.supplier ? purchase.supplier.name : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                    {purchase.quantity} <Box component="span" sx={{ fontSize: '10px', fontWeight: 400, color: 'text.disabled' }}>uds</Box>
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                    {formatCurrency(purchase.unit_cost)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary' }}>
                    {formatCurrency(purchase.total_cost)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PurchasesTable
