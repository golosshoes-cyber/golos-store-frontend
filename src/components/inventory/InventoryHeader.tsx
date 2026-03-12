import React from 'react'
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material'
import {
  Search as SearchIcon,
} from '@mui/icons-material'
import { alpha, useTheme } from '@mui/material/styles'

interface InventoryHeaderProps {
  searchTerm: string
  lowStockOnly: boolean
  onSearchChange: (value: string) => void
  onToggleLowStock: (checked: boolean) => void
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  searchTerm,
  lowStockOnly,
  onSearchChange,
  onToggleLowStock,
}) => {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" gap={1.2} alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }}>
        <TextField
          placeholder="Buscar en inventario..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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

        <FormControlLabel
          control={
            <Checkbox
              checked={lowStockOnly}
              onChange={(e) => onToggleLowStock(e.target.checked)}
              size="small"
              sx={{ p: 0.5, ml: 1 }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Stock Bajo
            </Typography>
          }
          sx={{ m: 0 }}
        />
      </Box>
    </Box>
  )
}

export default InventoryHeader
