import React from 'react'
import {
  Button,
  Menu,
  MenuItem,
  Box,
} from '@mui/material'
import {
  FilterList as FilterIcon,
} from '@mui/icons-material'

interface SalesFiltersProps {
  currentFilter: string
  currentFilterLabel: string
  isMenuOpen: boolean
  anchorEl: null | HTMLElement
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void
  onMenuClose: () => void
  onFilterChange: (status: string) => void
  filterOptions: Array<{ value: string; label: string }>
}

const SalesFilters: React.FC<SalesFiltersProps> = ({
  currentFilter,
  currentFilterLabel,
  isMenuOpen,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onFilterChange,
  filterOptions,
}) => {
  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<FilterIcon sx={{ fontSize: 18 }} />}
        onClick={onMenuOpen}
        size="small"
        sx={{
          color: 'text.secondary',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'text.secondary',
            bgcolor: 'action.hover',
          }
        }}
      >
        Filtrar: {currentFilterLabel}
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
            onClick={() => onFilterChange(option.value)}
            selected={currentFilter === option.value}
            sx={{ fontSize: '13px' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SalesFilters
