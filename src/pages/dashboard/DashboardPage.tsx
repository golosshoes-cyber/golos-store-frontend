import React from 'react'
import { Grid, Typography, Box, Paper, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { useDashboardLogic } from '../../hooks/dashboard/useDashboardLogic'
import { useCommonPermissions } from '../../hooks/auth/usePermissions'
import DashboardAlert from '../../components/dashboard/DashboardAlert'
import DashboardStatsCards from '../../components/dashboard/DashboardStatsCards'
import RecentMovements from '../../components/dashboard/RecentMovements'
import TopProducts from '../../components/dashboard/TopProducts'
import SupplierPerformance from '../../components/dashboard/SupplierPerformance'
import SalesChart from '../../components/dashboard/SalesChart'
import { storeService } from '../../services/storeService'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { canViewReports } = useCommonPermissions()
  const {
    stats,
    recentMovements,
    topProducts,
    supplierPerformance,
    salesChart,
    lowStock,
    isLoading,
    movementsLoading,
    topProductsLoading,
    suppliersLoading,
    chartLoading,
    error,
  } = useDashboardLogic()

  const { data: wompiHealth, isLoading: wompiLoading } = useQuery({
    queryKey: ['store-wompi-health-dashboard'],
    queryFn: () => storeService.getWompiHealth(),
    enabled: canViewReports,
  })

  if (isLoading) {
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
    <Box sx={{ height: 'fit-content' }}>
      {/* PAGE HEADER */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h6" sx={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            letterSpacing: '-0.3px',
            color: 'text.primary',
            lineHeight: 1.2
          }}>
            Panel ejecutivo
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.8, fontSize: '11px' }}>
            Estado comercial, inventario y operaciones · Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      <Grid
        container
        spacing={1.2}
        sx={{
          height: 'calc(100vh - 120px)', // Occupy remaining viewport
          '& > .MuiGrid-item': {
            animation: 'fadeInUp 360ms ease both',
          },
          '@keyframes fadeInUp': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        {/* 1. ALERTAS CRÍTICAS */}
        <Grid item xs={12}>
          <DashboardAlert
            lowStock={lowStock}
            onViewLowStock={() => navigate('/reports?tab=3')}
          />
        </Grid>

        {/* 2. KPIs PRINCIPALES (Row 1) */}
        <DashboardStatsCards stats={stats} />

        {/* Row 2: Movimientos y Top Productos */}
        <Grid item xs={12} md={6}>
          <RecentMovements
            movements={recentMovements?.movements}
            loading={movementsLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopProducts
            products={topProducts?.products}
            loading={topProductsLoading}
          />
        </Grid>

        {/* Row 3: Ventas 30 días y Rendimiento Proveedores */}
        <Grid item xs={12} md={7}>
          <SalesChart
            chartData={salesChart?.chart_data}
            loading={chartLoading}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <SupplierPerformance
            suppliers={supplierPerformance?.suppliers}
            loading={suppliersLoading}
          />
        </Grid>

        {/* Footer Row: Wompi & Alertas */}
        {canViewReports && (
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.2 }}>
                  Pasarela Wompi
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  Ambiente: {wompiHealth?.environment || '...'}
                </Typography>
              </Box>
              <Box sx={{ 
                px: 1, 
                py: 0.2, 
                borderRadius: 1,
                fontSize: '10px',
                fontWeight: 600,
                bgcolor: wompiHealth?.configured ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.warning.main, 0.08),
                color: wompiHealth?.configured ? 'success.main' : 'warning.main',
                border: `1px solid ${wompiHealth?.configured ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.warning.main, 0.2)}`
              }}>
                {wompiLoading ? '...' : wompiHealth?.configured ? 'OK' : 'Incompleto'}
              </Box>
            </Box>
          </Grid>
        )}

        {/* ROW 3: STATUS GRID */}
        <Grid item xs={12}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ 
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <Box sx={{ 
                  width: 7, 
                  height: 7, 
                  borderRadius: '50%', 
                  bgcolor: 'success.main',
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
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <Box sx={{ 
                  width: 7, 
                  height: 7, 
                  borderRadius: '50%', 
                  bgcolor: 'success.main',
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
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <Box sx={{ 
                  width: 7, 
                  height: 7, 
                  borderRadius: '50%', 
                  bgcolor: 'warning.main',
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
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
