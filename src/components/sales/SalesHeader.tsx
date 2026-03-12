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
import { useTheme } from '@mui/material/styles'
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
              backgroundColor: isLight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.6)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff',
                },
                '& input': {
                  color: 'white',
                  fontSize: { xs: '0.82rem', sm: '0.9rem' },
                },
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.8)',
                },
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />,
            }}
          />

          {filterComponent}
        </Box>
      }
    />
  )
}

export default SalesHeader
