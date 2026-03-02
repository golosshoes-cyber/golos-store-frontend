import React from 'react'
import {
  Box,
  Typography,
  Chip,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material'

interface ProductDetailsHeaderProps {
  isActive: boolean
}

const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({  
  isActive, 
}) => {
  return (
    <Box sx={{ 
      pb: 2, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Mismo gradiente principal
      color: 'white',
      position: 'relative',
      px: 3,
      pt: 3,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <VisibilityIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              Detalles del Producto
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
            Revisa toda la información del producto
          </Typography>
          <Chip
            label={isActive ? 'Activo' : 'Inactivo'}
            color={isActive ? 'success' : 'default'}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ProductDetailsHeader
