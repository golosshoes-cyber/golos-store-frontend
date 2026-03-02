import React from 'react'
import {
  Grid,
  Paper,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  CheckCircle,
  Assessment,
  Business,
} from '@mui/icons-material'
import type { SupplierPerformanceProps } from '../../types/dashboard'

const SupplierPerformance: React.FC<SupplierPerformanceProps> = ({ suppliers, loading }) => {
  const theme = useTheme()

  return (
    <Grid item xs={12} lg={6}>
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          height: 300,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.success.main, theme.palette.mode === 'light' ? 0.2 : 0.3)}`,
          background:
            theme.palette.mode === 'light'
              ? alpha('#ffffff', 0.96)
              : alpha('#0b1220', 0.86),
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 8px 22px ${alpha('#0f172a', 0.08)}`
              : `0 14px 26px ${alpha('#000000', 0.46)}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Rendimiento Proveedores</Typography>
          <Business color="action" />
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List sx={{ maxHeight: 220, overflow: 'auto' }}>
            {suppliers?.map((supplier, index: number) => (
              <React.Fragment key={supplier.id}>
                <ListItem
                  sx={{
                    px: 0,
                    transition: 'all 0.2s ease',
                    '@media (hover: hover) and (pointer: fine)': {
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        borderRadius: 2,
                        px: 1,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {supplier.is_active ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Assessment color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight="medium">
                          {supplier.name}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {supplier.total_quantity} uds
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {supplier.total_purchases} compras • {supplier.total_products} productos
                        {supplier.last_purchase && ` • Última: ${new Date(supplier.last_purchase).toLocaleDateString()}`}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < (suppliers?.length || 0) - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
            {(!suppliers || suppliers.length === 0) && (
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="No hay datos de proveedores"
                  secondary="El rendimiento de los proveedores aparecerá aquí"
                />
              </ListItem>
            )}
          </List>
        )}
      </Paper>
    </Grid>
  )
}

export default SupplierPerformance
