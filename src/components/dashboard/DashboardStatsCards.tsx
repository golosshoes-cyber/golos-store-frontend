import React from 'react'
import { Grid, Box } from '@mui/material'
import StatCard from '../ui/StatCard'
import { alpha, useTheme } from '@mui/material/styles'
import type { DashboardStatsCardsProps } from '../../types/dashboard'

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats }) => {
  const theme = useTheme()
  const deltaSx = (isNeutral = false) => ({
    fontSize: '11px',
    fontWeight: 500,
    px: 0.6,
    py: 0.1,
    borderRadius: 0.5,
    bgcolor: isNeutral ? 'action.hover' : alpha(theme.palette.success.main, 0.08),
    color: isNeutral ? 'text.secondary' : 'success.main',
  })

  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Ventas del Mes"
          value={stats?.sales?.recent_month?.total || 0}
          color="primary"
          isCurrency={true}
          meta={<>
            <Box component="span" sx={deltaSx(true)}>Sin datos</Box>
            <Box component="span" sx={{ ml: 0.5 }}>vs. mes anterior</Box>
          </>}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total productos"
          value={stats?.products?.total || 0}
          color="secondary"
          meta={<>
            <Box component="span" sx={deltaSx()}>+{stats?.products?.active_variants || 0}</Box>
            <Box component="span" sx={{ ml: 0.5 }}>variantes activas</Box>
          </>}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Proveedores activos"
          value={stats?.suppliers?.active || 0}
          color="info"
          meta={<>
            <Box component="span" sx={deltaSx(true)}>{stats?.purchases?.recent_month?.count || 0} compra</Box>
            <Box component="span" sx={{ ml: 0.5 }}>este mes</Box>
          </>}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Compras recientes"
          value={stats?.purchases?.recent_month?.count ?? 0}
          color="success"
          meta={<>
            <Box component="span" sx={deltaSx()}>Activo</Box>
            <Box component="span" sx={{ ml: 0.5 }}>este mes</Box>
          </>}
        />
      </Grid>
    </>
  )
}

export default DashboardStatsCards
