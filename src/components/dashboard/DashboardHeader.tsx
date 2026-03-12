import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Popper,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { SpaceDashboard } from '@mui/icons-material'
import GlobalSectionHeader from '../common/GlobalSectionHeader'
import type { DashboardHeaderProps } from '../../types/dashboard'

type CleanDashboardHeaderProps = Omit<DashboardHeaderProps, 'onNavigateToCreateProduct' | 'onNavigateToCreateSale'>

const DashboardHeader: React.FC<CleanDashboardHeaderProps> = ({
  searchValue,
  searchOpen,
  searchLoading,
  searchResults,
  onSearchValueChange,
  onSearchOpenChange,
  onNavigateToVariant,
  getProductName,
}) => {
  const theme = useTheme()

  return (
    <GlobalSectionHeader
      title="Dashboard"
      subtitle="Panel ejecutivo con estado comercial, inventario y operaciones en tiempo real"
      icon={<SpaceDashboard sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      actions={
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
              placeholder="Buscar producto, SKU..."
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02),
                  borderRadius: 1.5,
                  minHeight: 40,
                },
                minWidth: { xs: '100%', sm: 220, lg: 280 },
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
      }
    />
  )
}

export default DashboardHeader
