import React from 'react'
import {
  Box,
  Typography,
  Chip,
} from '@mui/material'
import {
  Receipt as ReceiptIcon,
} from '@mui/icons-material'

interface SaleDetailsHeaderProps {
  saleId: number | undefined
  status: string
  statusColor: 'success' | 'primary' | 'warning' | 'error' | 'default'
}

const SaleDetailsHeader: React.FC<SaleDetailsHeaderProps> = ({ 
  saleId, 
  status, 
  statusColor
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendiente'
      case 'canceled':
        return 'Cancelada'
      default:
        return status
    }
  }

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
            <ReceiptIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              Detalles de Venta #{saleId}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
            Revisa toda la información de esta transacción
          </Typography>
          <Chip
            label={getStatusLabel(status)}
            color={statusColor}
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

export default SaleDetailsHeader
