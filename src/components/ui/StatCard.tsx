import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface StatCardProps {
  title: string
  value: string | number
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  isCurrency?: boolean
  meta?: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ title, value, isCurrency = false, meta }) => {
  const theme = useTheme()

  // Formatear valor para COP (sin decimales)
  const formatValue = (val: string | number) => {
    if (isCurrency) {
      const numValue = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : val
      return `$${numValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }
    return val
  }

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 2, // 8px
      border: `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      <CardContent sx={{ 
        p: 2, // 16px
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography 
          sx={{ 
            fontSize: '11px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            mb: 1,
            display: 'block',
            color: 'text.secondary'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.8px',
            color: 'text.primary',
            mb: 0.8
          }}
        >
          {formatValue(value)}
        </Typography>
        {meta && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            fontSize: '11px', 
            color: 'text.secondary' 
          }}>
            {meta}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
