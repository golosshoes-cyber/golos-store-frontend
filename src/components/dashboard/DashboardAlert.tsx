import React from 'react'
import {
  Grid,
  Paper,
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
      <Paper
        sx={{
          p: { xs: 1.25, sm: 1.6 },
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 1.5 },
          borderRadius: 3,
          bgcolor:
            theme.palette.mode === 'light'
              ? alpha(theme.palette.warning.light, 0.28)
              : alpha(theme.palette.warning.dark, 0.24),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.5)}`,
          boxShadow: `0 8px 20px ${alpha(theme.palette.warning.main, 0.2)}`,
        }}
      >
        <Warning color="warning" />
        <Typography>
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
      </Paper>
    </Grid>
  )
}

export default DashboardAlert
