import React from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import {
  Style as StyleIcon,
} from '@mui/icons-material'

interface VariantFormHeaderProps {
  isEditing: boolean
}

const VariantFormHeader: React.FC<VariantFormHeaderProps> = ({ isEditing }) => {
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
            <StyleIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              {isEditing ? 'Editar Variante' : 'Nueva Variante'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {isEditing 
              ? 'Modifica los detalles de la variante existente'
              : 'Agrega una nueva variante al producto'
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default VariantFormHeader
