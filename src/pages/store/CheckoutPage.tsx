import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded'
import GavelRoundedIcon from '@mui/icons-material/GavelRounded'
import { isAxiosError } from 'axios'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import type { StoreCartValidationItem, StoreCommercialSummary, StoreShippingAddress } from '../../types/store'
import { clearStoreCart, getStoreCartItems } from '../../utils/storeCart'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const money = (value: string) => currencyFormatter.format(Number(value))
const isLikelyPhone = (value: string): boolean => /^\d{7,15}$/.test(value.trim())

export default function CheckoutPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [items, setItems] = useState<StoreCartValidationItem[]>([])
  const [total, setTotal] = useState('0')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [commercial, setCommercial] = useState<StoreCommercialSummary | null>(null)
  const [shippingZone, setShippingZone] = useState<'local' | 'regional' | 'national'>('regional')
  const [estimatedWeightGrams, setEstimatedWeightGrams] = useState<number>(900)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<StoreShippingAddress>({
    department: '',
    city: '',
    address_line1: '',
    address_line2: '',
    reference: '',
    postal_code: '',
    recipient_name: '',
    recipient_phone: '',
  })

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/store/register?next=%2Fstore%2Fcheckout', { replace: true })
      return
    }

    const loadPreview = async () => {
      const cartItems = getStoreCartItems()
      if (cartItems.length === 0) {
        setErrorMessage('Tu carrito esta vacio. Agrega productos antes de continuar.')
        return
      }

      try {
        setLoading(true)
        const response = await storeService.validateCart(cartItems, {
          shipping_zone: shippingZone,
          estimated_weight_grams: estimatedWeightGrams,
        })
        setItems(response.items)
        setTotal(response.total)
        setCommercial(response.commercial || null)
      } catch {
        setErrorMessage('No se pudo validar el carrito para checkout.')
      } finally {
        setLoading(false)
      }
    }

    void loadPreview()
  }, [authLoading, isAuthenticated, navigate, shippingZone, estimatedWeightGrams])

  useEffect(() => {
    if (!user) return
    setShippingAddress((prev) => ({
      ...prev,
      recipient_name: prev.recipient_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
      recipient_phone: prev.recipient_phone || (isLikelyPhone(user.username || '') ? user.username : ''),
    }))
  }, [user])

  const handleCheckout = async () => {
    if (!user) {
      setErrorMessage('Debes iniciar sesion para continuar con el checkout.')
      return
    }
    if (!acceptTerms) {
      setErrorMessage('Debes aceptar los terminos y condiciones para continuar.')
      return
    }
    if (
      !shippingAddress.department.trim()
      || !shippingAddress.city.trim()
      || !shippingAddress.address_line1.trim()
      || !shippingAddress.recipient_name.trim()
      || !shippingAddress.recipient_phone.trim()
    ) {
      setErrorMessage('Completa los datos obligatorios de direccion de envio.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)

      const customerName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
      const customerContact = shippingAddress.recipient_phone.trim()
      const cartItems = getStoreCartItems()
      const response = await storeService.checkout({
        customer_name: customerName,
        customer_contact: customerContact,
        items: cartItems,
        is_order: true,
        shipping_zone: shippingZone,
        estimated_weight_grams: estimatedWeightGrams,
        shipping_address: shippingAddress,
      })

      clearStoreCart()
      setSuccessMessage(`Pedido creado: #${response.order.sale_id}`)

      setTimeout(() => {
        navigate(`/store/order-status?sale_id=${response.order.sale_id}&customer_contact=${encodeURIComponent(customerContact)}`)
      }, 500)
    } catch (error) {
      if (isAxiosError(error)) {
        const payload = error.response?.data as { detail?: string; commercial?: StoreCommercialSummary } | undefined
        if (payload?.commercial) {
          setCommercial(payload.commercial)
        }
        setErrorMessage(payload?.detail || 'No se pudo completar el checkout. Verifica stock e intenta de nuevo.')
      } else {
        setErrorMessage('No se pudo completar el checkout. Verifica stock e intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Stepper activeStep={1} alternativeLabel>
            <Step>
              <StepLabel>Carrito</StepLabel>
            </Step>
            <Step>
              <StepLabel>Datos de envio</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirmacion</StepLabel>
            </Step>
          </Stepper>
        </Paper>

        <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Typography variant="h4" fontWeight={700}>Finalizar compra</Typography>
          <Button
            component={RouterLink}
            to="/store/cart"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ fontWeight: 700, transition: 'all 180ms ease', '&:hover': { transform: 'translateY(-1px)' }, width: { xs: '100%', sm: 'auto' } }}
          >
            {isMobile ? 'Volver' : 'Volver al carrito'}
          </Button>
        </Box>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Datos de la cuenta</Typography>
              <Typography variant="body2" color="text.secondary">
                Nombre: {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contacto: {user?.email || user?.username || '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Para reducir errores, esta pantalla usa automaticamente los datos de tu cuenta.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  select
                  label="Zona de envio"
                  value={shippingZone}
                  onChange={(event) => setShippingZone(event.target.value as 'local' | 'regional' | 'national')}
                  size="small"
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="local">Local</MenuItem>
                  <MenuItem value="regional">Regional</MenuItem>
                  <MenuItem value="national">Nacional</MenuItem>
                </TextField>
                <TextField
                  label="Peso estimado (g)"
                  type="number"
                  size="small"
                  value={estimatedWeightGrams}
                  onChange={(event) => setEstimatedWeightGrams(Math.max(1, Number(event.target.value) || 1))}
                  sx={{ minWidth: 180 }}
                />
              </Stack>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Direccion de envio</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    label="Departamento"
                    size="small"
                    value={shippingAddress.department}
                    onChange={(event) => setShippingAddress((prev) => ({ ...prev, department: event.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Ciudad"
                    size="small"
                    value={shippingAddress.city}
                    onChange={(event) => setShippingAddress((prev) => ({ ...prev, city: event.target.value }))}
                    fullWidth
                  />
                </Stack>
                <TextField
                  label="Direccion principal"
                  size="small"
                  value={shippingAddress.address_line1}
                  onChange={(event) => setShippingAddress((prev) => ({ ...prev, address_line1: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Complemento (opcional)"
                  size="small"
                  value={shippingAddress.address_line2 || ''}
                  onChange={(event) => setShippingAddress((prev) => ({ ...prev, address_line2: event.target.value }))}
                  fullWidth
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    label="Nombre receptor"
                    size="small"
                    value={shippingAddress.recipient_name}
                    onChange={(event) => setShippingAddress((prev) => ({ ...prev, recipient_name: event.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Telefono receptor"
                    size="small"
                    value={shippingAddress.recipient_phone}
                    onChange={(event) => setShippingAddress((prev) => ({ ...prev, recipient_phone: event.target.value }))}
                    fullWidth
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    label="Referencia (opcional)"
                    size="small"
                    value={shippingAddress.reference || ''}
                    onChange={(event) => setShippingAddress((prev) => ({ ...prev, reference: event.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Codigo postal (opcional)"
                    size="small"
                    value={shippingAddress.postal_code || ''}
                    onChange={(event) => setShippingAddress((prev) => ({ ...prev, postal_code: event.target.value }))}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>Resumen</Typography>
            <Stack spacing={1}>
              {items.map((item) => (
                <Box key={item.variant_id} display="flex" justifyContent="space-between" gap={2}>
                  <Typography variant="body2">
                    {item.product_name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>{money(item.subtotal)}</Typography>
                </Box>
              ))}
            </Stack>

            <Box mt={2} display="flex" justifyContent="space-between">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary.main">{money(total)}</Typography>
            </Box>
            {commercial && (
              <Stack mt={2} spacing={0.75}>
                <Typography variant="subtitle2">Estimado comercial</Typography>
                <Typography variant="caption" color="text.secondary">
                  Fee Wompi: {money(commercial.payment_fee_total)} | Envio: {money(commercial.shipping_estimate)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Costo variable: {money(commercial.variable_cost_total)} | Margen: {commercial.projected_margin_percent}%
                </Typography>
                <Alert severity={commercial.is_viable_online ? 'success' : 'warning'}>
                  {commercial.is_viable_online
                    ? 'Margen online viable con esta configuracion.'
                    : `Margen bajo para venta online (minimo ${commercial.min_margin_percent}%).`}
                </Alert>
              </Stack>
            )}

            <Box mt={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5}>
                <Button
                  component={RouterLink}
                  to="/store/terms"
                  variant="text"
                  size="small"
                  startIcon={<GavelRoundedIcon />}
                  sx={{ justifyContent: { xs: 'flex-start', sm: 'center' } }}
                >
                  {isMobile ? 'Terminos' : 'Ver terminos y condiciones'}
                </Button>
                <Button
                  component={RouterLink}
                  to="/store/privacy"
                  variant="text"
                  size="small"
                  startIcon={<PolicyRoundedIcon />}
                  sx={{ justifyContent: { xs: 'flex-start', sm: 'center' } }}
                >
                  {isMobile ? 'Privacidad' : 'Ver politica de datos'}
                </Button>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(event) => setAcceptTerms(event.target.checked)}
                />
                <label htmlFor="accept-terms">
                  <Typography variant="caption">
                    Acepto terminos y condiciones y politica de datos personales.
                  </Typography>
                </label>
              </Stack>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => void handleCheckout()}
                disabled={loading || items.length === 0 || !acceptTerms}
                startIcon={<CheckCircleRoundedIcon />}
                sx={{
                  fontWeight: 700,
                  px: 2.2,
                  width: { xs: '100%', sm: 'auto' },
                  transition: 'all 180ms ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                }}
              >
                {isMobile ? 'Confirmar pedido' : 'Confirmar y crear pedido'}
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip icon={<SecurityRoundedIcon />} label="Pago seguro" color="success" variant="outlined" />
              <Chip icon={<LocalShippingRoundedIcon />} label="Envio rastreable" color="primary" variant="outlined" />
              <Chip icon={<SupportAgentRoundedIcon />} label="Soporte por WhatsApp" color="default" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
