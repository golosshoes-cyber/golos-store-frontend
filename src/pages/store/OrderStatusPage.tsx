import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { isAxiosError } from 'axios'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { storeService } from '../../services/storeService'
import { useAuth } from '../../contexts/AuthContext'
import type { StoreOrder } from '../../types/store'
import ShipmentStatus from '../../components/shipping/ShipmentStatus'
import ShipmentTracker from '../../components/shipping/ShipmentTracker'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const money = (value: string) => currencyFormatter.format(Number(value))

const formatDateTime = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
}

const statusChipColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
  const normalized = status.toLowerCase()
  if (['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(normalized)) return 'success'
  if (normalized === 'pending') return 'warning'
  if (normalized === 'canceled') return 'error'
  return 'default'
}

export default function OrderStatusPage() {
  const theme = useTheme()
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  const [saleId, setSaleId] = useState(searchParams.get('sale_id') || '')
  const [customerQuery, setCustomerQuery] = useState(searchParams.get('customer') || '')
  const [customerContact, setCustomerContact] = useState(searchParams.get('customer_contact') || '')
  const [paymentMethod, setPaymentMethod] = useState('PSE')

  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null)

  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [successSeverity, setSuccessSeverity] = useState<'success' | 'warning'>('success')

  const getVerifyMessageByStatus = (status: string): { kind: 'success' | 'warning'; text: string } => {
    const normalized = status.toUpperCase()
    if (normalized === 'APPROVED') {
      return { kind: 'success', text: 'Pago aprobado y pedido actualizado correctamente.' }
    }
    if (['DECLINED', 'ERROR', 'VOIDED'].includes(normalized)) {
      return { kind: 'warning', text: `Pago rechazado/fallido: ${normalized}.` }
    }
    return { kind: 'warning', text: `Pago sincronizado: ${normalized}.` }
  }

  const canPay = useMemo(() => {
    if (!selectedOrder) return false
    return selectedOrder.status === 'pending' && selectedOrder.payment_status !== 'paid'
  }, [selectedOrder])

  const handleSearch = async () => {
    const id = saleId ? Number(saleId) : undefined
    if (!id && !customerQuery.trim()) {
      setErrorMessage('Ingresa numero de pedido o nombre/contacto para consultar.')
      return
    }

    if (customerQuery.trim() && !isAuthenticated && customerContact.trim().length < 4) {
      setErrorMessage('Para buscar por cliente, ingresa al menos 4 digitos del contacto del pedido.')
      return
    }

    if (saleId && Number.isNaN(id)) {
      setErrorMessage('El numero de pedido es invalido.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await storeService.lookupOrders({
        sale_id: id,
        customer: customerQuery.trim() || undefined,
        customer_contact: customerContact.trim() || undefined,
      })

      setOrders(response.orders)
      if (response.orders.length === 1) {
        setSelectedOrder(response.orders[0])
        setSaleId(String(response.orders[0].sale_id))
      } else {
        setSelectedOrder(null)
      }
    } catch {
      setOrders([])
      setSelectedOrder(null)
      setErrorMessage('No se encontraron pedidos con ese criterio.')
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (!selectedOrder) {
      setErrorMessage('Selecciona un pedido para continuar con el pago.')
      return
    }

    if (!customerContact.trim() && !isAuthenticated) {
      setErrorMessage('Para pagar sin sesion, ingresa el contacto del pedido (o los ultimos 4).')
      return
    }

    try {
      setPaying(true)
      setErrorMessage(null)
      const response = await storeService.payOrder(selectedOrder.sale_id, customerContact.trim(), paymentMethod)
      if (response.payment.checkout_url) {
        window.location.href = response.payment.checkout_url
        return
      }
      setSuccessMessage('Checkout generado correctamente.')
      setSelectedOrder(response.order)
      setOrders((prev) => prev.map((order) => (order.sale_id === response.order.sale_id ? response.order : order)))
    } catch {
      setErrorMessage('No se pudo iniciar el pago con Wompi.')
    } finally {
      setPaying(false)
    }
  }

  const verifyFromRedirect = async () => {
    const transactionId = searchParams.get('id')
    const id = saleId ? Number(saleId) : undefined

    if (!transactionId || !id) return
    if (!customerContact.trim() && !isAuthenticated) return

    try {
      setVerifying(true)
      setErrorMessage(null)
      setSuccessMessage(null)
      setSuccessSeverity('success')
      const response = await storeService.verifyWompiTransaction(id, customerContact.trim(), transactionId)
      setSelectedOrder(response.order)
      setOrders((prev) => {
        const exists = prev.some((order) => order.sale_id === response.order.sale_id)
        if (!exists) return [response.order]
        return prev.map((order) => (order.sale_id === response.order.sale_id ? response.order : order))
      })
      const verifyMessage = getVerifyMessageByStatus(response.transaction.status)
      setSuccessSeverity(verifyMessage.kind)
      setSuccessMessage(verifyMessage.text)
    } catch (error) {
      if (isAxiosError(error)) {
        const detail = (error.response?.data as { detail?: string } | undefined)?.detail
        setErrorMessage(detail || 'No se pudo verificar la transaccion de Wompi.')
      } else {
        setErrorMessage('No se pudo verificar la transaccion de Wompi.')
      }
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    if (saleId || customerQuery || customerContact || searchParams.get('id')) {
      void handleSearch()
      void verifyFromRedirect()
    }
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.25}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ReceiptLongRoundedIcon color="primary" />
                <Box>
                  <Typography variant="h5" fontWeight={800}>Estado del pedido</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Busca por numero de pedido o por nombre del cliente. Para busqueda por cliente, valida con contacto.
                  </Typography>
                </Box>
              </Stack>
              <Button component={RouterLink} to="/store" variant="outlined" startIcon={<ArrowBackRoundedIcon />}>
                Volver a tienda
              </Button>
            </Stack>
          </Paper>

          {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>}
          {successMessage && (
            <Alert severity={successSeverity} onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          {verifying && <Alert severity="info">Verificando transaccion de Wompi...</Alert>}

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                <TextField
                  fullWidth
                  label="Numero de pedido (opcional)"
                  value={saleId}
                  onChange={(event) => setSaleId(event.target.value)}
                />
                <TextField
                  fullWidth
                  label="Nombre del cliente (opcional)"
                  value={customerQuery}
                  onChange={(event) => setCustomerQuery(event.target.value)}
                />
                <TextField
                  fullWidth
                  label="Contacto para verificar (ultimos 4 minimo)"
                  value={customerContact}
                  onChange={(event) => setCustomerContact(event.target.value)}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => void handleSearch()}
                  disabled={loading}
                  sx={{ minWidth: { md: 140 } }}
                >
                  {loading ? 'Consultando...' : 'Consultar'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {orders.length > 1 && (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Resultados ({orders.length})</Typography>
                <Stack spacing={1} divider={<Divider flexItem />}>
                  {orders.map((order) => (
                    <Stack key={order.sale_id} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
                      <Box>
                        <Typography fontWeight={700}>Pedido #{order.sale_id}</Typography>
                        <Typography variant="body2" color="text.secondary">{formatDateTime(order.created_at)}</Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Chip label={order.status_detail.label} color={statusChipColor(order.status)} size="small" />
                        <Chip label={`Pago: ${order.payment_status}`} size="small" color={statusChipColor(order.payment_status)} />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedOrder(order)
                            setSaleId(String(order.sale_id))
                          }}
                        >
                          Ver detalle
                        </Button>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {selectedOrder && (
            <Stack spacing={2}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1}>
                      <Typography variant="h6" fontWeight={800}>Pedido #{selectedOrder.sale_id}</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label={selectedOrder.status_detail.label} color={statusChipColor(selectedOrder.status)} size="small" />
                        <Chip label={`Pago: ${selectedOrder.payment_status}`} size="small" color={statusChipColor(selectedOrder.payment_status)} />
                      </Stack>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Typography variant="body1">Total: <strong>{money(selectedOrder.total)}</strong></Typography>
                      {selectedOrder.payment_reference && (
                        <Typography variant="body2" color="text.secondary">Ref: {selectedOrder.payment_reference}</Typography>
                      )}
                    </Stack>
                    {selectedOrder.payment_method_preference && (
                      <Typography variant="caption" color="text.secondary">
                        Metodo preferido: {selectedOrder.payment_method_preference}
                      </Typography>
                    )}
                    {selectedOrder.payment_method && (
                      <Typography variant="caption" color="text.secondary">
                        Metodo confirmado: {selectedOrder.payment_method}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">Creado: {formatDateTime(selectedOrder.created_at)}</Typography>
                    <Typography variant="caption" color="text.secondary">Ultima actualizacion: {formatDateTime(selectedOrder.updated_at)}</Typography>
                    {selectedOrder.shipping_address && (
                      <Typography variant="caption" color="text.secondary">
                        Envio: {selectedOrder.shipping_address.address_line1}, {selectedOrder.shipping_address.city} ({selectedOrder.shipping_address.department})
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {canPay && (
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PaymentsRoundedIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight={700}>Pagar con Wompi</Typography>
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                        <TextField
                          select
                          size="small"
                          label="Metodo"
                          value={paymentMethod}
                          onChange={(event) => setPaymentMethod(event.target.value)}
                          sx={{ minWidth: { xs: '100%', sm: 180 } }}
                        >
                          <MenuItem value="PSE">PSE</MenuItem>
                          <MenuItem value="CARD">Tarjeta</MenuItem>
                          <MenuItem value="NEQUI">Nequi</MenuItem>
                        </TextField>
                        <Button variant="contained" onClick={() => void handlePay()} disabled={paying}>
                          {paying ? 'Conectando...' : 'Ir a pagar'}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1.25}>
                    <TimelineRoundedIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>Timeline</Typography>
                  </Stack>

                  <Stack spacing={1.25}>
                    {selectedOrder.timeline.map((event, index) => (
                      <Box key={`${event.code}-${event.at}`} sx={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 1.25 }}>
                        <Box sx={{ position: 'relative', pt: 0.2 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: index === 0 ? 'primary.main' : alpha(theme.palette.text.primary, 0.45),
                            }}
                          />
                          {index < selectedOrder.timeline.length - 1 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                left: 4.2,
                                top: 12,
                                bottom: -16,
                                width: 2,
                                backgroundColor: alpha(theme.palette.text.primary, 0.18),
                              }}
                            />
                          )}
                        </Box>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.5}>
                          <Typography variant="body2" fontWeight={600}>{event.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatDateTime(event.at)}</Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1.25}>
                    <ShoppingBagRoundedIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>Items</Typography>
                  </Stack>

                  <Stack spacing={1} divider={<Divider flexItem />}>
                    {selectedOrder.items.map((item) => (
                      <Stack key={`${item.variant_id}-${item.product_name}`} direction="row" justifyContent="space-between" gap={2}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{item.product_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.variant_info} x {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700}>{money(item.subtotal)}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {selectedOrder.shipment && (
                <Stack spacing={2}>
                  <ShipmentStatus
                    status={selectedOrder.shipment.status}
                    trackingNumber={selectedOrder.shipment.tracking_number}
                    labelUrl={selectedOrder.shipment.label_url}
                  />
                  <ShipmentTracker trackingNumber={selectedOrder.shipment.tracking_number} />
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  )
}


