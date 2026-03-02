import React from 'react'
import {
  Grid,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts'
import { TrendingUp } from '@mui/icons-material'
import type { SalesChartProps } from '../../types/dashboard'

const SalesChart: React.FC<SalesChartProps> = ({ chartData, loading }) => {
  const theme = useTheme()

  return (
    <Grid item xs={12} lg={8}>
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          height: { xs: 340, sm: 400 },
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.2 : 0.3)}`,
          background:
            theme.palette.mode === 'light'
              ? alpha('#ffffff', 0.96)
              : alpha('#0b1220', 0.88),
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 8px 22px ${alpha('#0f172a', 0.08)}`
              : `0 14px 26px ${alpha('#000000', 0.46)}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Ventas Últimos 30 Días</Typography>
          <TrendingUp color="action" />
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData || []}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.14)} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
                  backgroundColor: alpha(theme.palette.background.paper, 0.92),
                  backdropFilter: 'blur(6px)',
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total Ventas']}
                labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString('es-ES')}`}
              />
              <Area type="monotone" dataKey="total" fill="url(#salesGradient)" stroke="none" />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 7, fill: theme.palette.secondary.main, stroke: theme.palette.background.paper, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Grid>
  )
}

export default SalesChart
