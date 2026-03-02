import React from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import {
  Category as CategoryIcon,
} from '@mui/icons-material'

interface ProductFormHeaderProps {
  isEditing: boolean
}

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({ isEditing }) => {
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
            <CategoryIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {isEditing 
              ? 'Modifica los detalles del producto existente'
              : 'Agrega un nuevo producto al catálogo'
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductFormHeader
