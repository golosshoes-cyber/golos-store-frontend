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
        p: { xs: 2, sm: 2.5, md: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
          gap={{ xs: 2, sm: 2, md: 0 }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'center', md: 'left' }, flex: 1 }}>
            <Typography 
              color="textSecondary" 
              gutterBottom 
              variant="h6"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '0.875rem', md: '1rem' },
                fontWeight: 'medium',
                mb: { xs: 0.5, sm: 0.5, md: 1 }
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '2.125rem' },
                fontWeight: 'bold',
                lineHeight: 1.2,
                wordBreak: 'break-word'
              }}
            >
              {formatValue(value)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette[color].main, 0.08),
              color: `${color}.main`,
              borderRadius: 1.5,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
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
