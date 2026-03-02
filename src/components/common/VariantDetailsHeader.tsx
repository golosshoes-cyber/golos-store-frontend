import React from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material'

interface ProductDetailsHeaderProps {
  
}

const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({  
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
              Detalles de la Variante
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
            Revisa toda la información de la variante 
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductDetailsHeader
