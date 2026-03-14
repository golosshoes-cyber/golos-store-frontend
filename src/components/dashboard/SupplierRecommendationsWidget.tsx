import React from 'react'
import { 
  Paper, 
  Typography, 
  Box, 
  alpha,
  useTheme,
  Grid,
  CircularProgress
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

interface SupplierRecommendationsWidgetProps {
  recommendations: any
  loading: boolean
}

const SupplierRecommendationsWidget: React.FC<SupplierRecommendationsWidgetProps> = ({ recommendations, loading }) => {
  const theme = useTheme()
  
  const items = recommendations?.recommendations || []
  const hasData = !loading && items.length > 0

  return (
    <Paper sx={{ 
      p: 1.25, 
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LocalShippingIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>Abastecimiento</Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
          <CircularProgress size={20} thickness={4} sx={{ color: 'action.disabled' }} />
        </Box>
      ) : hasData ? (
        <Grid container spacing={0.75}>
          {items.slice(0, 4).map((item: any, index: number) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ 
                p: 0.75,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.warning.main, 0.04),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.2
              }}>
                <Typography noWrap sx={{ fontSize: '11px', fontWeight: 700 }}>
                  {item.supplier_name}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                  {item.total_variants} {item.total_variants === 1 ? 'variante' : 'variantes'} a reponer
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flex={1} gap={0.75}>
          <CheckCircleOutlineIcon sx={{ fontSize: 28, color: 'success.main', opacity: 0.6 }} />
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', textAlign: 'center' }}>
            Stock de proveedores<br />en niveles óptimos
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default SupplierRecommendationsWidget
