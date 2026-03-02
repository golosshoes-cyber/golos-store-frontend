import React from 'react'
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material'

interface SaleFormHeaderProps {
  isEditing: boolean
  onClose: () => void
}

const SaleFormHeader: React.FC<SaleFormHeaderProps> = ({ isEditing, onClose }) => {
  return (
    <Box sx={{ 
      pb: 2, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Mismo gradiente que el header principal
      color: 'white',
      position: 'relative',
      px: 3,
      pt: 3,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <CartIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              {isEditing ? 'Editar Venta' : 'Crear Nueva Venta'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {isEditing 
              ? 'Modifica los detalles de la venta existente'
              : 'Registra una nueva venta en el sistema'
            }
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default SaleFormHeader
