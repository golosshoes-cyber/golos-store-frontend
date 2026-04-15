import React from 'react'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  Button,
  Pagination,
} from '@mui/material'
import { useTheme, alpha, useMediaQuery } from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Check as CheckIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import PurchasesTable from './PurchasesTable'
import PurchasesCards from './PurchasesCards'
import type { Purchase } from '../../types/purchases'

interface PurchasesTabsProps {
  purchases: Purchase[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void
  
  // Search & Filter
  filters: any
  onFilterChange: (key: any, val: any) => void
  suppliers: any[]
  products: any[]
  
  // Sorting
  purchaseSort: string
  onSortChange: (sort: string) => void
}

const PurchasesTabs: React.FC<PurchasesTabsProps> = ({
  purchases,
  loading,
  page,
  totalCount,
  onPageChange,
  filters,
  onFilterChange,
  suppliers,
  products,
  purchaseSort,
  onSortChange,
}) => {
  const theme = useTheme()
  const { mode } = useThemeMode()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
    { label: 'Cantidad: Mayor a Menor', value: 'quantity-desc' },
    { label: 'Cantidad: Menor a Mayor', value: 'quantity-asc' },
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
          <Tab label="Todas las Compras" />
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
            placeholder="Buscar por producto, proveedor..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
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
            color: (filters.supplier || filters.product || filters.start_date || filters.end_date) ? 'text.primary' : 'text.secondary',
            fontWeight: (filters.supplier || filters.product || filters.start_date || filters.end_date) ? 600 : 400,
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
            color: purchaseSort !== 'newest' ? 'text.primary' : 'text.secondary',
            fontWeight: purchaseSort !== 'newest' ? 600 : 400,
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
            sx: { 
              mt: 1, 
              borderRadius: 1.5, 
              minWidth: 240, 
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 700, mb: 0.5, color: 'text.disabled', textTransform: 'uppercase' }}>
                Proveedor
              </Typography>
              <select
                value={filters.supplier}
                onChange={(e) => onFilterChange('supplier', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.palette.divider}`,
                  fontSize: '11px',
                  background: 'transparent',
                  color: theme.palette.text.primary
                }}
              >
                <option value="">Todos</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 700, mb: 0.5, color: 'text.disabled', textTransform: 'uppercase' }}>
                Producto
              </Typography>
              <select
                value={filters.product}
                onChange={(e) => onFilterChange('product', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.palette.divider}`,
                  fontSize: '11px',
                  background: 'transparent',
                  color: theme.palette.text.primary
                }}
              >
                <option value="">Todos</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, mb: 0.5, color: 'text.disabled', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 12 }} /> Desde
                </Typography>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => onFilterChange('start_date', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: '11px',
                    background: 'transparent',
                    color: theme.palette.text.primary
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, mb: 0.5, color: 'text.disabled', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 12 }} /> Hasta
                </Typography>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => onFilterChange('end_date', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: '11px',
                    background: 'transparent',
                    color: theme.palette.text.primary
                  }}
                />
              </Box>
            </Box>
            
            <Button 
              size="small" 
              fullWidth 
              variant="contained" 
              onClick={handleMenuClose}
              sx={{ mt: 1, textTransform: 'none', fontSize: '11px', borderRadius: 1.5 }}
            >
              Aplicar
            </Button>
          </Box>
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
              onClick={() => { onSortChange(opt.value); handleMenuClose(); }}
              sx={{ fontSize: '11px', py: 0.8 }}
            >
              <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
              {purchaseSort === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box sx={{ p: isMobile ? 1.5 : 0 }}>
        {isMobile ? (
          <PurchasesCards
            purchases={purchases}
            isLoading={loading}
          />
        ) : (
          <PurchasesTable
            purchases={purchases}
            isLoading={loading}
            currentSort={purchaseSort}
            onSortChange={onSortChange}
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
          {totalCount} compras · Página {page} de {Math.ceil(totalCount / 20) || 1}
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

export default PurchasesTabs
