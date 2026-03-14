import React from 'react'
import { 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  alpha,
  useTheme
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'

interface MetricsWidgetProps {
  metrics: any
  loading: boolean
}

const MetricsWidget: React.FC<MetricsWidgetProps> = ({ metrics, loading }) => {
  const theme = useTheme()
  
  if (loading) return null

  const metricItems = [
    {
      label: 'Rotación',
      value: `${metrics?.metrics?.inventory_rotation?.value ?? 0}%`,
      icon: <TrendingUpIcon sx={{ fontSize: 16 }} />,
      color: theme.palette.info.main,
      desc: metrics?.metrics?.inventory_rotation?.description
    },
    {
      label: 'Precisión',
      value: `${metrics?.metrics?.inventory_accuracy?.value ?? 0}%`,
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />,
      color: theme.palette.success.main,
      desc: metrics?.metrics?.inventory_accuracy?.description
    },
    {
      label: 'Devoluciones',
      value: `${metrics?.metrics?.return_rate?.value ?? 0}%`,
      icon: <KeyboardReturnIcon sx={{ fontSize: 16 }} />,
      color: theme.palette.warning.main,
      desc: metrics?.metrics?.return_rate?.description
    }
  ]

  return (
    <Paper sx={{ 
      p: 1.25, 
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 1.25
    }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Rendimiento operativo</Typography>
      
      <Stack spacing={0.75}>
        {metricItems.map((item, index) => (
          <Box key={index} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            p: 0.75,
            borderRadius: 1.5,
            bgcolor: alpha(item.color, 0.04),
            border: `1px solid ${alpha(item.color, 0.1)}`
          }}>
            <Box sx={{ 
              width: 28, 
              height: 28, 
              borderRadius: 1, 
              bgcolor: alpha(item.color, 0.1),
              color: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {item.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary', lineHeight: 1 }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, mt: 0.2 }}>
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  )
}

export default MetricsWidget
