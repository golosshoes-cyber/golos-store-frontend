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
        startIcon={<FilterIcon />}
        onClick={onMenuOpen}
        sx={{
          borderColor: 'rgba(255,255,255,0.3)',
          color: 'white',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.5)',
            backgroundColor: 'rgba(255,255,255,0.1)',
          }
        }}
      >
        Filtrar: {currentFilterLabel}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={onMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        {filterOptions.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => onFilterChange(option.value)}
            selected={currentFilter === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SalesFilters
