import React from 'react'
import {
  Box,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemText,
  Button,
  Pagination,
  Typography,
  LinearProgress,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Check as CheckIcon,
} from '@mui/icons-material'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import SalesTable from './SalesTable'
import type { Sale } from '../../types'

interface SalesTabsProps {
  sales: Sale[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (page: number) => void
  onEdit: (sale: Sale) => void
  onConfirm: (saleId: number) => void
  onCancel: (saleId: number) => void
  onViewDetails: (sale: Sale) => void
  
  // Search & Filter
  searchTerm: string
  onSearchChange: (val: string) => void
  filterStatus: string
  setFilterStatus: (status: string) => void
  filterOptions: Array<{ value: string; label: string }>
  
  // Sorting & Selection
  salesSort: string
  setSalesSort: (val: string) => void
  selectedSales: number[]
  setSelectedSales: (val: number[]) => void
}

const SalesTabs: React.FC<SalesTabsProps> = ({
  sales,
  loading,
  page,
  totalCount,
  onPageChange,
  onEdit,
  onConfirm,
  onCancel,
  onViewDetails,
  searchTerm,
  onSearchChange,
  filterStatus,
  setFilterStatus,
  filterOptions,
  salesSort,
  setSalesSort,
  selectedSales,
  setSelectedSales,
}) => {
  const theme = useTheme()
  const { mode } = useThemeMode()

  // Menu States
  const [filterAnchor, setFilterAnchor] = React.useState<null | HTMLElement>(null)
  const [sortAnchor, setSortAnchor] = React.useState<null | HTMLElement>(null)

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => setFilterAnchor(event.currentTarget)
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => setSortAnchor(event.currentTarget)
  const handleMenuClose = () => {
    setFilterAnchor(null)
    setSortAnchor(null)
  }

  const sortOptions = [
    { label: 'Más recientes', value: 'newest' },
    { label: 'Más antiguos', value: 'oldest' },
    { label: 'Total: Mayor a Menor', value: 'total-desc' },
    { label: 'Total: Menor a Mayor', value: 'total-asc' },
    { label: 'Cliente (A-Z)', value: 'customer-asc' },
    { label: 'Cliente (Z-A)', value: 'customer-desc' },
  ]

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
          <Tab label="Todas las Ventas" />
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
            placeholder="Buscar por cliente o detalles..."
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

        <Button
          variant="text"
          size="small"
          onClick={handleFilterClick}
          startIcon={<FilterIcon sx={{ fontSize: 14 }} />}
          sx={{
            height: 32,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '12px',
            color: filterStatus !== '' ? 'text.primary' : 'text.secondary',
            fontWeight: filterStatus !== '' ? 600 : 400,
            '&:hover': { color: 'text.primary' }
          }}
        >
          Filtros
        </Button>

        <Button
          variant="text"
          size="small"
          onClick={handleSortClick}
          startIcon={<SortIcon sx={{ fontSize: 14 }} />}
          sx={{
            height: 32,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '12px',
            color: salesSort !== 'newest' ? 'text.primary' : 'text.secondary',
            fontWeight: salesSort !== 'newest' ? 600 : 400,
            '&:hover': { color: 'text.primary' }
          }}
        >
          Ordenar
        </Button>

        {/* Menús */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { mt: 1, borderRadius: 1.5, minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
          }}
        >
          {filterOptions.map((opt) => (
            <MenuItem 
              key={opt.value} 
              onClick={() => { setFilterStatus(opt.value); handleMenuClose(); }}
              sx={{ fontSize: '11px', py: 0.8 }}
            >
              <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
              {filterStatus === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={sortAnchor}
          open={Boolean(sortAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { mt: 1, borderRadius: 1.5, minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
          }}
        >
          {sortOptions.map((opt) => (
            <MenuItem 
              key={opt.value} 
              onClick={() => { setSalesSort(opt.value); handleMenuClose(); }}
              sx={{ fontSize: '11px', py: 0.8 }}
            >
              <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
              {salesSort === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* TABLE AREA */}
      <Box sx={{ p: 0 }}>
        <SalesTable
          sales={sales}
          loading={loading}
          onEdit={onEdit}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onViewDetails={onViewDetails}
          selectedIds={selectedSales}
          onSelectionChange={setSelectedSales}
          currentSort={salesSort}
          onSortChange={setSalesSort}
        />
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
          {totalCount} ventas · Página {page} de {Math.ceil(totalCount / 20) || 1}
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

export default SalesTabs
