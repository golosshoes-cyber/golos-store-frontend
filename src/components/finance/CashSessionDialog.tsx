import React, { useState } from 'react'
import {
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
} from '@mui/material'
import DialogShell from '../common/DialogShell'
import { formatCurrency } from '../../utils/currency'
import { useTheme, alpha } from '@mui/material/styles'

interface CashSessionDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: any) => void
  mode: 'open' | 'close'
  loading?: boolean
  expectedBalance?: number
}

const CashSessionDialog: React.FC<CashSessionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  mode,
  loading,
  expectedBalance = 0
}) => {
  const theme = useTheme()
  const [balance, setBalance] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'open') {
      onConfirm({ initial_balance: parseFloat(balance), notes })
    } else {
      onConfirm({ actual_balance: parseFloat(balance), notes })
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      dense
      title={mode === 'open' ? 'Apertura de Caja' : 'Cierre de Caja'}
      subtitle={mode === 'open' 
        ? 'Ingresa el saldo inicial disponible' 
        : 'Registra el dinero físico para cerrar'}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={1.8} sx={{ mt: 0.5 }}>
          {mode === 'close' && (
            <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.04), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>Saldo Esperado</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(expectedBalance)}
              </Typography>
            </Box>
          )}
          
          <TextField
            label={mode === 'open' ? 'Saldo Inicial' : 'Saldo Físico Real'}
            type="number"
            fullWidth
            required
            autoFocus
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '13px' }}>$</Typography>
                </InputAdornment>
              ),
            }}
            placeholder="0.00"
            sx={{
              '& .MuiInputBase-root': { fontSize: '14px', fontWeight: 600 },
              '& .MuiInputLabel-root': { fontSize: '13px' }
            }}
          />
          
          <TextField
            label="Observaciones"
            multiline
            rows={2}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Opcional..."
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
            sx={{ color: 'text.secondary', fontSize: '12px', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            size="small"
            disableElevation
            color={mode === 'open' ? 'primary' : 'error'}
            disabled={loading}
            sx={{ px: 3, borderRadius: 1.5, fontWeight: 700, fontSize: '12px', textTransform: 'none' }}
          >
            {loading ? 'Procesando...' : (mode === 'open' ? 'Abrir Caja' : 'Cerrar Caja')}
          </Button>
        </Box>
      </form>
    </DialogShell>
  )
}

export default CashSessionDialog
