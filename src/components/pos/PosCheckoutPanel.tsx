import React from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  TextField,
  MenuItem
} from '@mui/material'
import { formatCurrency } from '../../utils/currency'
import { LocalAtm, CreditCard, AccountBalanceWallet, RequestQuote } from '@mui/icons-material'

interface PosCheckoutPanelProps {
  total: number
  onCheckout: (data: CheckoutData) => void
  disabled: boolean
  loading: boolean
}

export interface CheckoutData {
  paymentMethod: 'CASH' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'TRANSFER' | 'PSE' | 'OTHER'
  isCredit: boolean
  paymentReference: string
}

const paymentMethods = [
  { id: 'CASH', label: 'Efectivo', icon: <LocalAtm /> },
  { id: 'CARD', label: 'Tarjeta', icon: <CreditCard /> },
  { id: 'TRANSFER', label: 'Transfer', icon: <AccountBalanceWallet /> },
  { id: 'CREDIT', label: 'Fiado/Crédito', icon: <RequestQuote />, isCredit: true }
]

const PosCheckoutPanel: React.FC<PosCheckoutPanelProps> = ({ total, onCheckout, disabled, loading }) => {
  const [selectedMethodId, setSelectedMethodId] = React.useState('CASH')
  const [paymentReference, setPaymentReference] = React.useState('')

  const handleCheckout = () => {
    const method = paymentMethods.find(m => m.id === selectedMethodId)
    onCheckout({
      paymentMethod: method?.isCredit ? 'OTHER' : (selectedMethodId as any),
      isCredit: method?.isCredit || false,
      paymentReference: method?.isCredit ? 'CREDITO' : paymentReference
    })
  }

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.1rem' }}>
        Resumen de Venta
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography fontWeight="medium">{formatCurrency(total)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Impuestos</Typography>
          <Typography fontWeight="medium">{formatCurrency(0)}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            {formatCurrency(total)}
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: 1 }}>
        Método de Pago
      </Typography>
      
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {paymentMethods.map((method) => (
          <Grid item xs={6} key={method.id}>
            <Button
              fullWidth
              variant={selectedMethodId === method.id ? 'contained' : 'outlined'}
              startIcon={method.icon}
              onClick={() => setSelectedMethodId(method.id)}
              sx={{ 
                justifyContent: 'flex-start', 
                height: 40,
                px: 1,
                fontSize: '0.8rem',
                borderRadius: 1.5,
                borderColor: selectedMethodId === method.id ? 'transparent' : 'divider',
                color: selectedMethodId === method.id ? 'primary.contrastText' : 'text.primary',
                bgcolor: selectedMethodId === method.id ? 'primary.main' : 'transparent',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: selectedMethodId === method.id ? 'primary.dark' : 'action.hover'
                }
              }}
            >
              {method.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Additional select for Nequi/Daviplata if Transfer is selected, or just reference field */}
      {selectedMethodId === 'TRANSFER' && (
        <TextField
          select
          fullWidth
          size="small"
          label="Plataforma"
          value={paymentReference}
          onChange={(e) => setPaymentReference(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="NEQUI">Nequi</MenuItem>
          <MenuItem value="DAVIPLATA">Daviplata</MenuItem>
          <MenuItem value="BANCOLOMBIA">Bancolombia</MenuItem>
          <MenuItem value="OTRO">Otro Banco</MenuItem>
        </TextField>
      )}

      {selectedMethodId === 'CARD' && (
        <TextField
          fullWidth
          size="small"
          label="Voucher / Referencia (Opcional)"
          value={paymentReference}
          onChange={(e) => setPaymentReference(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      {selectedMethodId === 'CREDIT' && (
        <Typography variant="body2" color="warning.main" sx={{ mb: 2, p: 1.5, bgcolor: 'warning.lighter', borderRadius: 2 }}>
          Esta venta se registrará como pendiente de pago y se creará una cuenta por cobrar asociada al cliente seleccionado.
        </Typography>
      )}

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={disabled || loading || total === 0}
          onClick={handleCheckout}
          sx={{ 
            height: 48, 
            borderRadius: 1.5, 
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
          }}
        >
          {loading ? 'Procesando...' : 'Cobrar'}
        </Button>
      </Box>
    </Paper>
  )
}

export default PosCheckoutPanel
