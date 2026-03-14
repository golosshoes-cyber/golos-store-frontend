import React from 'react'
import { Grid, Typography, Box, Paper, CircularProgress, alpha, Chip, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDashboardLogic } from '../../hooks/dashboard/useDashboardLogic'
import DashboardStatsCards from '../../components/dashboard/DashboardStatsCards'
import RecentMovements from '../../components/dashboard/RecentMovements'
import TopProducts from '../../components/dashboard/TopProducts'
import SupplierPerformance from '../../components/dashboard/SupplierPerformance'
import SalesChart from '../../components/dashboard/SalesChart'
import MetricsWidget from '../../components/dashboard/MetricsWidget'
import SupplierRecommendationsWidget from '../../components/dashboard/SupplierRecommendationsWidget'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import FlareIcon from '@mui/icons-material/Flare'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const {
    stats,
    recentMovements,
    topProducts,
    supplierPerformance,
    salesChart,
    lowStock,
    dailySummary,
    metrics,
    recommendations,
    isLoading,
    movementsLoading,
    topProductsLoading,
    suppliersLoading,
    chartLoading,
    dailyLoading,
    metricsLoading,
    recommendationsLoading,
    error,
  } = useDashboardLogic()

  if (isLoading || dailyLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error al cargar las estadísticas del dashboard
        </Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* PAGE HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography sx={{ 
            fontSize: '14px', 
            fontWeight: 700, 
            letterSpacing: '-0.3px',
            color: 'text.primary',
            lineHeight: 1.1
          }}>
            Panel ejecutivo
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '11px', mt: 0.1, opacity: 0.8 }}>
            Estado comercial, inventario y operaciones · Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Typography>
        </Box>

        {/* DAILY SUMMARY CHIPS */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<ShoppingBagIcon sx={{ fontSize: '14px !important' }} />} 
            label={`Ventas: ${dailySummary?.activities?.sales?.today || 0}`} 
            size="small"
            sx={{ 
              fontSize: '11px', 
              fontWeight: 500,
              bgcolor: alpha(theme.palette.success.main, 0.08),
              color: 'success.main',
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
            }}
          />
          <Chip 
            icon={<LocalShippingIcon sx={{ fontSize: '14px !important' }} />} 
            label={`Compras: ${dailySummary?.activities?.purchases || 0}`} 
            size="small"
            sx={{ 
              fontSize: '11px', 
              fontWeight: 500,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          />
          <Chip 
            icon={<FlareIcon sx={{ fontSize: '14px !important' }} />} 
            label={`Nuevos: ${dailySummary?.activities?.new_products || 0}`} 
            size="small"
            sx={{ 
              fontSize: '11px', 
              fontWeight: 500,
              bgcolor: alpha(theme.palette.info.main, 0.08),
              color: 'info.main',
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}
          />
        </Box>
      </Box>

      {/* ALERT */}
      {lowStock > 0 && (
        <Box
          sx={{
            p: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.04),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
            color: 'warning.main'
          }}
        >
          <Box component="span" sx={{ fontSize: 16, display: 'flex' }}>⚠</Box>
          <Typography sx={{ flex: 1, fontSize: '12px', fontWeight: 400 }}>
            Hay <strong>{lowStock}</strong> {lowStock === 1 ? 'producto' : 'productos'} con stock bajo que requiere atención.
          </Typography>
          <Typography 
            onClick={() => navigate('/reports?tab=3')}
            sx={{ 
              fontSize: '12px', 
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
              '&:hover': { opacity: 0.8 }
            }}
          >
            Ver productos →
          </Typography>
        </Box>
      )}

      {/* STATS ROW - 4 columns */}
      <Grid container spacing={1}>
        <DashboardStatsCards stats={stats} />
      </Grid>

      {/* ROW 2: Movimientos + Top Productos + Rendimiento (METRICS) */}
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <RecentMovements
            movements={recentMovements?.movements}
            loading={movementsLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopProducts
            products={topProducts?.products}
            loading={topProductsLoading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricsWidget metrics={metrics} loading={metricsLoading} />
        </Grid>
      </Grid>

      {/* ROW 3: Chart + Proveedores + Recomendaciones */}
      <Grid container spacing={1}>
        <Grid item xs={12} md={5}>
          <SalesChart
            chartData={salesChart?.chart_data}
            loading={chartLoading}
          />
        </Grid>
        <Grid item xs={12} md={3.5}>
          <SupplierPerformance
            suppliers={supplierPerformance?.suppliers}
            loading={suppliersLoading}
          />
        </Grid>
        <Grid item xs={12} md={3.5}>
          <SupplierRecommendationsWidget recommendations={recommendations} loading={recommendationsLoading} />
        </Grid>
      </Grid>

      {/* ROW 4: Status Grid */}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ 
            p: '12px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <Box sx={{ 
              width: 7, height: 7, borderRadius: '50%', 
              bgcolor: 'success.main', flexShrink: 0,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.1)}`
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>Wompi</Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>Pasarela de pagos</Typography>
            </Box>
            <Box sx={{ 
              px: 0.8, py: 0.2, borderRadius: 0.5, 
              bgcolor: alpha(theme.palette.success.main, 0.08), 
              color: 'success.main', fontSize: '10px', fontWeight: 600 
            }}>OK</Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ 
            p: '12px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <Box sx={{ 
              width: 7, height: 7, borderRadius: '50%', 
              bgcolor: 'success.main', flexShrink: 0,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.1)}`
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>Backblaze</Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>Almacenamiento</Typography>
            </Box>
            <Box sx={{ 
              px: 0.8, py: 0.2, borderRadius: 0.5, 
              bgcolor: alpha(theme.palette.success.main, 0.08), 
              color: 'success.main', fontSize: '10px', fontWeight: 600 
            }}>OK</Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ 
            p: '12px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <Box sx={{ 
              width: 7, height: 7, borderRadius: '50%', 
              bgcolor: 'warning.main', flexShrink: 0,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.warning.main, 0.1)}`
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>Stock</Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>{lowStock} {lowStock === 1 ? 'producto' : 'productos'} bajo mínimo</Typography>
            </Box>
            <Box sx={{ 
              px: 0.8, py: 0.2, borderRadius: 0.5, 
              bgcolor: alpha(theme.palette.warning.main, 0.08), 
              color: 'warning.main', fontSize: '10px', fontWeight: 600 
            }}>Alerta</Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
