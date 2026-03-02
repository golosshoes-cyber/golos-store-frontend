import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  Storefront as StorefrontIcon,
  VerifiedUserRounded as VerifiedUserRoundedIcon,
  CampaignRounded as CampaignRoundedIcon,
} from '@mui/icons-material'
import { storeService } from '../../services/storeService'
import type {
  StoreBranding,
  StoreOpsSummaryResponse,
  StoreOpsManualShipmentPayload,
  StoreOrder,
  StoreWompiHealthResponse,
} from '../../types/store'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import GradientButton from '../../components/common/GradientButton'

const PAGE_SIZE = 12

const STATUS_OPTIONS = ['', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'canceled']

const NEXT_STATUS_BY_CURRENT: Record<string, string | null> = {
  pending: 'paid',
  paid: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
  delivered: 'completed',
  completed: null,
  canceled: null,
}

export default function StoreOpsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [summary, setSummary] = useState<StoreOpsSummaryResponse['summary'] | null>(null)
  const [wompiHealth, setWompiHealth] = useState<StoreWompiHealthResponse | null>(null)
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [branding, setBranding] = useState<StoreBranding | null>(null)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(false)
  const [loadingWompi, setLoadingWompi] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [manualShipmentOrder, setManualShipmentOrder] = useState<StoreOrder | null>(null)
  const [legalDialogOpen, setLegalDialogOpen] = useState(false)
  const [promoDialogOpen, setPromoDialogOpen] = useState(false)
  const [manualShipmentForm, setManualShipmentForm] = useState<StoreOpsManualShipmentPayload>({
    carrier: '',
    tracking_number: '',
    shipping_cost: '',
    service: 'mostrador',
    status: 'in_transit',
    currency: 'COP',
  })

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  const refreshWompiHealth = async () => {
    try {
      setLoadingWompi(true)
      const wompiResponse = await storeService.getWompiHealth()
      setWompiHealth(wompiResponse)
    } catch {
      setErrorMessage('No se pudo consultar el estado de Wompi.')
    } finally {
      setLoadingWompi(false)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setErrorMessage(null)

      const [summaryResponse, ordersResponse, wompiResponse, brandingResponse] = await Promise.all([
        storeService.getOpsSummary(),
        storeService.getOpsOrders({ page, page_size: PAGE_SIZE, status: status || undefined, search: search || undefined }),
        storeService.getWompiHealth(),
        storeService.getOpsBranding(),
      ])

      setSummary(summaryResponse.summary)
      setOrders(ordersResponse.orders)
      setCount(ordersResponse.count)
      setWompiHealth(wompiResponse)
      setBranding(brandingResponse.branding)
    } catch {
      setErrorMessage('No se pudo cargar el panel de ordenes. Verifica permisos y session.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBranding = async (target: 'legal' | 'promo') => {
    if (!branding) return
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await storeService.updateOpsBranding({
        ...branding,
        logo_url: branding.logo_url || '',
        favicon_url: branding.favicon_url || '',
      })
      setBranding(response.branding)
      if (target === 'legal') {
        setLegalDialogOpen(false)
        setSuccessMessage('Datos legales y comerciales actualizados.')
      } else {
        setPromoDialogOpen(false)
        setSuccessMessage('Promociones de tienda actualizadas.')
      }
    } catch {
      setErrorMessage('No se pudieron guardar los datos de tienda.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [page, status])

  const handleApplyFilters = () => {
    setPage(1)
    void loadData()
  }

  const handleAdvanceStatus = async (order: StoreOrder) => {
    const nextStatus = NEXT_STATUS_BY_CURRENT[order.status]
    if (!nextStatus) return

    try {
      setLoading(true)
      setErrorMessage(null)
      await storeService.updateOpsOrderStatus(order.sale_id, { status: nextStatus as any })
      setSuccessMessage(`Orden #${order.sale_id} actualizada a ${nextStatus}`)
      await loadData()
    } catch {
      setErrorMessage('No se pudo actualizar el estado de la orden.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (saleId: number) => {
    try {
      setLoading(true)
      setErrorMessage(null)
      await storeService.updateOpsOrderStatus(saleId, {
        status: 'canceled',
        note: 'Cancelado desde panel ops',
      })
      setSuccessMessage(`Orden #${saleId} cancelada`)
      await loadData()
    } catch {
      setErrorMessage('No se pudo cancelar la orden.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkManualPaid = async (order: StoreOrder) => {
    try {
      setLoading(true)
      setErrorMessage(null)
      await storeService.updateOpsOrderStatus(order.sale_id, {
        status: 'paid',
        note: 'Pago manual registrado desde Store Ops (fallback sin Wompi)',
      })
      setSuccessMessage(`Pago manual registrado para orden #${order.sale_id}`)
      await loadData()
    } catch {
      setErrorMessage('No se pudo registrar el pago manual.')
    } finally {
      setLoading(false)
    }
  }

  const openManualShipmentDialog = (order: StoreOrder) => {
    setManualShipmentOrder(order)
    setManualShipmentForm({
      carrier: order.shipment?.carrier ?? '',
      tracking_number: order.shipment?.tracking_number ?? '',
      shipping_cost: order.shipment?.shipping_cost ?? '',
      service: order.shipment?.service ?? 'mostrador',
      provider_reference: order.shipment?.provider_reference ?? '',
      label_url: order.shipment?.label_url ?? '',
      status: (order.shipment?.status as any) ?? 'in_transit',
      currency: order.shipment?.currency ?? 'COP',
    })
  }

  const closeManualShipmentDialog = () => {
    setManualShipmentOrder(null)
  }

  const handleSaveManualShipment = async () => {
    if (!manualShipmentOrder) return
    if (!manualShipmentForm.carrier.trim() || !manualShipmentForm.tracking_number.trim() || !manualShipmentForm.shipping_cost.trim()) {
      setErrorMessage('Carrier, tracking y costo son obligatorios para registrar la guía manual.')
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      await storeService.registerOpsManualShipment(manualShipmentOrder.sale_id, {
        ...manualShipmentForm,
        carrier: manualShipmentForm.carrier.trim(),
        tracking_number: manualShipmentForm.tracking_number.trim().toUpperCase(),
      })
      setSuccessMessage(`Guía manual registrada para orden #${manualShipmentOrder.sale_id}`)
      closeManualShipmentDialog()
      await loadData()
    } catch {
      setErrorMessage('No se pudo registrar la guía manual.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Operaciones de Tienda"
        subtitle="Panel diario para seguimiento y avance de órdenes"
        icon={<StorefrontIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      />
      <Box sx={{ px: { xs: 0.5, sm: 1, md: 1.5 }, pb: 1 }}>
      <Stack spacing={2.5}>

        {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}

        {wompiHealth && (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.9),
              borderColor: alpha(theme.palette.primary.main, 0.22),
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  <Typography variant="h6">Estado Wompi</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={wompiHealth.configured ? 'Wompi OK' : 'Wompi incompleto'}
                      color={wompiHealth.configured ? 'success' : 'warning'}
                      size="small"
                    />
                    <GradientButton
                      size="small"
                      onClick={() => void refreshWompiHealth()}
                      disabled={loadingWompi}
                      sx={{
                        px: 1.4,
                        py: 0.25,
                        fontSize: '0.72rem',
                        borderRadius: 999,
                        backgroundColor:
                          theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.14)
                            : alpha('#ffffff', 0.2),
                        color:
                          theme.palette.mode === 'light'
                            ? theme.palette.primary.dark
                            : 'white',
                        border: `1px solid ${
                          theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.28)
                            : alpha('#ffffff', 0.3)
                        }`,
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'light'
                              ? alpha(theme.palette.primary.main, 0.22)
                              : alpha('#ffffff', 0.3),
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Revalidar Wompi
                    </GradientButton>
                  </Stack>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Ambiente: {wompiHealth.environment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  API: {wompiHealth.api_base_url}
                </Typography>
                {!wompiHealth.configured && (
                  <Typography variant="body2" color="warning.main">
                    Faltan variables: {wompiHealth.missing.join(', ')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {branding && (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.9),
              borderColor: alpha(theme.palette.primary.main, 0.22),
              backdropFilter: 'blur(8px)',
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Stack spacing={0.25}>
                  <Typography variant="subtitle1" fontWeight={700}>Datos legales y de tienda</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Configura identidad comercial y promociones desde modales separados.
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="outlined"
                    startIcon={<VerifiedUserRoundedIcon />}
                    onClick={() => setLegalDialogOpen(true)}
                    sx={{
                      minHeight: 40,
                      px: 1.8,
                      borderRadius: 999,
                      fontWeight: 700,
                      color: theme.palette.mode === 'light' ? theme.palette.primary.dark : '#ffffff',
                      borderColor:
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.primary.main, 0.38)
                          : alpha('#ffffff', 0.4),
                      background:
                        theme.palette.mode === 'light'
                          ? `linear-gradient(135deg, ${alpha('#ffffff', 0.72)}, ${alpha(theme.palette.primary.main, 0.1)})`
                          : `linear-gradient(135deg, ${alpha('#ffffff', 0.2)}, ${alpha(theme.palette.primary.main, 0.26)})`,
                      backdropFilter: 'blur(12px)',
                      boxShadow:
                        theme.palette.mode === 'light'
                          ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.16)}`
                          : `0 10px 26px ${alpha('#000', 0.42)}`,
                      transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor:
                          theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.52)
                            : alpha('#ffffff', 0.56),
                        background:
                          theme.palette.mode === 'light'
                            ? `linear-gradient(135deg, ${alpha('#ffffff', 0.86)}, ${alpha(theme.palette.primary.main, 0.18)})`
                            : `linear-gradient(135deg, ${alpha('#ffffff', 0.26)}, ${alpha(theme.palette.primary.main, 0.34)})`,
                      },
                    }}
                  >
                    Datos legales
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CampaignRoundedIcon />}
                    onClick={() => setPromoDialogOpen(true)}
                    sx={{
                      minHeight: 40,
                      px: 1.8,
                      borderRadius: 999,
                      fontWeight: 700,
                      color: theme.palette.mode === 'light' ? theme.palette.info.dark : '#ffffff',
                      borderColor:
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.info.main, 0.38)
                          : alpha('#ffffff', 0.4),
                      background:
                        theme.palette.mode === 'light'
                          ? `linear-gradient(135deg, ${alpha('#ffffff', 0.72)}, ${alpha(theme.palette.info.main, 0.1)})`
                          : `linear-gradient(135deg, ${alpha('#ffffff', 0.2)}, ${alpha(theme.palette.info.main, 0.26)})`,
                      backdropFilter: 'blur(12px)',
                      boxShadow:
                        theme.palette.mode === 'light'
                          ? `0 8px 24px ${alpha(theme.palette.info.main, 0.16)}`
                          : `0 10px 26px ${alpha('#000', 0.42)}`,
                      transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor:
                          theme.palette.mode === 'light'
                            ? alpha(theme.palette.info.main, 0.52)
                            : alpha('#ffffff', 0.56),
                        background:
                          theme.palette.mode === 'light'
                            ? `linear-gradient(135deg, ${alpha('#ffffff', 0.86)}, ${alpha(theme.palette.info.main, 0.18)})`
                            : `linear-gradient(135deg, ${alpha('#ffffff', 0.26)}, ${alpha(theme.palette.info.main, 0.34)})`,
                      },
                    }}
                  >
                    Promociones
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}

        {summary && (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.9),
              borderColor: alpha(theme.palette.primary.main, 0.22),
            }}
          >
            <CardContent>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Chip label={`Total: ${summary.total_orders}`} color="primary" />
                <Chip label={`Pending: ${summary.pending}`} color="warning" />
                <Chip label={`Paid: ${summary.paid}`} color="success" />
                <Chip label={`Processing: ${summary.processing}`} color="info" />
                <Chip label={`Shipped: ${summary.shipped}`} />
                <Chip label={`Delivered: ${summary.delivered}`} color="success" variant="outlined" />
                <Chip label={`Canceled: ${summary.canceled}`} color="error" />
              </Stack>
            </CardContent>
          </Card>
        )}

        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.9),
            borderColor: alpha(theme.palette.primary.main, 0.22),
          }}
        >
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Buscar cliente"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Estado"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                sx={{ minWidth: 180 }}
              >
                {STATUS_OPTIONS.map((value) => (
                  <MenuItem key={value || 'all'} value={value}>
                    {value || 'Todos'}
                  </MenuItem>
                ))}
              </TextField>
              <GradientButton
                onClick={handleApplyFilters}
                disabled={loading}
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'light'
                      ? alpha(theme.palette.primary.main, 0.14)
                      : alpha('#ffffff', 0.2),
                  color:
                    theme.palette.mode === 'light'
                      ? theme.palette.primary.dark
                      : 'white',
                  border: `1px solid ${
                    theme.palette.mode === 'light'
                      ? alpha(theme.palette.primary.main, 0.28)
                      : alpha('#ffffff', 0.3)
                  }`,
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'light'
                        ? alpha(theme.palette.primary.main, 0.22)
                        : alpha('#ffffff', 0.3),
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Filtrar
              </GradientButton>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {orders.map((order) => {
            const nextStatus = NEXT_STATUS_BY_CURRENT[order.status]
            return (
              <Card
                key={order.sale_id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  background: alpha(theme.palette.background.paper, 0.9),
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                      <Typography variant="h6">Orden #{order.sale_id}</Typography>
                      <Chip
                        label={order.status_detail.label}
                        color={order.status === 'canceled' ? 'error' : order.status === 'pending' ? 'warning' : 'primary'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2">Total: {order.total}</Typography>
                    <Typography variant="body2" color="text.secondary">Creado: {order.created_at}</Typography>
                    <Typography variant="body2" color="text.secondary">Pago: {order.payment_status}</Typography>
                    {order.payment_method_preference && (
                      <Typography variant="body2" color="text.secondary">
                        Metodo preferido: {order.payment_method_preference}
                      </Typography>
                    )}
                    {order.payment_method && (
                      <Typography variant="body2" color="text.secondary">
                        Metodo confirmado: {order.payment_method}
                      </Typography>
                    )}
                    {order.shipping_address && (
                      <Typography variant="body2" color="text.secondary">
                        Direccion: {order.shipping_address.address_line1}, {order.shipping_address.city} ({order.shipping_address.department})
                      </Typography>
                    )}
                    {order.shipment && (
                      <Typography variant="body2" color="text.secondary">
                        Envío: {order.shipment.carrier} - {order.shipment.tracking_number} ({order.shipment.status})
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1}>
                      {order.status === 'pending' && order.payment_status !== 'paid' && (
                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          onClick={() => void handleMarkManualPaid(order)}
                          disabled={loading}
                        >
                          Marcar pago manual
                        </Button>
                      )}
                      {nextStatus && (
                        <Button size="small" variant="contained" onClick={() => void handleAdvanceStatus(order)} disabled={loading}>
                          Pasar a {nextStatus}
                        </Button>
                      )}
                      {order.status !== 'canceled' && order.status !== 'completed' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openManualShipmentDialog(order)}
                          disabled={loading}
                        >
                          Registrar guía manual
                        </Button>
                      )}
                      {order.status !== 'canceled' && order.status !== 'completed' && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => void handleCancelOrder(order.sale_id)}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )
          })}

          {orders.length === 0 && (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.9),
                borderColor: alpha(theme.palette.primary.main, 0.2),
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  No hay órdenes para los filtros actuales.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>

        <Box display="flex" justifyContent="center">
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
        </Box>
      </Stack>
      </Box>
      <Dialog open={Boolean(manualShipmentOrder)} onClose={closeManualShipmentDialog} fullWidth maxWidth="sm">
        <DialogTitle>Registrar guía manual</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Transportadora"
              value={manualShipmentForm.carrier}
              onChange={(event) => setManualShipmentForm((prev) => ({ ...prev, carrier: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Número de guía / tracking"
              value={manualShipmentForm.tracking_number}
              onChange={(event) => setManualShipmentForm((prev) => ({ ...prev, tracking_number: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Costo del envío"
              value={manualShipmentForm.shipping_cost}
              onChange={(event) => setManualShipmentForm((prev) => ({ ...prev, shipping_cost: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Servicio"
              value={manualShipmentForm.service ?? ''}
              onChange={(event) => setManualShipmentForm((prev) => ({ ...prev, service: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Referencia proveedor (opcional)"
              value={manualShipmentForm.provider_reference ?? ''}
              onChange={(event) => setManualShipmentForm((prev) => ({ ...prev, provider_reference: event.target.value }))}
              fullWidth
            />
            <TextField
              label="URL etiqueta (opcional)"
              value={manualShipmentForm.label_url ?? ''}
              onChange={(event) => setManualShipmentForm((prev) => ({ ...prev, label_url: event.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Estado del envío"
              value={manualShipmentForm.status ?? 'in_transit'}
              onChange={(event) => setManualShipmentForm((prev) => ({ ...prev, status: event.target.value as any }))}
              fullWidth
            >
              <MenuItem value="created">created</MenuItem>
              <MenuItem value="in_transit">in_transit</MenuItem>
              <MenuItem value="delivered">delivered</MenuItem>
              <MenuItem value="failed">failed</MenuItem>
              <MenuItem value="canceled">canceled</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeManualShipmentDialog} disabled={loading}>Cancelar</Button>
          <Button onClick={() => void handleSaveManualShipment()} variant="contained" disabled={loading}>
            Guardar guía
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={legalDialogOpen}
        onClose={() => setLegalDialogOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Datos legales y comerciales</DialogTitle>
        <DialogContent>
          {branding && (
            <Stack spacing={1.25} mt={1}>
              <Typography variant="subtitle2">Datos legales y comerciales</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  label="Nombre tienda"
                  value={branding.store_name}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, store_name: event.target.value } : prev)}
                  fullWidth
                />
                <TextField
                  label="Tagline"
                  value={branding.tagline}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, tagline: event.target.value } : prev)}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  label="URL logo tienda"
                  value={branding.logo_url || ''}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, logo_url: event.target.value } : prev)}
                  placeholder="https://..."
                  fullWidth
                />
                <TextField
                  label="URL favicon"
                  value={branding.favicon_url || ''}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, favicon_url: event.target.value } : prev)}
                  placeholder="https://..."
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  label="Tipo identificacion"
                  value={branding.legal_id_type}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_id_type: event.target.value } : prev)}
                  fullWidth
                />
                <TextField
                  label="NIT / RUT"
                  value={branding.legal_id_number}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_id_number: event.target.value } : prev)}
                  fullWidth
                />
                <TextField
                  label="Titular / responsable"
                  value={branding.legal_representative_name}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_representative_name: event.target.value } : prev)}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  label="Correo de contacto"
                  value={branding.legal_contact_email}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_contact_email: event.target.value } : prev)}
                  fullWidth
                />
                <TextField
                  label="Telefono de contacto"
                  value={branding.legal_contact_phone}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_contact_phone: event.target.value } : prev)}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  label="Direccion legal/comercial"
                  value={branding.legal_contact_address}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_contact_address: event.target.value } : prev)}
                  fullWidth
                />
                <TextField
                  label="Ciudad"
                  value={branding.legal_contact_city}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_contact_city: event.target.value } : prev)}
                  fullWidth
                />
                <TextField
                  label="Departamento"
                  value={branding.legal_contact_department}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, legal_contact_department: event.target.value } : prev)}
                  fullWidth
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLegalDialogOpen(false)} disabled={loading}>Cerrar</Button>
          <Button
            variant="contained"
            onClick={() => void handleSaveBranding('legal')}
            disabled={loading || !branding}
          >
            Guardar datos legales
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={promoDialogOpen}
        onClose={() => setPromoDialogOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Promociones de la tienda</DialogTitle>
        <DialogContent>
          {branding && (
            <Stack spacing={1.25} mt={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Configura banners y mensajes para escritorio y móvil.
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  select
                  label="Mostrar promo superior"
                  value={branding.promo_top_enabled ? 'true' : 'false'}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_top_enabled: event.target.value === 'true' } : prev)}
                  fullWidth
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Si</MenuItem>
                </TextField>
                <TextField
                  label="Titulo promo superior"
                  value={branding.promo_top_title}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_top_title: event.target.value } : prev)}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Texto promo superior"
                value={branding.promo_top_text}
                onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_top_text: event.target.value } : prev)}
                fullWidth
                multiline
                minRows={2}
              />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  label="Imagen promo superior (desktop - pancarta)"
                  value={branding.promo_top_image_desktop_url}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_top_image_desktop_url: event.target.value } : prev)}
                  fullWidth
                  placeholder="https://..."
                />
                <TextField
                  label="Imagen promo superior (movil - cuadrada)"
                  value={branding.promo_top_image_mobile_url}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_top_image_mobile_url: event.target.value } : prev)}
                  fullWidth
                  placeholder="https://..."
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                <TextField
                  select
                  label="Mostrar promo inferior"
                  value={branding.promo_bottom_enabled ? 'true' : 'false'}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_bottom_enabled: event.target.value === 'true' } : prev)}
                  fullWidth
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Si</MenuItem>
                </TextField>
                <TextField
                  label="Titulo promo inferior"
                  value={branding.promo_bottom_title}
                  onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_bottom_title: event.target.value } : prev)}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Texto promo inferior"
                value={branding.promo_bottom_text}
                onChange={(event) => setBranding((prev) => prev ? { ...prev, promo_bottom_text: event.target.value } : prev)}
                fullWidth
                multiline
                minRows={2}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPromoDialogOpen(false)} disabled={loading}>Cerrar</Button>
          <Button
            variant="contained"
            onClick={() => void handleSaveBranding('promo')}
            disabled={loading || !branding}
          >
            Guardar promociones
          </Button>
        </DialogActions>
      </Dialog>
    </PageShell>
  )
}
