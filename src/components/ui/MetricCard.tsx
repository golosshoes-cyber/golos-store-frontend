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
      p: 2.5,
      height: '100%',
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
      boxShadow: 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: alpha(theme.palette.primary.main, 0.2),
        boxShadow: `0 4px 12px ${alpha('#000', 0.03)}`,
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
