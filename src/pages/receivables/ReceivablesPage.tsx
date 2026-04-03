import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Divider,
  Skeleton,
  Avatar,
  LinearProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  InputAdornment,
  Autocomplete,
} from '@mui/material'
import {
  AccountBalanceWallet as WalletIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  TrendingDown as DebtIcon,
  Search as SearchIcon,
  WarningAmber as WarningIcon,
  CheckCircle as PaidIcon,
  Schedule as PendingIcon,
  Block as WriteOffIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { receivableService } from '../../services/receivableService'
import { formatCurrency } from '../../utils/currency'
import { useNotification } from '../../hooks/useNotification'
import PageShell from '../../components/common/PageShell'
import DialogShell from '../../components/common/DialogShell'
import type { AccountReceivable } from '../../types'

const statusConfig: Record<string, { label: string; color: 'default' | 'warning' | 'success' | 'error' | 'info'; icon: React.ReactNode }> = {
  pending: { label: 'Pendiente', color: 'warning', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
  partial: { label: 'Parcial', color: 'info', icon: <PaymentIcon sx={{ fontSize: 14 }} /> },
  paid: { label: 'Pagada', color: 'success', icon: <PaidIcon sx={{ fontSize: 14 }} /> },
  overdue: { label: 'Vencida', color: 'error', icon: <WarningIcon sx={{ fontSize: 14 }} /> },
  written_off: { label: 'Castigada', color: 'default', icon: <WriteOffIcon sx={{ fontSize: 14 }} /> },
}

const ReceivablesPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { showSuccess, showError } = useNotification()
  const queryClient = useQueryClient()

  // State
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedReceivable, setSelectedReceivable] = useState<AccountReceivable | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [paymentRef, setPaymentRef] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', id_number: '', credit_limit: '0', email: '', address: '', notes: '' })
  const [createReceivableOpen, setCreateReceivableOpen] = useState(false)
  const [crSaleId, setCrSaleId] = useState('')
  const [crCustomerId, setCrCustomerId] = useState<number | null>(null)
  const [crDueDate, setCrDueDate] = useState('')
  const [crNotes, setCrNotes] = useState('')
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailReceivable, setDetailReceivable] = useState<AccountReceivable | null>(null)

  // Queries
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['receivables-summary'],
    queryFn: () => receivableService.getSummary(),
  })

  const { data: receivablesData, isLoading: receivablesLoading } = useQuery({
    queryKey: ['receivables', statusFilter, searchTerm],
    queryFn: () => receivableService.getReceivables({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(searchTerm ? { search: searchTerm } : {}),
    }),
  })

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => receivableService.getCustomers({ limit: 500 }),
  })

  const receivables = receivablesData?.results || []
  const customers = customersData?.results || []
  const summary = summaryData

  // Mutations
  const paymentMutation = useMutation({
    mutationFn: ({ receivableId, data }: { receivableId: number; data: any }) =>
      receivableService.registerPayment(receivableId, data),
    onSuccess: (response) => {
      showSuccess(response.detail || 'Abono registrado correctamente')
      queryClient.invalidateQueries({ queryKey: ['receivables'] })
      queryClient.invalidateQueries({ queryKey: ['receivables-summary'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setPaymentDialogOpen(false)
      resetPaymentForm()
    },
    onError: (error: any) => {
      showError(error.response?.data?.detail || 'Error al registrar el abono')
    },
  })

  const createCustomerMutation = useMutation({
    mutationFn: (data: any) => receivableService.createCustomer(data),
    onSuccess: () => {
      showSuccess('Cliente creado correctamente')
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setCustomerDialogOpen(false)
      setCustomerForm({ name: '', phone: '', id_number: '', credit_limit: '0', email: '', address: '', notes: '' })
    },
    onError: (error: any) => {
      showError(error.response?.data?.detail || 'Error al crear el cliente')
    },
  })

  const createReceivableMutation = useMutation({
    mutationFn: (data: any) => receivableService.createReceivable(data),
    onSuccess: () => {
      showSuccess('Cuenta por cobrar creada correctamente')
      queryClient.invalidateQueries({ queryKey: ['receivables'] })
      queryClient.invalidateQueries({ queryKey: ['receivables-summary'] })
      setCreateReceivableOpen(false)
      setCrSaleId('')
      setCrCustomerId(null)
      setCrDueDate('')
      setCrNotes('')
    },
    onError: (error: any) => {
      showError(error.response?.data?.detail || error.response?.data?.sale_id?.[0] || error.response?.data?.customer_id?.[0] || 'Error al crear la cuenta')
    },
  })

  const writeOffMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      receivableService.writeOff(id, reason),
    onSuccess: (response) => {
      showSuccess(response.detail || 'Cuenta castigada')
      queryClient.invalidateQueries({ queryKey: ['receivables'] })
      queryClient.invalidateQueries({ queryKey: ['receivables-summary'] })
    },
    onError: (error: any) => {
      showError(error.response?.data?.detail || 'Error al castigar la cuenta')
    },
  })

  const resetPaymentForm = () => {
    setPaymentAmount('')
    setPaymentMethod('CASH')
    setPaymentRef('')
    setPaymentNotes('')
    setSelectedReceivable(null)
  }

  const handleOpenPayment = (receivable: AccountReceivable) => {
    setSelectedReceivable(receivable)
    setPaymentDialogOpen(true)
  }

  const handleSubmitPayment = () => {
    if (!selectedReceivable || !paymentAmount) return
    paymentMutation.mutate({
      receivableId: selectedReceivable.id,
      data: {
        amount: parseFloat(paymentAmount),
        payment_method: paymentMethod,
        payment_reference: paymentRef || undefined,
        notes: paymentNotes || undefined,
      },
    })
  }

  const handleWriteOff = (receivable: AccountReceivable) => {
    if (window.confirm(`¿Seguro que desea castigar esta cuenta de ${receivable.customer.name}? Se registrará como pérdida de ${formatCurrency(receivable.balance)}.`)) {
      writeOffMutation.mutate({ id: receivable.id, reason: 'Cuenta castigada por impago' })
    }
  }

  const totalDebt = summary?.global?.total_debt || 0
  const totalAccounts = summary?.global?.total_accounts || 0

  return (
    <PageShell>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            Cuentas por Cobrar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3 }}>
            Gestión de créditos, fiados y abonos de clientes
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<PersonIcon />}
            variant="outlined"
            size="small"
            onClick={() => setCustomerDialogOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '12px' }}
          >
            Nuevo Cliente
          </Button>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            size="small"
            onClick={() => setCreateReceivableOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '12px', bgcolor: 'text.primary', color: 'background.default', '&:hover': { bgcolor: 'text.secondary' } }}
          >
            Fiar Venta
          </Button>
        </Box>
      </Box>

      {/* ─── KPI Cards ──────────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 1.5, md: 2 }, mb: 3 }}>
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={90} sx={{ borderRadius: 2.5 }} />
          ))
        ) : (
          <>
            <Paper sx={{ p: 2, borderRadius: 2.5, border: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                  <DebtIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Cartera Total</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px', color: totalDebt > 0 ? 'error.main' : 'text.primary' }}>
                {formatCurrency(totalDebt)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, borderRadius: 2.5, border: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <ReceiptIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Cuentas Activas</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
                {totalAccounts}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, borderRadius: 2.5, border: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <PersonIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Clientes</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
                {customers.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, borderRadius: 2.5, border: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <WalletIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Deudores Top</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
                {summary?.top_debtors?.length || 0}
              </Typography>
            </Paper>
          </>
        )}
      </Box>

      {/* ─── Filters ────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} /></InputAdornment>,
          }}
          sx={{ minWidth: 200, flexGrow: { xs: 1, md: 0 }, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '13px', height: 36 } }}
        />
        <TextField
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '13px', height: 36 } }}
        >
          <MenuItem value="">Todos los estados</MenuItem>
          <MenuItem value="pending">Pendientes</MenuItem>
          <MenuItem value="partial">Pago Parcial</MenuItem>
          <MenuItem value="overdue">Vencidas</MenuItem>
          <MenuItem value="paid">Pagadas</MenuItem>
          <MenuItem value="written_off">Castigadas</MenuItem>
        </TextField>
      </Box>

      {/* ─── Receivables List ───────────────────────────────────── */}
      {receivablesLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      ) : receivables.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: 2.5, textAlign: 'center', border: `1px solid ${theme.palette.divider}` }}>
          <WalletIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Sin cuentas por cobrar</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No hay cuentas en este momento. Use "Fiar Venta" para registrar una nueva.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {receivables.map((r) => {
            const config = statusConfig[r.status] || statusConfig.pending
            const progress = r.total_amount > 0 ? (r.paid_amount / r.total_amount) * 100 : 0
            return (
              <Paper
                key={r.id}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: theme.palette.text.disabled, boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, 0.06)}` },
                  cursor: 'pointer',
                }}
                onClick={() => { setDetailReceivable(r); setDetailDialogOpen(true) }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, flexWrap: 'wrap' }}>
                  {/* Left: Customer info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: alpha(theme.palette.text.primary, 0.08), color: 'text.primary', fontWeight: 600 }}>
                        {r.customer.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, fontSize: '14px' }} noWrap>
                        {r.customer.name}
                      </Typography>
                      <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        icon={config.icon as React.ReactElement}
                        sx={{ height: 20, fontSize: '10px', fontWeight: 600, '& .MuiChip-icon': { ml: 0.5 } }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Venta {r.sale_info?.document_number || `#${r.sale_info?.id}`} · {new Date(r.created_at).toLocaleDateString('es-CO')}
                      {r.due_date && ` · Vence: ${new Date(r.due_date).toLocaleDateString('es-CO')}`}
                    </Typography>
                  </Box>

                  {/* Right: Amounts */}
                  <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '16px', color: r.balance > 0 ? 'error.main' : 'success.main' }}>
                      {formatCurrency(r.balance)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      de {formatCurrency(r.total_amount)}
                    </Typography>
                  </Box>
                </Box>

                {/* Progress bar */}
                <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 5,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.text.primary, 0.06),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: progress >= 100 ? 'success.main' : progress > 0 ? 'info.main' : 'text.disabled',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', minWidth: 35 }}>
                    {progress.toFixed(0)}%
                  </Typography>

                  {/* Actions */}
                  {r.status !== 'paid' && r.status !== 'written_off' && (
                    <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Registrar abono">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenPayment(r)}
                          sx={{ width: 28, height: 28, border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}
                        >
                          <MoneyIcon sx={{ fontSize: 14, color: 'success.main' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Castigar cuenta">
                        <IconButton
                          size="small"
                          onClick={() => handleWriteOff(r)}
                          sx={{ width: 28, height: 28, border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}
                        >
                          <WriteOffIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </Paper>
            )
          })}
        </Box>
      )}

      {/* ─── Top Debtors ─────────────────────────────────────────── */}
      {summary && summary.top_debtors && summary.top_debtors.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '15px' }}>
            Top Deudores
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
            {summary.top_debtors.map((debtor) => (
              <Paper
                key={debtor.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', fontWeight: 700, fontSize: '14px' }}>
                  {debtor.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '13px' }} noWrap>{debtor.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {debtor.accounts_count} cuenta{debtor.accounts_count !== 1 ? 's' : ''} · {debtor.phone || 'Sin teléfono'}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'error.main' }}>
                  {formatCurrency(debtor.debt)}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {/* ─── Payment Dialog ─────────────────────────────────────── */}
      <DialogShell
        open={paymentDialogOpen}
        onClose={() => { setPaymentDialogOpen(false); resetPaymentForm() }}
        maxWidth="xs"
        dialogTitle="Registrar Abono"
        subtitle={selectedReceivable ? `${selectedReceivable.customer.name} · Saldo: ${formatCurrency(selectedReceivable.balance)}` : ''}
      >
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Monto del abono"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            helperText={selectedReceivable ? `Máximo: ${formatCurrency(selectedReceivable.balance)}` : ''}
            autoFocus
          />
          <TextField
            select
            label="Método de pago"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
          >
            <MenuItem value="CASH">Efectivo</MenuItem>
            <MenuItem value="NEQUI">Nequi</MenuItem>
            <MenuItem value="DAVIPLATA">Daviplata</MenuItem>
            <MenuItem value="TRANSFER">Transferencia</MenuItem>
            <MenuItem value="CARD">Tarjeta</MenuItem>
            <MenuItem value="OTHER">Otro</MenuItem>
          </TextField>
          <TextField
            label="Referencia (opcional)"
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            fullWidth
          />
          <TextField
            label="Notas (opcional)"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setPaymentDialogOpen(false); resetPaymentForm() }} sx={{ textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitPayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || paymentMutation.isPending}
              sx={{ textTransform: 'none', bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
            >
              {paymentMutation.isPending ? 'Registrando...' : 'Registrar Abono'}
            </Button>
          </Box>
        </Box>
      </DialogShell>

      {/* ─── New Customer Dialog ─────────────────────────────────── */}
      <DialogShell
        open={customerDialogOpen}
        onClose={() => setCustomerDialogOpen(false)}
        maxWidth="sm"
        dialogTitle="Nuevo Cliente"
        subtitle="Registrar un cliente para control de crédito"
      >
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre completo *"
            value={customerForm.name}
            onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
            fullWidth
            autoFocus
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Teléfono"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
            />
            <TextField
              label="Cédula / NIT"
              value={customerForm.id_number}
              onChange={(e) => setCustomerForm({ ...customerForm, id_number: e.target.value })}
            />
          </Box>
          <TextField
            label="Email"
            type="email"
            value={customerForm.email}
            onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Límite de crédito (0 = sin límite)"
            type="number"
            value={customerForm.credit_limit}
            onChange={(e) => setCustomerForm({ ...customerForm, credit_limit: e.target.value })}
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          />
          <TextField
            label="Notas"
            value={customerForm.notes}
            onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
            <Button onClick={() => setCustomerDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              disabled={!customerForm.name.trim() || createCustomerMutation.isPending}
              onClick={() => createCustomerMutation.mutate({
                ...customerForm,
                credit_limit: parseFloat(customerForm.credit_limit) || 0,
              })}
              sx={{ textTransform: 'none' }}
            >
              {createCustomerMutation.isPending ? 'Creando...' : 'Crear Cliente'}
            </Button>
          </Box>
        </Box>
      </DialogShell>

      {/* ─── Create Receivable Dialog ────────────────────────────── */}
      <DialogShell
        open={createReceivableOpen}
        onClose={() => setCreateReceivableOpen(false)}
        maxWidth="sm"
        dialogTitle="Fiar Venta"
        subtitle="Crear una cuenta por cobrar para una venta existente"
      >
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="ID de la Venta *"
            type="number"
            value={crSaleId}
            onChange={(e) => setCrSaleId(e.target.value)}
            fullWidth
            helperText="Ingrese el número de la venta que desea fiar"
            autoFocus
          />
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => `${option.name}${option.phone ? ` · ${option.phone}` : ''}`}
            getOptionKey={(option) => option.id}
            value={customers.find(c => c.id === crCustomerId) || null}
            onChange={(_, value) => setCrCustomerId(value?.id || null)}
            renderInput={(params) => (
              <TextField {...params} label="Cliente *" placeholder="Buscar cliente..." />
            )}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
          <TextField
            label="Fecha de vencimiento (opcional)"
            type="date"
            value={crDueDate}
            onChange={(e) => setCrDueDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Notas (opcional)"
            value={crNotes}
            onChange={(e) => setCrNotes(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button onClick={() => setCreateReceivableOpen(false)} sx={{ textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              disabled={!crSaleId || !crCustomerId || createReceivableMutation.isPending}
              onClick={() => createReceivableMutation.mutate({
                sale_id: parseInt(crSaleId),
                customer_id: crCustomerId!,
                due_date: crDueDate || undefined,
                notes: crNotes || undefined,
              })}
              sx={{ textTransform: 'none' }}
            >
              {createReceivableMutation.isPending ? 'Creando...' : 'Crear Cuenta'}
            </Button>
          </Box>
        </Box>
      </DialogShell>

      {/* ─── Detail Dialog ──────────────────────────────────────── */}
      <DialogShell
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullScreen={isMobile}
        dialogTitle={detailReceivable ? `CxC #${detailReceivable.id}` : 'Detalle'}
        subtitle={detailReceivable?.customer?.name || ''}
      >
        {detailReceivable && (
          <Box sx={{ p: 2.5 }}>
            {/* Summary */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '16px' }}>{formatCurrency(detailReceivable.total_amount)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Pagado</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'success.main' }}>{formatCurrency(detailReceivable.paid_amount)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Saldo</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: detailReceivable.balance > 0 ? 'error.main' : 'success.main' }}>
                  {formatCurrency(detailReceivable.balance)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontWeight: 600, fontSize: '13px', mb: 1.5 }}>Historial de Abonos</Typography>

            {detailReceivable.payments && detailReceivable.payments.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {detailReceivable.payments.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.success.main, 0.04),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>{formatCurrency(p.amount)}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(p.created_at).toLocaleDateString('es-CO')} · {p.payment_method}
                        {p.notes ? ` · ${p.notes}` : ''}
                      </Typography>
                    </Box>
                    <PaidIcon sx={{ fontSize: 18, color: 'success.main' }} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                Sin abonos registrados
              </Typography>
            )}

            {detailReceivable.status !== 'paid' && detailReceivable.status !== 'written_off' && (
              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<MoneyIcon />}
                  onClick={() => { setDetailDialogOpen(false); handleOpenPayment(detailReceivable) }}
                  sx={{ textTransform: 'none', bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                >
                  Registrar Abono
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogShell>
    </PageShell>
  )
}

export default ReceivablesPage
