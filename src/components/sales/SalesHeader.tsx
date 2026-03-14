import React from 'react'
import { ShoppingCart as ShoppingCartIcon, Add as AddIcon } from '@mui/icons-material'
import { Box } from '@mui/material'
import GradientButton from '../../components/common/GradientButton'
import GlobalSectionHeader from '../common/GlobalSectionHeader'
import ExportButton from '../common/ExportButton'
import { exportService } from '../../services/exportService'

interface SalesHeaderProps {
  onCreateSale: () => void
  isMobile: boolean
}

const SalesHeader: React.FC<SalesHeaderProps> = ({
  onCreateSale,
  isMobile,
}) => {
  return (
    <GlobalSectionHeader
      title="Gestión de Ventas"
      subtitle="Administra y monitorea todas las ventas de tu negocio"
      icon={<ShoppingCartIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      actions={
        <Box sx={{ display: 'flex', gap: 1, width: isMobile ? '100%' : 'auto' }}>
          <ExportButton 
            onExport={(format) => exportService.exportSales(format)} 
            fullWidth={isMobile}
          />
          <GradientButton
            startIcon={<AddIcon />}
            onClick={onCreateSale}
            fullWidth={isMobile}
            size="small"
          >
            Crear Venta
          </GradientButton>
        </Box>
      }
    />
  )
}

export default SalesHeader
