import React, { useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Box,
  InputAdornment,
  alpha,
  useTheme,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { financeService, FinancialCategory } from '../../services/financeService'
import DialogShell from '../common/DialogShell'

interface TransactionDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  type: 'income' | 'expense'
  loading?: boolean
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onClose,
  onSave,
  type,
  loading
}) => {
  const theme = useTheme()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const { data: categories } = useQuery({
    queryKey: ['financial-categories', type],
    queryFn: () => financeService.getCategories({ is_income: type === 'income', is_active: true }),
    enabled: open,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      amount: parseFloat(amount),
      description,
      category: category ? parseInt(category) : undefined,
      transaction_type: type,
      payment_method: paymentMethod
    })
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      dense
      title={type === 'income' ? 'Registrar Ingreso' : 'Registrar Egreso'}
      subtitle="Ingresa los detalles del movimiento"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                fontWeight: 700, 
                mb: 0.5, 
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}
            >
              Monto del movimiento *
            </Typography>
            <TextField
              type="number"
              fullWidth
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '14px', mr: 0.5 }}>$</Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.text.primary, 0.02),
                  '& .MuiInputBase-input': {
                    fontSize: '15px',
                    fontWeight: 700,
                    py: 1.1
                  }
                }
              }}
            />
          </Box>
          <TextField
            label="Categoría"
            select
            fullWidth
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories?.results && categories.results.length > 0 ? (
              categories.results.map((cat: FinancialCategory) => (
                <MenuItem key={cat.id} value={cat.id} sx={{ fontSize: '13px' }}>
                  {cat.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="" sx={{ fontSize: '13px' }}>
                {categories ? 'Sin categorías' : 'Cargando...'}
              </MenuItem>
            )}
          </TextField>
          <TextField
            label="Método de Pago"
            select
            fullWidth
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="cash">Efectivo (Caja)</MenuItem>
            <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
            <MenuItem value="card">Tarjeta</MenuItem>
          </TextField>
          <TextField
            label="Descripción / Nota"
            multiline
            rows={2}
            fullWidth
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Pago de arriendo local..."
            sx={{
              '& .MuiInputBase-root': { fontSize: '13px' },
              '& .MuiInputLabel-root': { fontSize: '13px' }
            }}
          />
        </Stack>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            onClick={onClose} 
            variant="text" 
            size="small"
            sx={{ 
              color: 'text.secondary',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            size="small"
            disableElevation
            color={type === 'income' ? 'success' : 'primary'}
            disabled={loading}
            sx={{ 
              px: 3,
              borderRadius: 1.5,
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'none'
            }}
          >
            {loading ? 'Guardando...' : 'Registrar'}
          </Button>
        </Box>
      </form>
    </DialogShell>
  )
}

export default TransactionDialog
