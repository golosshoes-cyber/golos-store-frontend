import React from 'react'
import { Grid } from '@mui/material'
import { 
  ShoppingCartOutlined as ShoppingCartIcon, 
  Inventory2Outlined as InventoryIcon, 
  LocalShippingOutlined as ShippingIcon,
  CurrencyExchangeOutlined as RevenueIcon
} from '@mui/icons-material'
import StatCard from '../ui/StatCard'
import type { DashboardStatsCardsProps } from '../../types/dashboard'

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats }) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Ventas del Mes"
          value={stats?.sales?.recent_month?.total || 0}
          icon={<ShoppingCartIcon />}
          color="primary"
          isCurrency={true}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Productos Activos"
          value={stats?.products?.active_variants || 0}
          icon={<InventoryIcon />}
          color="secondary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Proveedores Activos"
          value={stats?.suppliers?.active || 0}
          icon={<ShippingIcon />}
          color="info"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Valor Inventario"
          value={stats?.products?.inventory_value || 0}
          icon={<RevenueIcon />}
          color="success"
          isCurrency={true}
        />
      </Grid>
    </>
  )
}

export default DashboardStatsCards
