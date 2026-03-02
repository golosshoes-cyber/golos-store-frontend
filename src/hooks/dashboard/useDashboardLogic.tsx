import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/dashboardService'
import { productService } from '../../services/productService'

export const useDashboardLogic = () => {
  const [searchValue, setSearchValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  // Queries principales del dashboard
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  })

  const {
    data: recentMovements,
    isLoading: movementsLoading,
  } = useQuery({
    queryKey: ['recent-movements'],
    queryFn: () => dashboardService.getRecentMovements(10),
  })

  const {
    data: topProducts,
    isLoading: topProductsLoading,
  } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => dashboardService.getTopProducts('month'),
  })

  const {
    data: supplierPerformance,
    isLoading: suppliersLoading,
  } = useQuery({
    queryKey: ['supplier-performance'],
    queryFn: () => dashboardService.getSupplierPerformance(90),
  })

  const {
    data: salesChart,
    isLoading: chartLoading,
  } = useQuery({
    queryKey: ['sales-chart'],
    queryFn: () => dashboardService.getSalesChart(30),
  })

  // Query para obtener productos para nombres
  const { data: productsData } = useQuery({
    queryKey: ['products-for-search'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
  })

  // Query para búsqueda de variantes
  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ['variant-search', searchValue],
    queryFn: () => productService.getVariants({ search: searchValue, limit: 10 }),
    enabled: searchValue.length >= 2,
  })

  const products = productsData?.results || []

  const getProductName = (productId: number | string) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : `Producto #${productId}`
  }

  const lowStock = stats?.products?.low_stock ?? 0

  // Event handlers
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value)
  }

  const handleSearchOpenChange = (open: boolean) => {
    setSearchOpen(open)
  }

  const handleNavigateToVariant = () => {
    // Esta función será implementada en el componente principal
    // ya que necesita acceso a navigate
  }

  const handleNavigateToCreateProduct = () => {
    // Esta función será implementada en el componente principal
  }

  const handleNavigateToCreateSale = () => {
    // Esta función será implementada en el componente principal
  }

  return {
    // States
    searchValue,
    searchOpen,
    
    // Data
    stats,
    recentMovements,
    topProducts,
    supplierPerformance,
    salesChart,
    searchResults,
    products,
    lowStock,
    
    // Loading states
    isLoading,
    movementsLoading,
    topProductsLoading,
    suppliersLoading,
    chartLoading,
    searchLoading,
    
    // Error state
    error,
    
    // Setters
    setSearchValue: handleSearchValueChange,
    setSearchOpen: handleSearchOpenChange,
    
    // Utility functions
    getProductName,
    
    // Navigation handlers (para ser implementados en el componente)
    onNavigateToVariant: handleNavigateToVariant,
    onNavigateToCreateProduct: handleNavigateToCreateProduct,
    onNavigateToCreateSale: handleNavigateToCreateSale,
  }
}
