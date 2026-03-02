import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Popper,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { AddBox, AddShoppingCart, SpaceDashboard } from '@mui/icons-material'
import GradientButton from '../common/GradientButton'
import GlobalSectionHeader from '../common/GlobalSectionHeader'
import type { DashboardHeaderProps } from '../../types/dashboard'

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchValue,
  searchOpen,
  searchLoading,
  searchResults,
  onSearchValueChange,
  onSearchOpenChange,
  onNavigateToVariant,
  onNavigateToCreateProduct,
  onNavigateToCreateSale,
  getProductName,
}) => {
  const theme = useTheme()

  return (
    <GlobalSectionHeader
      title="Dashboard"
      subtitle="Panel ejecutivo con estado comercial, inventario y operaciones en tiempo real"
      icon={<SpaceDashboard sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      actions={
        <>
          <Autocomplete
            open={searchOpen && searchValue.length >= 2}
            onOpen={() => searchValue.length >= 2 && onSearchOpenChange(true)}
            onClose={() => onSearchOpenChange(false)}
            options={searchResults?.results || []}
            getOptionLabel={(option: any) =>
              `${option.sku} - ${getProductName(option.product)} ${option.size} ${option.color || ''}`
            }
            loading={searchLoading}
            onInputChange={(_, value) => onSearchValueChange(value)}
            onChange={(_, value: any) => {
              if (value) {
                onNavigateToVariant(value.id)
                onSearchValueChange('')
                onSearchOpenChange(false)
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Buscar producto..."
                size="small"
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'light'
                      ? alpha('#ffffff', 0.72)
                      : alpha('#0b1220', 0.45),
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    color: theme.palette.mode === 'light' ? theme.palette.text.primary : '#ffffff',
                    minHeight: 42,
                    '& fieldset': {
                      borderColor:
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.primary.dark, 0.22)
                          : alpha('#ffffff', 0.32),
                    },
                    '&:hover fieldset': {
                      borderColor:
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.primary.main, 0.5)
                          : alpha('#ffffff', 0.58),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor:
                        theme.palette.mode === 'light' ? theme.palette.primary.main : '#ffffff',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color:
                      theme.palette.mode === 'light'
                        ? alpha(theme.palette.text.primary, 0.6)
                        : 'rgba(255,255,255,0.7)',
                    opacity: 1,
                  },
                  minWidth: { xs: '100%', sm: 210, lg: 250 },
                }}
              />
            )}
            renderOption={(props, option: any) => {
              const { key, ...other } = props
              return (
                <li key={key} {...other}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {option.sku}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getProductName(option.product)} {option.size} {option.color || ''}
                    </Typography>
                  </Box>
                </li>
              )
            }}
            PopperComponent={(props) => <Popper {...props} sx={{ zIndex: 1300 }} />}
            sx={{ minWidth: { xs: '100%', sm: 210, lg: 250 } }}
          />
          <GradientButton
            startIcon={<AddBox />}
            onClick={onNavigateToCreateProduct}
            sx={{
              minHeight: 42,
              minWidth: { xs: '100%', sm: 112 },
              backgroundColor:
                theme.palette.mode === 'light'
                  ? alpha('#ffffff', 0.82)
                  : alpha('#ffffff', 0.2),
              color: theme.palette.mode === 'light' ? theme.palette.primary.dark : 'white',
              border: `1px solid ${
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.primary.main, 0.28)
                  : alpha('#ffffff', 0.3)
              }`,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? alpha('#ffffff', 0.95)
                    : alpha('#ffffff', 0.3),
                transform: 'translateY(-1px)',
              },
            }}
          >
            Producto
          </GradientButton>
          <GradientButton
            startIcon={<AddShoppingCart />}
            onClick={onNavigateToCreateSale}
            sx={{
              minHeight: 42,
              minWidth: { xs: '100%', sm: 112 },
              backgroundColor:
                theme.palette.mode === 'light'
                  ? alpha('#ffffff', 0.82)
                  : alpha('#ffffff', 0.2),
              color: theme.palette.mode === 'light' ? theme.palette.primary.dark : 'white',
              border: `1px solid ${
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.primary.main, 0.28)
                  : alpha('#ffffff', 0.3)
              }`,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? alpha('#ffffff', 0.95)
                    : alpha('#ffffff', 0.3),
                transform: 'translateY(-1px)',
              },
            }}
          >
            Venta
          </GradientButton>
        </>
      }
    />
  )
}

export default DashboardHeader
