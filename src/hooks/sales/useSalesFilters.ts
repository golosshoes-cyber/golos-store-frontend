import { useState } from 'react'

export const useSalesFilters = (initialFilter: string = '') => {
  const [filterStatus, setFilterStatus] = useState<string>(initialFilter)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterMenuClose = () => {
    setAnchorEl(null)
  }

  const handleFilterChange = (status: string, onFilterChange?: (status: string) => void) => {
    setFilterStatus(status)
    handleFilterMenuClose()
    
    // Si se proporciona callback externo (como setFilterStatus del hook principal)
    if (onFilterChange) {
      onFilterChange(status)
    }
  }

  const filterOptions = [
    { value: '', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'completed', label: 'Completadas' },
    { value: 'canceled', label: 'Canceladas' },
  ]

  const currentFilterLabel = filterOptions.find(option => option.value === filterStatus)?.label || 'Todas'

  return {
    // Estado
    filterStatus,
    anchorEl,
    
    // Setters
    setFilterStatus,
    setAnchorEl,
    
    // Handlers
    handleFilterMenuOpen,
    handleFilterMenuClose,
    handleFilterChange,
    
    // Datos útiles
    filterOptions,
    currentFilterLabel,
    isMenuOpen: Boolean(anchorEl),
  }
}
