import React from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useQuery } from '@tanstack/react-query'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import { notificationService } from '../../services/notificationService'

const NotificationsPage: React.FC = () => {
  const { data: alerts, isLoading: loadingAlerts } = useQuery({
    queryKey: ['notifications-low-stock'],
    queryFn: () => notificationService.getLowStockAlerts(),
  })
  const { data: dailySummary, isLoading: loadingDaily } = useQuery({
    queryKey: ['notifications-daily-summary'],
    queryFn: () => notificationService.getDailySummary(),
  })
  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['notifications-supplier-recommendations'],
    queryFn: () => notificationService.getSupplierRecommendations(),
  })
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['notifications-performance-metrics'],
    queryFn: () => notificationService.getPerformanceMetrics(),
  })

  if (loadingAlerts || loadingDaily || loadingRecommendations || loadingMetrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Notificaciones Inteligentes"
        subtitle="Alertas, métricas y recomendaciones operativas en tiempo real"
        icon={<NotificationsActiveIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      />

      <Stack spacing={2}>
        <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <WarningAmberIcon color="warning" />
            <Typography variant="h6" fontWeight={700}>
              Alertas de Stock
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Total alertas: <strong>{alerts?.total_alerts || 0}</strong>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.2 }}>
            <Chip color="error" label={`Críticas: ${alerts?.summary?.critical_count || 0}`} />
            <Chip color="warning" label={`Advertencias: ${alerts?.summary?.warning_count || 0}`} />
            <Chip color="info" label={`Info: ${alerts?.summary?.info_count || 0}`} />
          </Box>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <QueryStatsIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Resumen Diario
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Fecha: {dailySummary?.date || '-'}
          </Typography>
          <Box sx={{ mt: 1.2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
            <Alert severity="info">Ventas hoy: {dailySummary?.activities?.sales?.today || 0}</Alert>
            <Alert severity="success">Compras hoy: {dailySummary?.activities?.purchases || 0}</Alert>
            <Alert severity="warning">Ajustes hoy: {dailySummary?.activities?.adjustments || 0}</Alert>
            <Alert severity="info">Productos nuevos: {dailySummary?.activities?.new_products || 0}</Alert>
          </Box>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <LocalShippingIcon color="secondary" />
            <Typography variant="h6" fontWeight={700}>
              Recomendaciones de Proveedor
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Proveedores sugeridos: {recommendations?.total_suppliers || 0}
          </Typography>
          <Stack spacing={1}>
            {(recommendations?.recommendations || []).slice(0, 5).map((item: any) => (
              <Paper key={item.supplier_name} variant="outlined" sx={{ p: 1.2 }}>
                <Typography fontWeight={600}>{item.supplier_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Variantes recomendadas: {item.total_variants}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.2 }}>
            Métricas de Rendimiento
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1 }}>
            <Alert severity="info">
              Rotación: {metrics?.metrics?.inventory_rotation?.value ?? 0}%
            </Alert>
            <Alert severity="success">
              Precisión: {metrics?.metrics?.inventory_accuracy?.value ?? 0}%
            </Alert>
            <Alert severity="warning">
              Devoluciones: {metrics?.metrics?.return_rate?.value ?? 0}%
            </Alert>
          </Box>
        </Paper>
      </Stack>
    </PageShell>
  )
}

export default NotificationsPage
