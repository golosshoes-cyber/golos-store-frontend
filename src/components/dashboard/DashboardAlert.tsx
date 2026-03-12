import React from 'react'
import {
  Grid,
  Box,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Warning } from '@mui/icons-material'
import type { DashboardAlertProps } from '../../types/dashboard'

const DashboardAlert: React.FC<DashboardAlertProps> = ({ lowStock, onViewLowStock }) => {
  const theme = useTheme()

  if (lowStock <= 0) return null

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          p: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          borderRadius: 2, // 8px
          bgcolor: alpha(theme.palette.warning.main, 0.04),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
          color: 'warning.main'
        }}
      >
        <Warning sx={{ fontSize: 16 }} />
        <Typography variant="body2" sx={{ flex: 1, fontSize: '12px', fontWeight: 400 }}>
          Hay <strong>{lowStock}</strong> {lowStock === 1 ? 'producto' : 'productos'} con stock bajo que requiere atención.
        </Typography>
        <Typography 
          onClick={onViewLowStock}
          sx={{ 
            fontSize: '12px', 
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': { opacity: 0.8 }
          }}
        >
          Ver productos →
        </Typography>
      </Box>
    </Grid>
  )
}

export default DashboardAlert
