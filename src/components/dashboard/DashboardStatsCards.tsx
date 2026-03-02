import React from 'react'
import { Grid } from '@mui/material'
import { ShoppingCart, Store, LocalShipping } from '@mui/icons-material'
import StatCard from '../ui/StatCard'
import type { DashboardStatsCardsProps } from '../../types/dashboard'

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats }) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Ventas Mes Actual"
          value={stats?.sales?.recent_month?.total || 0}
          icon={<ShoppingCart />}
          color="primary"
          isCurrency={true}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Productos"
          value={stats?.products?.total || 0}
          icon={<Store />}
          color="secondary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Proveedores Activos"
          value={stats?.suppliers?.active || 0}
          icon={<LocalShipping />}
          color="info"
        />
      </Grid>
    </>
  )
}

export default DashboardStatsCards
