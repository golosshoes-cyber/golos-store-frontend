import React from 'react'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  FormControlLabel,
  Checkbox,
  LinearProgress,
} from '@mui/material'
import { useTheme, alpha, useMediaQuery } from '@mui/material'
import {
  Search as SearchIcon,
  ErrorOutline as LowStockIcon,
} from '@mui/icons-material'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import InventoryTable from './InventoryTable'
import InventoryCards from './InventoryCards'
import { Pagination } from '@mui/material'

interface InventoryTabsProps {
  variants: any[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void
  searchTerm: string
  onSearchChange: (val: string) => void
  lowStockOnly: boolean
  onToggleLowStock: (val: boolean) => void
  getProductInfo: (id: number) => any
  getStockStatus: (stock: number) => { label: string; color: any }
  onAdjustStock: (variant: any) => void
}

const InventoryTabs: React.FC<InventoryTabsProps> = ({
  variants,
  loading,
  page,
  totalCount,
  onPageChange,
  searchTerm,
  onSearchChange,
  lowStockOnly,
  onToggleLowStock,
  getProductInfo,
  getStockStatus,
  onAdjustStock,
}) => {
  const theme = useTheme()
  const { mode } = useThemeMode()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      mt: 2,
    }}>
      {/* LOADING INDICATOR */}
      {loading && (
        <LinearProgress
          sx={{
            height: 2,
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': { bgcolor: 'text.primary' }
          }}
        />
      )}

      {/* TABS HEADER */}
      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, px: 0.5, bgcolor: 'background.paper' }}>
        <Tabs
          value={0}
          sx={{
            minHeight: 44,
            '& .MuiTabs-indicator': {
              backgroundColor: 'text.primary',
              height: 2,
            },
            '& .MuiTab-root': {
              minHeight: 44,
              textTransform: 'none',
              fontSize: '12px',
              fontWeight: 500,
              color: 'text.disabled',
              px: 2,
              minWidth: 'auto',
              transition: 'all 0.1s ease',
              '&.Mui-selected': {
                color: 'text.primary',
              },
              '&:hover': {
                color: 'text.secondary',
              }
            },
          }}
        >
          <Tab label="Estado de Inventario" />
        </Tabs>
      </Box>

      {/* TOOLBAR */}
      <Box sx={{
        p: 1.5,
        display: 'flex',
        gap: 1.2,
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
      }}>
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: mode === 'light' ? '#f9f9f9' : '#111',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1.5,
          px: 1.2,
          py: 0.6,
          transition: 'all 0.2s',
          '&:focus-within': { borderColor: 'text.disabled' }
        }}>
          <SearchIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
          <input
            type="text"
            placeholder="Buscar por producto, talla..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '12px',
              color: theme.palette.text.primary,
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={lowStockOnly}
              onChange={(e) => onToggleLowStock(e.target.checked)}
              size="small"
              icon={<LowStockIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
              checkedIcon={<LowStockIcon sx={{ fontSize: 18, color: 'warning.main' }} />}
              sx={{ p: 0.5, ml: 1 }}
            />
          }
          label={
            <Typography variant="body2" sx={{
              fontSize: '11px',
              color: lowStockOnly ? 'warning.main' : 'text.secondary',
              fontWeight: lowStockOnly ? 700 : 500,
              whiteSpace: 'nowrap'
            }}>
              Stock Bajo
            </Typography>
          }
          sx={{ m: 0, mr: 1 }}
        />
      </Box>

      <Box sx={{ p: isMobile ? 1.5 : 0 }}>
        {isMobile ? (
          <InventoryCards
            variants={variants}
            getProductInfo={getProductInfo}
            getStockStatus={getStockStatus}
            onAdjustStock={onAdjustStock}
          />
        ) : (
          <InventoryTable
            variants={variants}
            getProductInfo={getProductInfo}
            getStockStatus={getStockStatus}
            onAdjustStock={onAdjustStock}
          />
        )}
      </Box>

      {/* FOOTER / PAGINATION INTEGRATED */}
      <Box sx={{
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
      }}>
        <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
          {totalCount} variantes · Página {page} de {Math.ceil(totalCount / 20) || 1}
        </Typography>
        <Pagination
          count={Math.ceil(totalCount / 20)}
          page={page}
          onChange={onPageChange}
          size="small"
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: '11px',
              height: 28,
              minWidth: 28,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              '&.Mui-selected': { bgcolor: 'text.primary', color: 'background.default', border: 'none' },
              '&:hover': { borderColor: 'text.disabled' }
            }
          }}
        />
      </Box>

    </Box>
  )
}

export default InventoryTabs
