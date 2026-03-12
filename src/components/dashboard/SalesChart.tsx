import React from 'react'
import {
  Grid,
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
      <Box
        sx={{
          p: 2.5,
          height: '100%',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: 'none',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Ventas Últimos 30 Días
          </Typography>
          <TrendingUp sx={{ fontSize: 18, color: 'text.secondary' }} />
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
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: `0 4px 12px ${alpha('#000', 0.08)}`,
                  fontSize: '12px'
                }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ventas']}
                labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString('es-ES')}`}
              />
              <Area type="monotone" dataKey="total" fill="url(#salesGradient)" stroke="none" />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: theme.palette.primary.main, stroke: theme.palette.background.paper, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Grid>
  )
}

export default SalesChart
