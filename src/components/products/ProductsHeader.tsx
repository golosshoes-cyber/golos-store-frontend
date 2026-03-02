import React from 'react'
import { Category as CategoryIcon, Add as AddIcon } from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import GradientButton from '../common/GradientButton'
import GlobalSectionHeader from '../common/GlobalSectionHeader'

interface ProductsHeaderProps {
  onCreateProduct: () => void
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onCreateProduct }) => {
  return (
    <GlobalSectionHeader
      title="Productos"
      subtitle="Gestiona tu catálogo de productos y sus variantes"
      icon={<CategoryIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      actions={
        <GradientButton
          startIcon={<AddIcon />}
          onClick={onCreateProduct}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: `1px solid ${alpha('#ffffff', 0.3)}`,
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.3),
              transform: 'translateY(-1px)',
            },
          }}
        >
          Crear Producto
        </GradientButton>
      }
    />
  )
}

export default ProductsHeader
