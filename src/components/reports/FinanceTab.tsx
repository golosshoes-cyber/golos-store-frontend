import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  TextField,
  Button,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  FilterList as FilterListIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'

interface FinanceTabProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onRefetch: () => void
  reportData: any
  isLoading: boolean
  error: any
}

const FinanceTab: React.FC<FinanceTabProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRefetch,
  reportData,
  isLoading,
  error,
}) => {
  const theme = useTheme()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Error al cargar el reporte financiero: {error.message}</Typography>
        <Button onClick={onRefetch} sx={{ mt: 2 }}>Reintentar</Button>
      </Box>
    )
  }

  const summary = reportData?.summary || {}
  const categoryBreakdown = reportData?.category_breakdown || []

  const formatCurrency = (val: string | number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(Number(val))
  }

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <Paper sx={{ 
      p: 2, 
      height: '100%', 
      borderRadius: 2,
      border: `1px solid ${alpha(color, 0.1)}`,
      background: `linear-gradient(135deg, ${alpha(color, 0.02)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ 
          p: 1, 
          borderRadius: 1.5, 
          bgcolor: alpha(color, 0.1), 
          color: color,
          display: 'flex'
        }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
        {formatCurrency(value)}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  )

  return (
    <Box>
      <Box sx={{ 
        p: 1.5, 
        bgcolor: theme.palette.mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1), 
        borderBottom: `1px solid ${theme.palette.divider}`, 
        display: 'flex', 
        gap: 1.5, 
        flexWrap: 'wrap', 
        alignItems: 'center' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
          <FilterListIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary' }}>Filtrar Periodo:</Typography>
        </Box>

        <TextField
          type="date"
          label="Desde"
          size="small"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ 
            width: { xs: '100%', sm: 150 },
            '& .MuiInputBase-root': {
              height: 38,
              fontSize: '12px',
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              '& input': { py: 0 }
            },
            '& .MuiInputLabel-root': {
              fontSize: '12px',
              fontWeight: 600,
              bgcolor: 'background.paper',
              px: 0.5,
              borderRadius: 0.5,
              transform: 'translate(14px, -9px) scale(0.9)',
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.8)',
            }
          }}
        />

        <TextField
          type="date"
          label="Hasta"
          size="small"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ 
            width: { xs: '100%', sm: 150 },
            '& .MuiInputBase-root': {
              height: 38,
              fontSize: '12px',
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              '& input': { py: 0 }
            },
            '& .MuiInputLabel-root': {
              fontSize: '12px',
              fontWeight: 600,
              bgcolor: 'background.paper',
              px: 0.5,
              borderRadius: 0.5,
              transform: 'translate(14px, -9px) scale(0.9)',
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.8)',
            }
          }}
        />

        <Button 
          variant="contained" 
          size="small" 
          onClick={onRefetch}
          disabled={isLoading}
          sx={{ 
            textTransform: 'none', 
            height: 38,
            px: 3, 
            borderRadius: 1.5,
            fontSize: '11px',
            fontWeight: 700,
            bgcolor: 'text.primary',
            color: 'background.paper',
            '&:hover': {
              bgcolor: alpha(theme.palette.text.primary, 0.8),
            }
          }}
        >
          {isLoading ? <CircularProgress size={16} color="inherit" /> : 'Actualizar Reporte'}
        </Button>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* Main Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Ventas Brutas" 
              value={summary.revenue} 
              icon={<TrendingUpIcon />} 
              color={theme.palette.primary.main}
              subtitle="Ingresos totales por ventas"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Costo de Mercancía" 
              value={summary.cogs} 
              icon={<TrendingDownIcon />} 
              color={theme.palette.warning.main}
              subtitle="Lo que pagaste por el stock"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Gastos Operativos" 
              value={summary.expenses} 
              icon={<TrendingDownIcon />} 
              color={theme.palette.error.main}
              subtitle="Arriendos, servicios, etc."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Ganancia Neta" 
              value={summary.net_profit} 
              icon={<AccountBalanceIcon />} 
              color={theme.palette.success.main}
              subtitle={`Margen de utilidad: ${summary.profit_margin_percent}%`}
            />
          </Grid>

          {/* Detailed Breakdown */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 0, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>Desglose por Categoría y Método</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.2) }}>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700 }}>Categoría</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700 }}>Tipo</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700 }}>Método</TableCell>
                      <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700 }}>Cant.</TableCell>
                      <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryBreakdown.length > 0 ? (
                      categoryBreakdown.map((row: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontSize: '12px' }}>{row.category__name || 'Sin categoría'}</TableCell>
                          <TableCell sx={{ fontSize: '12px' }}>
                            <Box sx={{ 
                              display: 'inline-block', 
                              px: 1, py: 0.2, 
                              borderRadius: 0.5, 
                              fontSize: '10px', 
                              fontWeight: 700,
                              bgcolor: row.transaction_type === 'income' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                              color: row.transaction_type === 'income' ? 'success.main' : 'error.main'
                            }}>
                              {row.transaction_type === 'income' ? 'INGRESO' : 'GASTO'}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '12px' }}>{row.payment_method}</TableCell>
                          <TableCell align="right" sx={{ fontSize: '12px' }}>{row.count}</TableCell>
                          <TableCell align="right" sx={{ fontSize: '12px', fontWeight: 600 }}>
                            {formatCurrency(row.total)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No hay transacciones registradas en este periodo.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Insights / Tips */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="primary" sx={{ fontSize: 18 }} />
                  Balance de Ganancia
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Rendimiento Operativo</Typography>
                    <Typography variant="caption" fontWeight={700}>{summary.profit_margin_percent}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(Math.max(Number(summary.profit_margin_percent), 0), 100)} 
                    sx={{ height: 6, borderRadius: 3 }}
                    color={Number(summary.profit_margin_percent) > 20 ? 'success' : 'warning'}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1, fontSize: '10px' }}>
                    Un margen superior al 20% se considera saludable para el sector calzado.
                  </Typography>
                </Box>
              </Paper>

              <Paper sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
              }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'info.main' }}>
                  <DescriptionIcon sx={{ fontSize: 16 }} />
                  Nota sobre COGS
                </Typography>
                <Typography sx={{ fontSize: '11px', lineHeight: 1.4, color: 'text.secondary' }}>
                  El Costo de Mercancía Vendida (COGS) se calcula en base al costo actual registrado de cada variante multiplicado por las unidades vendidas en el periodo. 
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default FinanceTab
