import React from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import {
  Inventory as InventoryIcon,
} from '@mui/icons-material'

interface InventoryAdjustmentHeaderProps {
}

const InventoryAdjustmentHeader: React.FC<InventoryAdjustmentHeaderProps> = () => {
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
            <InventoryIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              Ajustar Inventario
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Modifica el stock de un producto y registra el motivo del cambio
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default InventoryAdjustmentHeader
