import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
  Grid,
  Divider,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  Storefront as StorefrontIcon,
  VerifiedUserOutlined as VerifiedUserIcon,
  CampaignOutlined as CampaignIcon,
  Search as SearchIcon,
  LocalShippingOutlined as ShippingIcon,
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
import DialogShell from '../../components/common/DialogShell'

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
  const [summary, setSummary] = useState<StoreOpsSummaryResponse['summary'] | null>(null)
  const [wompiHealth, setWompiHealth] = useState<StoreWompiHealthResponse | null>(null)
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [branding, setBranding] = useState<StoreBranding | null>(null)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(false)
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
      setErrorMessage('No se pudo cargar el panel de operaciones.')
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
      await storeService.updateOpsOrderStatus(order.sale_id, { status: nextStatus as any })
      setSuccessMessage(`Orden #${order.sale_id} actualizada.`)
      await loadData()
    } catch {
      setErrorMessage('Error al actualizar estado.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkManualPaid = async (order: StoreOrder) => {
    try {
      setLoading(true)
      await storeService.updateOpsOrderStatus(order.sale_id, { status: 'paid', note: 'Pago manual registrado' })
      setSuccessMessage(`Pago registrado para orden #${order.sale_id}`)
      await loadData()
    } catch {
      setErrorMessage('Error al registrar pago.')
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

  const handleSaveManualShipment = async () => {
    if (!manualShipmentOrder) return
    try {
      setLoading(true)
      await storeService.registerOpsManualShipment(manualShipmentOrder.sale_id, manualShipmentForm)
      setSuccessMessage(`Guía registrada para orden #${manualShipmentOrder.sale_id}`)
      setManualShipmentOrder(null)
      await loadData()
    } catch {
      setErrorMessage('Error al registrar guía.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBranding = async () => {
    if (!branding) return
    try {
      setLoading(true)
      const resp = await storeService.updateOpsBranding(branding)
      setBranding(resp.branding)
      setLegalDialogOpen(false)
      setPromoDialogOpen(false)
      setSuccessMessage('Configuración guardada.')
    } catch {
      setErrorMessage('Error al guardar configuración.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Operaciones"
        subtitle="Control central de la tienda online"
        icon={<StorefrontIcon sx={{ color: 'text.secondary' }} />}
      />

      <Box sx={{ pb: 4 }}>
        <Stack spacing={3}>
          {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ borderRadius: 1.5 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ borderRadius: 1.5 }}>{successMessage}</Alert>}

          {/* Widgets de Estado Rápidos */}
          <Grid container spacing={2}>
            {wompiHealth && (
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Estado Pasarela (Wompi)</Typography>
                    <Box sx={{
                      px: 1, py: 0.25, borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                      bgcolor: wompiHealth.configured ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.warning.main, 0.08),
                      color: wompiHealth.configured ? 'success.main' : 'warning.main',
                      border: `1px solid ${alpha(wompiHealth.configured ? theme.palette.success.main : theme.palette.warning.main, 0.2)}`
                    }}>
                      {wompiHealth.configured ? 'Configurado' : 'Pendiente'}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Ambiente: <strong>{wompiHealth.environment}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    Endpoint: {wompiHealth.api_base_url}
                  </Typography>
                </Box>
              </Grid>
            )}

            {branding && (
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Identidad Corporativa</Typography>
                    <Typography variant="caption" color="text.secondary">Configuración legal y promocional</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VerifiedUserIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setLegalDialogOpen(true)}
                      sx={{ borderRadius: 1.5, fontSize: '11px' }}
                    >
                      Legal
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CampaignIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setPromoDialogOpen(true)}
                      sx={{ borderRadius: 1.5, fontSize: '11px' }}
                    >
                      Promos
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Resumen de Órdenes */}
          {summary && (
            <Box sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.text.primary, 0.02),
            }}>
              <Stack direction="row" flexWrap="wrap" gap={1.5} justifyContent="center">
                {[
                  { label: 'Pendientes', count: summary.pending, color: 'warning' },
                  { label: 'Pagadas', count: summary.paid, color: 'success' },
                  { label: 'Procesando', count: summary.processing, color: 'info' },
                  { label: 'Enviadas', count: summary.shipped, color: 'primary' },
                ].map((s) => (
                  <Box key={s.label} sx={{ textAlign: 'center', px: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {s.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: `${s.color}.main` }}>
                      {s.count}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Filtros y Lista */}
          <Box sx={{
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.text.primary, 0.01) }}>
              <Grid container spacing={1.5} alignItems="center">
                <Grid item xs={12} sm={6} md={8}>
                  <TextField
                    placeholder="Buscar por cliente o ID..."
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha(theme.palette.text.primary, 0.015), borderRadius: 1.5 } }}
                    InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} /> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} display="flex" gap={1}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  >
                    {STATUS_OPTIONS.map((val) => (
                      <MenuItem key={val} value={val}>{val || 'Todos los estados'}</MenuItem>
                    ))}
                  </TextField>
                  <Button variant="contained" onClick={handleApplyFilters} sx={{ borderRadius: 1.5, px: 3 }}>
                    Filtrar
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ p: 0 }}>
              {orders.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No se encontraron órdenes recientes.</Typography>
                </Box>
              ) : (
                <Stack divider={<Divider />}>
                  {orders.map((order) => {
                    const next = NEXT_STATUS_BY_CURRENT[order.status]
                    return (
                      <Box key={order.sale_id} sx={{ p: 2.5, '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.005) } }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Orden #{order.sale_id}</Typography>
                              <Box sx={{
                                px: 1, py: 0.15, borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                                bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
                              }}>
                                {order.status_detail.label}
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                              Cliente: <strong>{order.customer_name || 'Desconocido'}</strong> • {order.total} • {order.created_at}
                            </Typography>
                            {order.shipment && (
                              <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                                <ShippingIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                                {order.shipment.carrier}: {order.shipment.tracking_number}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={4} display="flex" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} alignItems="center" gap={1}>
                            <Stack direction="row" spacing={1}>
                              {order.status === 'pending' && (
                                <Button size="small" color="success" onClick={() => handleMarkManualPaid(order)} sx={{ fontSize: '11px', minWidth: 0 }}>
                                  Pago
                                </Button>
                              )}
                              {next && (
                                <GradientButton size="small" onClick={() => handleAdvanceStatus(order)} sx={{ fontSize: '11px', borderRadius: 1.5 }}>
                                  Pasar a {next}
                                </GradientButton>
                              )}
                              <Button size="small" variant="outlined" onClick={() => openManualShipmentDialog(order)} sx={{ fontSize: '11px', borderRadius: 1.5 }}>
                                Guía
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    )
                  })}
                </Stack>
              )}
            </Box>
          </Box>

          <Box display="flex" justifyContent="center">
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" />
          </Box>
        </Stack>
      </Box>

      {/* Modales de Configuración */}
      <DialogShell 
        open={legalDialogOpen} 
        onClose={() => setLegalDialogOpen(false)} 
        maxWidth="sm"
        dialogTitle="Datos Legales"
        subtitle="Configuración de identidad corporativa y fiscal de la tienda"
        actions={
          <>
            <Button variant="text" sx={{ color: 'text.secondary' }} onClick={() => setLegalDialogOpen(false)}>Cancelar</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveBranding} 
              disabled={loading}
              sx={{ bgcolor: 'text.primary', color: 'background.default', '&:hover': { bgcolor: 'text.secondary' } }}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </>
        }
      >
        <Stack spacing={2.5}>
          <TextField 
            label="Nombre Tienda" 
            value={branding?.store_name || ''} 
            onChange={(e) => setBranding(prev => prev ? { ...prev, store_name: e.target.value } : null)} 
            fullWidth 
            placeholder="Ej: Golos Store"
          />
          <TextField 
            label="NIT / RUT" 
            value={branding?.legal_id_number || ''} 
            onChange={(e) => setBranding(prev => prev ? { ...prev, legal_id_number: e.target.value } : null)} 
            fullWidth 
            placeholder="Ej: 123.456.789-0"
          />
          <TextField 
            label="Correo de Contacto" 
            value={branding?.legal_contact_email || ''} 
            onChange={(e) => setBranding(prev => prev ? { ...prev, legal_contact_email: e.target.value } : null)} 
            fullWidth 
            placeholder="legal@tienda.com"
          />
        </Stack>
      </DialogShell>

      <DialogShell 
        open={promoDialogOpen} 
        onClose={() => setPromoDialogOpen(false)} 
        maxWidth="sm"
        dialogTitle="Promociones y Marketing"
        subtitle="Modifica el mensaje publicitario que aparece en la parte superior"
        actions={
          <>
            <Button variant="text" sx={{ color: 'text.secondary' }} onClick={() => setPromoDialogOpen(false)}>Cancelar</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveBranding} 
              disabled={loading}
              sx={{ bgcolor: 'text.primary', color: 'background.default', '&:hover': { bgcolor: 'text.secondary' } }}
            >
              {loading ? 'Aplicando...' : 'Aplicar Promos'}
            </Button>
          </>
        }
      >
        <Stack spacing={2}>
          <TextField 
            label="Tagline / Promo" 
            value={branding?.tagline || ''} 
            onChange={(e) => setBranding(prev => prev ? { ...prev, tagline: e.target.value } : null)} 
            fullWidth 
            multiline 
            rows={3} 
            placeholder="Escribe el mensaje promocional aquí..."
          />
          <Typography variant="caption" color="text.secondary">
            Este texto se mostrará resaltado en el inicio de tu tienda.
          </Typography>
        </Stack>
      </DialogShell>

      <DialogShell 
        open={Boolean(manualShipmentOrder)} 
        onClose={() => setManualShipmentOrder(null)} 
        maxWidth="xs"
        dialogTitle="Registrar Guía Manual"
        subtitle={`Orden #${manualShipmentOrder?.sale_id} · Ingresa los datos del transportista`}
        actions={
          <>
            <Button variant="text" sx={{ color: 'text.secondary' }} onClick={() => setManualShipmentOrder(null)}>Cancelar</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveManualShipment} 
              disabled={loading}
              sx={{ bgcolor: 'text.primary', color: 'background.default', '&:hover': { bgcolor: 'text.secondary' } }}
            >
              {loading ? 'Guardando...' : 'Guardar Guía'}
            </Button>
          </>
        }
      >
        <Stack spacing={2}>
          <TextField 
            label="Transportadora" 
            value={manualShipmentForm.carrier} 
            onChange={(e) => setManualShipmentForm(p => ({ ...p, carrier: e.target.value }))} 
            fullWidth 
            size="small" 
          />
          <TextField 
            label="# Guía / Tracking" 
            value={manualShipmentForm.tracking_number} 
            onChange={(e) => setManualShipmentForm(p => ({ ...p, tracking_number: e.target.value }))} 
            fullWidth 
            size="small" 
          />
          <TextField 
            label="Costo de Envío" 
            value={manualShipmentForm.shipping_cost} 
            onChange={(e) => setManualShipmentForm(p => ({ ...p, shipping_cost: e.target.value }))} 
            fullWidth 
            size="small" 
          />
        </Stack>
      </DialogShell>
    </PageShell>
  )
}
