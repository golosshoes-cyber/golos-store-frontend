import React from 'react'
import { Grid, Typography, Box, Paper, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { alpha, useTheme } from '@mui/material/styles'
import { Storefront as StorefrontIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDashboardLogic } from '../../hooks/dashboard/useDashboardLogic'
import { useCommonPermissions } from '../../hooks/auth/usePermissions'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardAlert from '../../components/dashboard/DashboardAlert'
import DashboardStatsCards from '../../components/dashboard/DashboardStatsCards'
import DashboardMetrics from '../../components/dashboard/DashboardMetrics'
import RecentMovements from '../../components/dashboard/RecentMovements'
import TopProducts from '../../components/dashboard/TopProducts'
import SupplierPerformance from '../../components/dashboard/SupplierPerformance'
import SalesChart from '../../components/dashboard/SalesChart'
import GradientButton from '../../components/common/GradientButton'
import { storeService } from '../../services/storeService'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { canViewReports } = useCommonPermissions()
  const {
    searchValue,
    searchOpen,
    stats,
    recentMovements,
    topProducts,
    supplierPerformance,
    salesChart,
    searchResults,
    lowStock,
    isLoading,
    movementsLoading,
    topProductsLoading,
    suppliersLoading,
    chartLoading,
    searchLoading,
    error,
    setSearchValue,
    setSearchOpen,
    getProductName,
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
    <Box
      sx={{
        position: 'relative',
        isolation: 'isolate',
        borderRadius: 4,
        p: { xs: 0.75, sm: 1, md: 1.5 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.08)} 1px, transparent 1px)`,
          backgroundSize: '34px 34px',
          zIndex: -1,
          pointerEvents: 'none',
          opacity: theme.palette.mode === 'light' ? 0.4 : 0.2,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 280,
          height: 280,
          top: -130,
          right: -110,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 72%)`,
          zIndex: -1,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header Principal del Dashboard */}
      <DashboardHeader
        searchValue={searchValue}
        searchOpen={searchOpen}
        searchLoading={searchLoading}
        searchResults={searchResults}
        onSearchValueChange={setSearchValue}
        onSearchOpenChange={setSearchOpen}
        onNavigateToVariant={(variantId) => navigate(`/variant/${variantId}`)}
        onNavigateToCreateProduct={() => navigate('/products', { state: { openCreateModal: true } })}
        onNavigateToCreateSale={() => navigate('/sales', { state: { openCreateModal: true } })}
        getProductName={getProductName}
      />

      <Grid
        container
        spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
        sx={{
          '& > .MuiGrid-item': {
            animation: 'fadeInUp 360ms ease both',
          },
          '@keyframes fadeInUp': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        {/* 1. ALERTAS CRÍTICAS (Primero) */}
        <DashboardAlert
          lowStock={lowStock}
          onViewLowStock={() => navigate('/reports?tab=3')}
        />

        {/* 2. KPIs PRINCIPALES */}
        <DashboardStatsCards stats={stats} />

        {/* 3. MÉTRICAS SECUNDARIAS */}
        <DashboardMetrics stats={stats} />

        {canViewReports && (
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.92),
                borderColor: alpha(theme.palette.primary.main, 0.25),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StorefrontIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Wompi
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.4,
                    borderRadius: 99,
                    backgroundColor: wompiHealth?.configured
                      ? alpha(theme.palette.success.main, 0.14)
                      : alpha(theme.palette.warning.main, 0.16),
                    color: wompiHealth?.configured ? 'success.main' : 'warning.main',
                    fontWeight: 700,
                  }}
                >
                  {wompiLoading ? 'Cargando...' : wompiHealth?.configured ? 'OK' : 'Incompleto'}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {wompiLoading
                  ? 'Consultando estado de configuración...'
                  : wompiHealth?.configured
                    ? `Ambiente: ${wompiHealth.environment}`
                    : `Faltan: ${(wompiHealth?.missing || []).join(', ') || 'Variables de Wompi'}`}
              </Typography>

              <Box sx={{ mt: 1.5 }}>
                <GradientButton
                  size="small"
                  onClick={() => navigate('/store/ops')}
                  sx={{
                    px: 1.6,
                    py: 0.35,
                    fontSize: '0.75rem',
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
                  Ir a Store Ops
                </GradientButton>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* 4. MOVIMIENTOS RECIENTES */}
        <RecentMovements
          movements={recentMovements?.movements}
          loading={movementsLoading}
        />

        {/* 5. TOP PRODUCTOS */}
        <TopProducts
          products={topProducts?.products}
          loading={topProductsLoading}
        />

        {/* 6. RENDIMIENTO PROVEEDORES */}
        <SupplierPerformance
          suppliers={supplierPerformance?.suppliers}
          loading={suppliersLoading}
        />

        {/* 7. GRÁFICO DE VENTAS */}
        <SalesChart
          chartData={salesChart?.chart_data}
          loading={chartLoading}
        />

      </Grid>
    </Box>
  )
}

export default DashboardPage
