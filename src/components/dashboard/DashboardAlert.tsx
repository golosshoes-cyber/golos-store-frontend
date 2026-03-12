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
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.warning.main, 0.04),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
        }}
      >
        <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
        <Typography variant="body2" sx={{ flex: 1, color: 'text.primary' }}>
          Hay <strong>{lowStock}</strong> productos con stock bajo.
        </Typography>
        <Button
          variant="text"
          size="small"
          sx={{ ml: { xs: 0, sm: 'auto' }, alignSelf: { xs: 'flex-end', sm: 'center' } }}
          onClick={onViewLowStock}
        >
          Ver productos
        </Button>
      </Box>
    </Grid>
  )
}

export default DashboardAlert
