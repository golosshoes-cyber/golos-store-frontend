import React, { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { ProductVariant } from '../../types'
import DialogShell from '../common/DialogShell'

interface InventoryAdjustmentDialogProps {
  open: boolean
  variant: ProductVariant | null
  productInfo?: { name: string; brand: string }
  onClose: () => void
  onSave: (variantId: number, newStock: number, reason: string) => void
  loading?: boolean
}

const InventoryAdjustmentDialog: React.FC<InventoryAdjustmentDialogProps> = ({
  open,
  variant,
  productInfo,
  onClose,
  onSave,
  loading = false,
}) => {
  const theme = useTheme()
  const [newStock, setNewStock] = useState('')
  const [reason, setReason] = useState('')

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
      dialogTitle="Ajustar Inventario"
      subtitle="Modifica el stock actual de esta variante"
      actions={
        <>
          <Button
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 2,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              '&:hover': { borderColor: 'text.disabled', color: 'text.primary' },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              loading ||
              newStock === '' ||
              isNaN(parseInt(newStock)) ||
              parseInt(newStock) < 0 ||
              !reason.trim()
            }
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 2,
              bgcolor: 'text.primary',
              color: 'background.default',
              '&:hover': { bgcolor: 'text.secondary' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : 'Guardar Ajuste'}
          </Button>
        </>
      }
    >
      {/* Current info */}
      <Box sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: alpha(theme.palette.text.primary, 0.02),
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        mb: 2,
      }}>
        {/* Producto y Variante */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            {productInfo?.name || 'Producto'}
          </Typography>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
            {variant.size && `Talla ${variant.size}`} {variant.color && `• ${variant.color}`} {variant.gender && `• ${variant.gender}`}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
          <Box>
            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>SKU</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{variant.sku || `VAR-${variant.id}`}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Stock actual</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{variant.stock} uds</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>Precio</Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>${Number(variant.price)?.toLocaleString('es-CO')}</Typography>
          </Box>
        </Box>
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Nuevo stock"
        type="number"
        value={newStock}
        onChange={(e) => setNewStock(e.target.value)}
        inputProps={{ min: '0' }}
        sx={{ mb: 1.5 }}
        InputLabelProps={{ sx: { fontSize: '12px' } }}
        InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
        helperText={
          newStock !== '' && !isNaN(parseInt(newStock))
            ? `Cambio: ${stockDifference > 0 ? '+' : ''}${stockDifference} unidades`
            : 'Ingrese la cantidad actualizada'
        }
      />

      <TextField
        fullWidth
        size="small"
        label="Motivo del ajuste"
        multiline
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Ej: Venta, devolución, corrección de inventario..."
        helperText="Especificar el motivo del ajuste es obligatorio"
        InputLabelProps={{ sx: { fontSize: '12px' } }}
        InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
      />
    </DialogShell>
  )
}

export default InventoryAdjustmentDialog
