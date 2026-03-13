import React from 'react'
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { SalesChartProps } from '../../types/dashboard'

const SalesChart: React.FC<SalesChartProps> = ({ chartData, loading }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          height: 280,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ 
          px: 2, 
          py: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary', letterSpacing: '-0.1px' }}>
            Ventas últimos 30 días
          </Typography>
          <Typography 
            onClick={() => navigate('/reports')}
            sx={{ fontSize: '14px', color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
          >
            ↗
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box sx={{ flex: 1, p: 2, pb: 0, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData || []} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.palette.text.primary} stopOpacity={0.12}/>
                    <stop offset="100%" stopColor={theme.palette.text.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  hide={true}
                />
                <YAxis 
                  hide={true}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ventas']}
                  labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString()}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke={theme.palette.text.primary} 
                  strokeWidth={1.5}
                  strokeOpacity={0.3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Grid>
  )
}

export default SalesChart
