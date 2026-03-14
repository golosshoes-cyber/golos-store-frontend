import React from 'react'
import { Category as CategoryIcon, Add as AddIcon } from '@mui/icons-material'
import { Button, Box, useTheme, useMediaQuery } from '@mui/material'
import GlobalSectionHeader from '../common/GlobalSectionHeader'
import ExportButton from '../common/ExportButton'
import { exportService } from '../../services/exportService'

interface ProductsHeaderProps {
  onCreateProduct: () => void
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onCreateProduct }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <GlobalSectionHeader
      title="Productos"
      subtitle="Gestiona tu catálogo de productos y sus variantes"
      icon={<CategoryIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: 'text.secondary', opacity: 0.8 }} />}
      actions={
        <Box sx={{ display: 'flex', gap: 1, width: isMobile ? '100%' : 'auto' }}>
          <ExportButton 
            onExport={(format) => exportService.exportProducts(format)} 
            fullWidth={isMobile}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateProduct}
            fullWidth={isMobile}
            sx={{
              bgcolor: 'text.primary',
              color: 'background.default',
              borderRadius: 1.5,
              px: 2.5,
              py: 0.8,
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'text.secondary',
                opacity: 0.9,
              }
            }}
          >
            Crear producto
          </Button>
        </Box>
      }
    />
  )
}

export default ProductsHeader
