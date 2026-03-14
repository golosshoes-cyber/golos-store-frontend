import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import { extractApiErrorMessage } from '../../utils/apiError'

interface UseInventoryDataProps {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

export const useInventoryData = ({ showSuccess, showError }: UseInventoryDataProps) => {
  const [page, setPage] = useState(1)
  const [searchTermInput, setSearchTermInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)

  const queryClient = useQueryClient()

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => setSearchTerm(searchTermInput), 300)
    return () => clearTimeout(timeout)
  }, [searchTermInput])

  // Fetch variants
  const {
    data: variantsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['variants', page, searchTerm, lowStockOnly],
    queryFn: () => productService.getVariants({ page, search: searchTerm, limit: 20 }),
  })

  // Fetch products to get product names
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
  })

  const products = productsData?.results || []

  // Mutación para ajustar stock
  const adjustStockMutation = useMutation({
    mutationFn: ({ variantId, currentStock, newStock, reason }: { variantId: number; currentStock: number; newStock: number; reason: string }) =>
      productService.adjustStock(variantId, currentStock, newStock, reason),
    onSuccess: () => {
      showSuccess('Stock ajustado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['variants'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: any) => {
      const errorMessage = extractApiErrorMessage(error, 'Error al ajustar el stock')
      showError(errorMessage)
    },
  })

  // Filter variants locally
  const filteredVariants = useMemo(() => {
    if (!variantsData?.results) return []

    let variants = variantsData.results

    // Apply search filter
    if (searchTerm) {
      variants = variants.filter(variant => {
        const product = products.find(p => p.id === variant.product)
        const productName = product ? product.name : `Producto #${variant.product}`
        const search = searchTerm.toLowerCase()
        
        return (productName?.toLowerCase().includes(search)) ||
               (variant.sku?.toLowerCase().includes(search)) ||
               (variant.size?.toLowerCase().includes(search)) ||
               (variant.color?.toLowerCase().includes(search))
      })
    }

    // Apply low stock filter
    if (lowStockOnly) {
      variants = variants.filter(variant => variant.stock < 10)
    }

    return variants
  }, [variantsData?.results, products, searchTerm, lowStockOnly])

  const getProductInfo = (productId: number | string) => {
    const product = products.find(p => p.id === productId)
    return product ? { name: product.name, brand: product.brand } : { name: `Producto #${productId}`, brand: 'Sin marca' }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sin Stock', color: 'error' as const }
    if (stock < 10) return { label: 'Stock Bajo', color: 'warning' as const }
    if (stock < 50) return { label: 'Stock Medio', color: 'info' as const }
    return { label: 'Stock Alto', color: 'success' as const }
  }

  const handleSearchChange = (value: string) => {
    setSearchTermInput(value)
    setPage(1) // Reset to first page when searching
  }

  const toggleLowStockOnly = (checked?: boolean) => {
    setLowStockOnly(prev => checked !== undefined ? checked : !prev)
    setPage(1) // Reset to first page when toggling filter
  }

  return {
    // State
    page,
    searchTerm: searchTermInput,
    lowStockOnly,

    // Data
    filteredVariants,
    totalCount: variantsData?.count || 0,
    isLoading,
    error,

    // Functions
    setPage,
    getProductInfo,
    getStockStatus,
    handleSearchChange,
    toggleLowStockOnly,

    // Mutations
    adjustStockMutation,

    // Loading states
    isAdjustingStock: adjustStockMutation.isPending,
  }
}
