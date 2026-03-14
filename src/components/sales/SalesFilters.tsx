import React from 'react'
import {
  Button,
  Menu,
  MenuItem,
  Box,
} from '@mui/material'
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  Check as CheckIcon,
} from '@mui/icons-material'
import { ListItemText } from '@mui/material'

interface SalesFiltersProps {
  currentFilter: string
  currentSort: string
  onSortChange: (sort: string) => void
  isMenuOpen: boolean
  anchorEl: null | HTMLElement
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  onMenuClose: () => void
  onFilterChange: (status: string) => void
  filterOptions: Array<{ value: string; label: string }>
}

const SalesFilters: React.FC<SalesFiltersProps> = ({
  currentFilter,
  currentSort,
  onSortChange,
  isMenuOpen,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onFilterChange,
  filterOptions,
}) => {
  const [sortAnchor, setSortAnchor] = React.useState<null | HTMLElement>(null)
  const isSortMenuOpen = Boolean(sortAnchor)

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchor(event.currentTarget)
  }

  const handleSortClose = () => {
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
    <Box>
      <Button
        variant="text"
        startIcon={<FilterIcon sx={{ fontSize: 16 }} />}
        onClick={onMenuOpen}
        size="small"
        sx={{
          height: 32,
          borderRadius: 1.5,
          textTransform: 'none',
          fontSize: '12px',
          color: currentFilter !== '' ? 'text.primary' : 'text.secondary',
          fontWeight: currentFilter !== '' ? 600 : 400,
          '&:hover': { color: 'text.primary' }
        }}
      >
        Filtros
      </Button>

      <Button
        variant="text"
        startIcon={<SortIcon sx={{ fontSize: 16 }} />}
        onClick={handleSortClick}
        size="small"
        sx={{
          height: 32,
          borderRadius: 1.5,
          textTransform: 'none',
          fontSize: '12px',
          color: currentSort !== 'newest' ? 'text.primary' : 'text.secondary',
          fontWeight: currentSort !== 'newest' ? 600 : 400,
          '&:hover': { color: 'text.primary' }
        }}
      >
        Ordenar
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={onMenuClose}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
          }
        }}
      >
        {filterOptions.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => { onFilterChange(option.value); onMenuClose(); }}
            sx={{ fontSize: '11px', py: 0.8 }}
          >
            <ListItemText primary={option.label} primaryTypographyProps={{ fontSize: '11px' }} />
            {currentFilter === option.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={sortAnchor}
        open={isSortMenuOpen}
        onClose={handleSortClose}
        PaperProps={{
          sx: { mt: 1, borderRadius: 1.5, minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}
      >
        {sortOptions.map((opt) => (
          <MenuItem 
            key={opt.value} 
            onClick={() => { onSortChange(opt.value); handleSortClose(); }}
            sx={{ fontSize: '11px', py: 0.8 }}
          >
            <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: '11px' }} />
            {currentSort === opt.value && <CheckIcon sx={{ fontSize: 14, ml: 1 }} />}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SalesFilters
