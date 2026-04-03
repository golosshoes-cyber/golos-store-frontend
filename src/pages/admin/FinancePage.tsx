import React, { useState, useMemo } from 'react'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material'
import {
  Payments as PaymentsIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LockOpen as OpenIcon,
  Lock as CloseIcon,
  TrendingDown as ExpenseIcon,
  TrendingUp as IncomeIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financeService, FinancialTransaction } from '../../services/financeService'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import GradientButton from '../../components/common/GradientButton'
import { formatCurrency } from '../../utils/currency'
import TransactionDialog from '../../components/finance/TransactionDialog'
import CashSessionDialog from '../../components/finance/CashSessionDialog'
import CategoriesDialog from '../../components/finance/CategoriesDialog'
import { useAuth } from '../../contexts/AuthContext'
import { posPrinterService } from '../../utils/posPrinter'

const FinancePage: React.FC = () => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  // ... existing code ...
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const [cashDialogOpen, setCashDialogOpen] = useState(false)
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false)
  
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [cashMode, setCashMode] = useState<'open' | 'close'>('open')

  // Consultar sesión actual
  // ... existing code ...
  const { data: currentSession } = useQuery({
    queryKey: ['current-cash-session'],
    queryFn: () => financeService.getCurrentSession(),
    staleTime: 60000, // 1 minute
  })

  // Consultar transacciones recientes
  // ... existing code ...
  const { data: recentTransactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => financeService.getTransactions({ limit: 15 }),
    staleTime: 30000, // 30 seconds
  })

  // Mutaciones
  // ... existing code ...
  const openSessionMutation = useMutation({
    mutationFn: (data: { initial_balance: number; notes?: string }) => financeService.openSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-cash-session'] })
      setCashDialogOpen(false)
    },
  })

  const closeSessionMutation = useMutation({
    mutationFn: (data: { id: number; actual_balance: number; notes?: string }) => 
      financeService.closeSession(data.id, { actual_balance: data.actual_balance, notes: data.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-cash-session'] })
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] })
      setCashDialogOpen(false)
    },
  })

  const addTransactionMutation = useMutation({
    mutationFn: (data: any) => financeService.createTransaction({
      ...data,
      session: currentSession?.id
    }),
    onSuccess: (response: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['current-cash-session'] })
      setTransactionDialogOpen(false)

      // ✅ INTEGRACIÓN: Abrir cajón si es un gasto en efectivo
      if (variables.transaction_type === 'expense' && variables.payment_method === 'cash') {
        posPrinterService.openDrawerForExpense({
          amount: variables.amount,
          description: variables.description,
          userName: user?.username || 'Cajero',
          category: response?.category_name || 'Gasto General'
        })
      }
    },
  })

  const isSessionOpen = !!currentSession

  // Calcular el resumen de la sesión actual para el cierre
  const sessionSummary = useMemo(() => {
    if (!currentSession || !currentSession.transactions) return null;

    const initial = parseFloat(currentSession.initial_balance) || 0;
    let totalSales = 0;
    let totalExpenses = 0;
    let cashIn = 0;
    let cashOut = 0;
    let transfersIn = 0;
    let transfersOut = 0;

    currentSession.transactions.forEach((tx: any) => {
      const amount = parseFloat(tx.amount) || 0;
      if (tx.transaction_type === 'income') {
        totalSales += amount;
        if (tx.payment_method === 'cash') cashIn += amount;
        else transfersIn += amount;
      } else {
        totalExpenses += amount;
        if (tx.payment_method === 'cash') cashOut += amount;
        else transfersOut += amount;
      }
    });

    const cash_expected = initial + cashIn - cashOut;
    const transfers_expected = transfersIn - transfersOut;

    return {
      cash_expected,
      transfers_expected,
      total_sales: totalSales,
      total_expenses: totalExpenses
    };
  }, [currentSession]);

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Control de Finanzas"
        subtitle="Monitorea tus ingresos, egresos y control de caja"
        icon={<PaymentsIcon sx={{ fontSize: 24, color: 'text.secondary' }} />}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="text"
              size="small"
              startIcon={<SettingsIcon sx={{ fontSize: 18 }} />}
              onClick={() => setCategoriesDialogOpen(true)}
              sx={{ 
                borderRadius: 1.5,
                color: 'text.secondary',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              Categorías
            </Button>
            {isSessionOpen ? (
              <Button
                variant="contained"
                disableElevation
                color="error"
                size="small"
                startIcon={<CloseIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setCashMode('close')
                  setCashDialogOpen(true)
                }}
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2
                }}
              >
                Cerrar Caja
              </Button>
            ) : (
              <GradientButton
                size="small"
                startIcon={<OpenIcon sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setCashMode('open')
                  setCashDialogOpen(true)
                }}
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2
                }}
              >
                Abrir Caja
              </GradientButton>
            )}
          </Stack>
        }
      />

      <Grid container spacing={2}>
        {/* Resumen de Caja */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 'none', 
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden',
            background: isSessionOpen 
              ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.action.disabled, 0.05)} 0%, ${theme.palette.background.paper} 100%)`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Estado de Caja
                </Typography>
                <Box sx={{ 
                  px: 1.2, 
                  py: 0.4, 
                  borderRadius: 10, 
                  fontSize: '9px', 
                  fontWeight: 800,
                  bgcolor: isSessionOpen ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.error.main, 0.12),
                  color: isSessionOpen ? 'success.main' : 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: isSessionOpen ? 'success.main' : 'error.main' }} />
                  {isSessionOpen ? 'ACTIVA' : 'INACTIVA'}
                </Box>
              </Stack>
              
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-1px' }}>
                {isSessionOpen ? formatCurrency(currentSession.initial_balance) : '$ 0'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Base de apertura • Hoy
              </Typography>

              {isSessionOpen && (
                <Box sx={{ mt: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Abierta por</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>{currentSession.opened_by}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Hora</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>
                        {new Date(currentSession.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: alpha(theme.palette.primary.main, 0.04), 
                    borderRadius: 2,
                    border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
                  }}>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600, display: 'block', textAlign: 'center' }}>
                      Registra ingresos y egresos para mantener la trazabilidad.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones Rápidas */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[
              { title: 'Registrar Egreso', icon: <ExpenseIcon sx={{ fontSize: 20 }} />, color: 'error', type: 'expense', desc: 'Salida de dinero manual' },
              { title: 'Registrar Ingreso', icon: <IncomeIcon sx={{ fontSize: 20 }} />, color: 'success', type: 'income', desc: 'Entrada de dinero manual' },
            ].map((action) => (
              <Grid item xs={12} sm={6} key={action.title}>
                <Card 
                  onClick={() => {
                    setTransactionType(action.type as any)
                    setTransactionDialogOpen(true)
                  }}
                  sx={{ 
                    borderRadius: 3, 
                    cursor: 'pointer',
                    boxShadow: 'none', 
                    border: `1px solid ${theme.palette.divider}`,
                    height: '100%',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: theme.palette[action.color as 'error' | 'success'].main,
                      bgcolor: alpha(theme.palette[action.color as 'error' | 'success'].main, 0.04),
                      boxShadow: `0 8px 16px ${alpha(theme.palette[action.color as 'error' | 'success'].main, 0.1)}`
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 2.5 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: alpha(theme.palette[action.color as 'error' | 'success'].main, 0.1),
                      color: `${action.color}.main`,
                      display: 'flex'
                    }}>
                      {action.icon}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '15px' }}>{action.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{action.desc}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Historial Reciente */}
          <Box sx={{ mt: 3 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <Box sx={{ 
                px: 3, 
                py: 2, 
                borderBottom: `1px solid ${theme.palette.divider}`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: alpha(theme.palette.text.primary, 0.01)
              }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.5px' }}>
                  HISTORIAL DE MOVIMIENTOS
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => {}}
                  sx={{ fontSize: '12px', fontWeight: 600, textTransform: 'none' }}
                >
                  Ver historial completo
                </Button>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {loadingTransactions ? (
                  <Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress size={24} thickness={5} /></Box>
                ) : recentTransactions?.results?.length === 0 ? (
                  <Box sx={{ p: 6, textAlign: 'center' }}>
                    <HistoryIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1, opacity: 0.3 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Aún no hay transacciones en esta sesión
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {recentTransactions?.results?.map((tx: FinancialTransaction) => (
                      <Box 
                        key={tx.id} 
                        sx={{ 
                          px: 3, 
                          py: 2, 
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.3) },
                          '&:last-child': { borderBottom: 0 }
                        }}
                      >
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Box sx={{ 
                            p: 1.2, 
                            borderRadius: '12px', 
                            display: 'flex',
                            bgcolor: tx.transaction_type === 'income' ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
                            color: tx.transaction_type === 'income' ? 'success.main' : 'error.main',
                            border: `1px solid ${alpha(tx.transaction_type === 'income' ? theme.palette.success.main : theme.palette.error.main, 0.1)}`
                          }}>
                            {tx.transaction_type === 'income' ? <IncomeIcon sx={{ fontSize: 16 }} /> : <ExpenseIcon sx={{ fontSize: 16 }} />}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13.5px' }}>{tx.description}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                {tx.category_name}
                              </Typography>
                              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 800, 
                            fontSize: '14px',
                            color: tx.transaction_type === 'income' ? 'success.main' : 'error.main' 
                          }}>
                            {tx.transaction_type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '9px' }}>
                            {tx.payment_method === 'cash' ? 'EFECTIVO' : tx.payment_method?.toUpperCase()}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* DIÁLOGOS */}
      <TransactionDialog 
        open={transactionDialogOpen}
        onClose={() => setTransactionDialogOpen(false)}
        type={transactionType}
        onSave={(data) => addTransactionMutation.mutate(data)}
        loading={addTransactionMutation.isPending}
      />

      <CashSessionDialog 
        open={cashDialogOpen}
        onClose={() => setCashDialogOpen(false)}
        mode={cashMode}
        expectedBalance={sessionSummary?.cash_expected || 0}
        summary={sessionSummary || undefined}
        onConfirm={(data) => {
          if (cashMode === 'open') {
            openSessionMutation.mutate(data)
          } else {
            closeSessionMutation.mutate({ id: currentSession!.id, ...data })
          }
        }}
        loading={openSessionMutation.isPending || closeSessionMutation.isPending}
      />

      <CategoriesDialog 
        open={categoriesDialogOpen}
        onClose={() => setCategoriesDialogOpen(false)}
      />

    </PageShell>
  )
}

export default FinancePage
