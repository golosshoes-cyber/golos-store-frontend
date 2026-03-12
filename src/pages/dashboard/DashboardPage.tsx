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
import { storeService } from '../../services/storeService'
import { Button } from '@mui/material'

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
    <Box sx={{ py: 1 }}>
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
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StorefrontIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Estado Wompi
                  </Typography>
                </Box>
                <Box sx={{ 
                  px: 1, 
                  py: 0.25, 
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  bgcolor: wompiHealth?.configured ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.warning.main, 0.08),
                  color: wompiHealth?.configured ? 'success.main' : 'warning.main',
                  border: `1px solid ${wompiHealth?.configured ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.warning.main, 0.2)}`
                }}>
                  {wompiLoading ? '...' : wompiHealth?.configured ? 'Conectado' : 'Incompleto'}
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                {wompiLoading
                  ? 'Consultando configuración...'
                  : wompiHealth?.configured
                    ? `Ambiente activo: ${wompiHealth.environment}`
                    : `Pendiente: ${(wompiHealth?.missing || []).join(', ')}`}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/store/ops')}
                  sx={{
                    fontSize: '11px',
                    py: 0.4,
                    px: 1.5,
                    borderRadius: 1.5,
                  }}
                >
                  Configurar
                </Button>
              </Box>
            </Box>
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
