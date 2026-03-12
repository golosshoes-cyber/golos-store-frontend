import React from 'react'
import {
  Grid,
  Box,
  Typography,
  Button,
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
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.warning.main, 0.03),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
        }}
      >
        <Warning sx={{ color: 'warning.main', fontSize: 18 }} />
        <Typography variant="caption" sx={{ flex: 1, color: 'text.primary', fontWeight: 500 }}>
          Hay <strong>{lowStock}</strong> {lowStock === 1 ? 'producto' : 'productos'} con stock bajo que requiere atención.
        </Typography>
        <Button
          variant="text"
          size="small"
          sx={{ 
            fontSize: '11px', 
            textTransform: 'none', 
            minWidth: 'auto',
            p: 0,
            color: 'warning.main',
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
          }}
          onClick={onViewLowStock}
        >
          Ver productos →
        </Button>
      </Box>
    </Grid>
  )
}

export default DashboardAlert
