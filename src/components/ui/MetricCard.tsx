import React from 'react'
import {
  Paper,
  Typography,
  Box,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

interface MetricCardProps {
  title: string
  subtitle: string
  value: string | number
  valueColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  additionalText?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  subtitle,
  value,
  valueColor = 'primary',
  additionalText,
}) => {
  const theme = useTheme()

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 2.5, md: 3 },
      height: '100%',
      minHeight: { xs: '140px', sm: '140px', md: '140px' },
      borderRadius: 4,
      border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.12 : 0.26)}`,
      background:
        theme.palette.mode === 'light'
          ? alpha('#ffffff', 0.96)
          : alpha('#0b1220', 0.86),
      transition: 'all 0.25s ease',
      boxShadow:
        theme.palette.mode === 'light'
          ? `0 6px 16px ${alpha('#0f172a', 0.07)}`
          : `0 10px 24px ${alpha('#000000', 0.42)}`,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow:
          theme.palette.mode === 'light'
            ? `0 10px 22px ${alpha(theme.palette.primary.main, 0.14)}`
            : `0 14px 28px ${alpha('#000000', 0.52)}`,
      }
    }}>
    <Typography 
      variant="h6" 
      gutterBottom
      sx={{ 
        fontSize: { xs: '0.875rem', sm: '0.875rem', md: '1rem' },
        fontWeight: 'medium',
        textAlign: { xs: 'center', sm: 'center', md: 'left' }
      }}
    >
      {title}
    </Typography>
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between"
      flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
      gap={{ xs: 1, sm: 1, md: 0 }}
    >
      <Typography 
        variant="body2" 
        color="textSecondary"
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.875rem' },
          textAlign: { xs: 'center', sm: 'center', md: 'left' },
          flex: 1
        }}
      >
        {subtitle}
      </Typography>
      <Typography 
        variant="h5" 
        color={valueColor} 
        sx={{ 
          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.5rem' },
          fontWeight: 'bold',
          lineHeight: 1.2,
          wordBreak: 'break-word'
        }}
      >
        {value}
      </Typography>
    </Box>
    {additionalText && (
      <Typography 
        variant="body2" 
        color="textSecondary" 
        sx={{ 
          mt: 1,
          fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.875rem' },
          textAlign: { xs: 'center', sm: 'center', md: 'left' }
        }}
      >
        {additionalText}
      </Typography>
    )}
    </Paper>
  )
}

export default MetricCard
