import React from 'react'
import { Grid } from '@mui/material'
import MetricCard from '../ui/MetricCard'
import type { DashboardMetricsProps } from '../../types/dashboard'

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ stats }) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Inventario"
          value={stats?.products?.active_variants || 0}
          subtitle="Variantes activas"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Compras Recientes"
          value={stats?.purchases?.recent_month?.count || 0}
          subtitle="Este mes"
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <MetricCard
          title="Compras Mes"
          subtitle="Último mes"
          value={`${stats?.purchases?.recent_month?.total_quantity?.toFixed(0) || '0'} uds`}
          valueColor="info"
          additionalText={`${stats?.purchases?.recent_month?.count || 0} órdenes de compra`}
        />
      </Grid>
    </>
  )
}

export default DashboardMetrics
