import React from 'react'
import {
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
} from '@mui/icons-material'

interface GradientHeaderProps {
  title: string
  subtitle?: string
  status?: string
  statusColor?: 'success' | 'primary' | 'warning' | 'error' | 'default'
  onClose?: () => void
  children?: React.ReactNode
}

const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  subtitle,
  status,
  statusColor = 'primary',
  onClose,
  children
}) => {
  return (
    <Box sx={{ 
      pb: 2, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      position: 'relative',
      px: 3, // Añadir padding horizontal
      pt: 3, // Añadir padding superior
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
              {subtitle}
            </Typography>
          )}
          {status && (
            <Chip
              label={status}
              color={statusColor}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>
        {onClose && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      {children}
    </Box>
  )
}

export default GradientHeader
