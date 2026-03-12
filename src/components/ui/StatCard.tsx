import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  isCurrency?: boolean  // Nuevo prop para identificar valores de moneda
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isCurrency = false }) => {
  const theme = useTheme()

  // Formatear valor para COP (sin decimales)
  const formatValue = (val: string | number) => {
    if (isCurrency) {
      // Si es moneda, quitar decimales y formatear con separadores de miles
      const numValue = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : val
      return `$${numValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }
    return val
  }

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
      boxShadow: 'none',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
      '&:hover': {
        border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
        bgcolor: alpha(theme.palette[color].main, 0.02),
      }
    }}>
      <CardContent sx={{ 
        p: 1.2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          gap={1}
        >
          <Box sx={{ textAlign: 'left', flex: 1 }}>
            <Typography 
              color="textSecondary" 
              variant="caption"
              sx={{ 
                fontSize: '9px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 0.2,
                display: 'block',
                opacity: 0.7
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontSize: '1.25rem',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.5px'
              }}
            >
              {formatValue(value)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette[color].main, 0.05),
              color: `${color}.main`,
              borderRadius: 1,
              p: 0.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiSvgIcon-root': {
                fontSize: 18
              }
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard
