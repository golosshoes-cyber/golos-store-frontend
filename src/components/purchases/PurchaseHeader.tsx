import React from 'react'
import {
  Paper,
  Box,
  Typography,
  Button,
} from '@mui/material'
import {
  Inventory as InventoryIcon,
} from '@mui/icons-material'
import GradientButton from '../../components/common/GradientButton'

interface PurchaseHeaderProps {
  itemCount: number
  onClearAll: () => void
  onAddItem: () => void
  isMobile: boolean
}

const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({
  itemCount,
  onClearAll,
  onAddItem,
  isMobile,
}) => {
  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      mb: 3, 
      borderRadius: 3,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'column', lg: 'row' }}
        gap={{ xs: 2, sm: 2, lg: 0 }}
      >
        <Box sx={{ textAlign: { xs: 'center', sm: 'center', lg: 'left' }, flex: 1 }}>
          <Box display="flex" alignItems="center" gap={2} mb={1} justifyContent={{ xs: 'center', sm: 'center', lg: 'flex-start' }}>
            <InventoryIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', lg: '2rem' },
              }}
            >
              Nueva Compra
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: '0.875rem', sm: '0.9rem', lg: '1rem' },
              textAlign: { xs: 'center', sm: 'center', lg: 'left' }
            }}
          >
            Registrar entrada de inventario (puedes agregar múltiples items)
          </Typography>
        </Box>
        <Box 
          display="flex" 
          gap={{ xs: 1, sm: 1, lg: 2 }}
          flexDirection={{ xs: 'column', sm: 'column', lg: 'row' }}
          sx={{ width: { xs: '100%', sm: '100%', lg: 'auto' } }}
        >
          {itemCount > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={onClearAll}
              fullWidth={isMobile}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }
              }}
            >
              Limpiar Todo
            </Button>
          )}
          <GradientButton
            startIcon={<InventoryIcon />}
            onClick={onAddItem}
            fullWidth={isMobile}
          >
            Agregar Item
          </GradientButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default PurchaseHeader
