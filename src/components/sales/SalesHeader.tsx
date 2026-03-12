import React from 'react'
import {
  Box,
  TextField,
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material'
import { alpha, useTheme } from '@mui/material/styles'
import GradientButton from '../../components/common/GradientButton'
import GlobalSectionHeader from '../common/GlobalSectionHeader'

interface SalesHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onCreateSale: () => void
  isMobile: boolean
  filterComponent?: React.ReactNode
}

const SalesHeader: React.FC<SalesHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onCreateSale,
  isMobile,
  filterComponent,
}) => {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  return (
    <GlobalSectionHeader
      title="Gestión de Ventas"
      subtitle="Administra y monitorea todas las ventas de tu negocio"
      icon={<ShoppingCartIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      actions={
        <GradientButton
          startIcon={<AddIcon />}
          onClick={onCreateSale}
          fullWidth={isMobile}
          size="small"
        >
          Crear Venta
        </GradientButton>
      }
      bottomContent={
        <Box display="flex" gap={1.2} alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }}>
          <TextField
            placeholder="Buscar ventas..."
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value)
            }}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: isLight ? alpha('#000', 0.02) : alpha('#fff', 0.02),
                borderRadius: 1.5,
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />,
            }}
          />

          {filterComponent}
        </Box>
      }
    />
  )
}

export default SalesHeader
