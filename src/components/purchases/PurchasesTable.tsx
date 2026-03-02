import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'
import type { Purchase } from '../../types/purchases'
import { formatCurrency } from '../../utils/currency'

interface PurchasesTableProps {
  purchases: Purchase[]
  isLoading: boolean
}

const PurchasesTable: React.FC<PurchasesTableProps> = ({ purchases, isLoading }) => {
  return (
    <TableContainer component={Paper}>
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
              <TableCell colSpan={7} align="center">
                Cargando compras...
              </TableCell>
            </TableRow>
          ) : purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No se encontraron compras
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <TableRow key={purchase.id} hover>
                <TableCell>
                  {new Date(purchase.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {purchase.variant?.product?.name || 'Producto desconocido'}
                  </Typography>
                  {purchase.observation && (
                    <Typography variant="caption" color="text.secondary">
                      {purchase.observation}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {purchase.variant ? `${purchase.variant.size} - ${purchase.variant.color || 'Sin color'} - ${purchase.variant.gender === 'male' ? 'Masculino' : purchase.variant.gender === 'female' ? 'Femenino' : 'Unisex'}` : 'Variante desconocida'}
                </TableCell>
                <TableCell>
                  {purchase.supplier ? purchase.supplier.name : '-'}
                </TableCell>
                <TableCell>{purchase.quantity}</TableCell>
                <TableCell>{formatCurrency(purchase.unit_cost)}</TableCell>
                <TableCell>{formatCurrency(purchase.total_cost)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PurchasesTable
