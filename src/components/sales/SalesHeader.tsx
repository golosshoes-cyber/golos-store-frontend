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
import { alpha } from '@mui/material/styles'
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
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: `1px solid ${alpha('#ffffff', 0.3)}`,
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.3),
            },
          }}
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
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255,255,255,0.7)',
                },
                '& input': {
                  color: 'white',
                  fontSize: { xs: '0.82rem', sm: '0.9rem' },
                },
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
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
