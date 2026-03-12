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
  useTheme,
} from '@mui/material'
import type { Purchase } from '../../types/purchases'
import { formatCurrency } from '../../utils/currency'

interface PurchasesTableProps {
  purchases: Purchase[]
  isLoading: boolean
}

const PurchasesTable: React.FC<PurchasesTableProps> = ({ purchases, isLoading }) => {
  const theme = useTheme()
  return (
    <TableContainer 
      sx={{ 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: 'none',
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Variante</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Costo Unit.</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">Cargando compras...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                <Typography variant="body2" color="text.secondary">No se encontraron compras</Typography>
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <TableRow key={purchase.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {purchase.variant?.product?.name || 'Producto desconocido'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {purchase.variant ? `${purchase.variant.size} - ${purchase.variant.color || 'SC'} - ${purchase.variant.gender === 'male' ? 'M' : purchase.variant.gender === 'female' ? 'F' : 'U'}` : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {purchase.supplier ? purchase.supplier.name : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {purchase.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatCurrency(purchase.unit_cost)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
