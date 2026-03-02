import React, { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material'
import { ProductVariant } from '../../types'
import InventoryAdjustmentHeader from './InventoryAdjustmentHeader'
import DialogShell from '../common/DialogShell'

interface InventoryAdjustmentDialogProps {
  open: boolean
  variant: ProductVariant | null
  onClose: () => void
  onSave: (variantId: number, newStock: number, reason: string) => void
  loading?: boolean
}

const InventoryAdjustmentDialog: React.FC<InventoryAdjustmentDialogProps> = ({
  open,
  variant,
  onClose,
  onSave,
  loading = false,
}) => {
  const [newStock, setNewStock] = useState('')
  const [reason, setReason] = useState('')

  // Reset form when dialog opens with a new variant
  React.useEffect(() => {
    if (open && variant) {
      setNewStock(variant.stock.toString())
      setReason('')
    }
  }, [open, variant])

  const handleSave = () => {
    if (variant && newStock !== '' && reason.trim()) {
      const stockValue = parseInt(newStock)
      if (!isNaN(stockValue) && stockValue >= 0) {
        onSave(variant.id, stockValue, reason.trim())
        onClose()
      }
    }
  }

  const handleClose = () => {
    setNewStock('')
    setReason('')
    onClose()
  }

  if (!variant) return null

  const stockDifference = newStock !== '' ? parseInt(newStock) - variant.stock : 0

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      scroll="paper"
      header={<InventoryAdjustmentHeader />}
      headerInTitle={false}
      actions={
        <>
          <Button
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              loading ||
              newStock === '' ||
              isNaN(parseInt(newStock)) ||
              parseInt(newStock) < 0 ||
              !reason.trim()
            }
          >
            {loading ? 'Guardando...' : 'Guardar Ajuste'}
          </Button>
        </>
      }
    >
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Información actual:
          </Typography>
          <Box sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="body2">
              <strong>SKU:</strong> {variant.sku || `VAR-${variant.id}`}
            </Typography>
            <Typography variant="body2">
              <strong>Stock actual:</strong> {variant.stock} unidades
            </Typography>
            <Typography variant="body2">
              <strong>Precio:</strong> ${Number(variant.price)?.toFixed(2) || '0.00'}
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Nuevo stock"
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          inputProps={{ min: '0' }}
          sx={{ mb: 2 }}
          helperText={
            newStock !== '' && !isNaN(parseInt(newStock))
              ? `Cambio: ${stockDifference > 0 ? '+' : ''}${stockDifference} unidades`
              : 'Ingrese la cantidad actualizada'
          }
        />

        <TextField
          fullWidth
          label="Motivo del ajuste"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ej: Venta, devolución, corrección de inventario..."
          helperText="Especificar el motivo del ajuste es obligatorio"
        />
    </DialogShell>
  )
}

export default InventoryAdjustmentDialog
