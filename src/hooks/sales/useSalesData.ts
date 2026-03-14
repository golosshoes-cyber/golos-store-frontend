import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/dashboardService'

export const useSalesData = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [salesSort, setSalesSort] = useState<string>('newest')
  const [selectedSales, setSelectedSales] = useState<number[]>([])

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

  // Procesamiento local de ordenamiento
  const processedSales = useMemo(() => {
    let result = [...(salesData?.results || [])]
 
    // Local Search Hardening
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(s => 
        (s.customer?.toLowerCase().includes(search)) || 
        (s.id?.toString().includes(search)) ||
        (s.payment_method?.toLowerCase().includes(search))
      )
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      switch (salesSort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'total-asc':
          return Number(a.total) - Number(b.total)
        case 'total-desc':
          return Number(b.total) - Number(a.total)
        case 'customer-asc':
          return a.customer.localeCompare(b.customer)
        case 'customer-desc':
          return b.customer.localeCompare(a.customer)
        default:
          return 0
      }
    })

    return result
  }, [salesData?.results, salesSort])

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
    sales: processedSales,
    totalCount: salesData?.count || 0,

    // Sorting & Selection
    salesSort,
    setSalesSort,
    selectedSales,
    setSelectedSales,
  }
}
