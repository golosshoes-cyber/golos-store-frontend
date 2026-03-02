import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/dashboardService'

export const useSalesData = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  // Manejar cambio de página con scroll hacia arriba solo si cambia de página
  const handlePageChange = (newPage: number) => {
    const currentPage = page
    setPage(newPage)
    
    // Solo hacer scroll si realmente cambia de página
    if (currentPage !== newPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // Query principal de ventas
  const {
    data: salesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sales', page, searchTerm, filterStatus],
    queryFn: () => dashboardService.getSales({
      page,
      limit: 20,
      search: searchTerm,
      status: filterStatus,
    }),
  })

  return {
    // Estado
    page,
    searchTerm,
    filterStatus,
    setPage,
    setSearchTerm,
    setFilterStatus,
    handlePageChange,
    
    // Datos del query
    salesData,
    isLoading,
    error,
    
    // Datos procesados
    sales: salesData?.results || [],
    totalCount: salesData?.count || 0,
  }
}
