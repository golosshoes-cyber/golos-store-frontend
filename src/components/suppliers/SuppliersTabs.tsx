import React from 'react'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  LinearProgress,
  Pagination,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Search as SearchIcon,
} from '@mui/icons-material'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import SuppliersTable from './SuppliersTable'
import SuppliersCards from './SuppliersCards'
import { Supplier } from '../../types'

interface SuppliersTabsProps {
  suppliers: Supplier[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (page: number) => void
  onEdit: (supplier: Supplier) => void
  onDelete: (supplierId: number) => void
  searchTerm: string
  onSearchChange: (val: string) => void
}

const SuppliersTabs: React.FC<SuppliersTabsProps> = ({
  suppliers,
  loading,
  page,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
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
          <Tab label="Todos los Proveedores" />
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
            placeholder="Buscar por nombre, NIT o teléfono..."
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
      </Box>

      {/* TABLE / CARDS AREA */}
      <Box sx={{ p: isMobile ? 1.5 : 0 }}>
        {isMobile ? (
          <SuppliersCards
            suppliers={suppliers}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <SuppliersTable
            suppliers={suppliers}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
            search={searchTerm}
          />
        )}
      </Box>

      {/* FOOTER / PAGINATION INTEGRATED */}
      <Box sx={{ 
        p: 1.2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
      }}>
        <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
          {totalCount} proveedores · Página {page} de {Math.ceil(totalCount / 20) || 1}
        </Typography>
        <Pagination
          count={Math.ceil(totalCount / 20)}
          page={page}
          onChange={(_: React.ChangeEvent<unknown>, newPage: number) => onPageChange(newPage)}
          size="small"
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: '11px',
              height: 26,
              minWidth: 26,
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

export default SuppliersTabs
