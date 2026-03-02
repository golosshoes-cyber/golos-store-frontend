import React from 'react'
import {
  Box,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material'
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material'
import GlobalSectionHeader from '../common/GlobalSectionHeader'

interface InventoryHeaderProps {
  searchTerm: string
  lowStockOnly: boolean
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onToggleLowStock: () => void
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  searchTerm,
  lowStockOnly,
  onSearchChange,
  onToggleLowStock,
}) => {
  return (
    <Box>
      <GlobalSectionHeader
        title="Inventario"
        subtitle="Gestiona tu stock y niveles de inventario en tiempo real"
        icon={<InventoryIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 1.2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <TextField
          placeholder="Buscar por producto, SKU, talla o color..."
          value={searchTerm}
          onChange={onSearchChange}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant={lowStockOnly ? 'contained' : 'outlined'}
          startIcon={<WarningIcon />}
          onClick={onToggleLowStock}
          sx={{
            minWidth: { xs: '100%', sm: 'auto' },
            borderRadius: 2,
            ...(lowStockOnly && {
              backgroundColor: 'warning.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'warning.dark',
              },
            }),
          }}
        >
          {lowStockOnly ? 'Mostrar Todo' : 'Stock Bajo'}
        </Button>
      </Box>
    </Box>
  )
}

export default InventoryHeader
