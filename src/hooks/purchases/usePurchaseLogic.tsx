import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import { supplierService } from '../../services/supplierService'
import { purchaseService } from '../../services/purchaseService'
import { usePurchaseItems } from './usePurchaseItems'
import { usePurchaseForm } from './usePurchaseForm'
import type { 
  PurchaseFilters, 
  VariantOption,
  Purchase
} from '../../types/purchases'
import type { ProductVariant, Product } from '../../types'

export const usePurchaseLogic = () => {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailsPage, setDetailsPage] = useState(1)
  const [filters, setFilters] = useState<PurchaseFilters>({
    supplier: '',
    product: '',
    start_date: '',
    end_date: '',
    search: ''
  })
  const [purchaseSort, setPurchaseSort] = useState<string>('newest')

  // Custom hooks
  const {
    purchaseItems,
    handleClearAll,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleVariantChange,
  } = usePurchaseItems()

  const { handleSubmit, isLoading: formLoading } = usePurchaseForm()

  // Queries
  const { data: purchasesData, isLoading: detailsLoading, refetch: refetchPurchases } = useQuery({
    queryKey: ['purchases', detailsPage, filters],
    queryFn: () => purchaseService.getPurchases(detailsPage, filters),
  })

  // We only need these for the creation dialog and filters
  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getSuppliers(),
  })

  const { data: allProductsData } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => productService.getProducts(),
  })

  const { data: variantsData } = useQuery({
    queryKey: ['variants-details'],
    queryFn: () => productService.getVariants(),
  })

  // Processed data
  const purchases: Purchase[] = purchasesData?.results || []
  const suppliers = suppliersData?.results || []
  const allProducts = allProductsData?.results || []
  const variants = variantsData?.results || []

  // Procesamiento local de ordenamiento
  const processedPurchases = useMemo(() => {
    let result = [...purchases]
 
    // Local Search Hardening
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(p => 
        (p.supplier?.name?.toLowerCase().includes(search)) || 
        (p.variant?.product?.name?.toLowerCase().includes(search)) ||
        (p.variant?.product?.sku?.toLowerCase().includes(search)) ||
        (p.id?.toString().includes(search))
      )
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      switch (purchaseSort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'total-asc':
          return Number(a.total_cost) - Number(b.total_cost)
        case 'total-desc':
          return Number(b.total_cost) - Number(a.total_cost)
        case 'quantity-asc':
          return Number(a.quantity) - Number(b.quantity)
        case 'quantity-desc':
          return Number(b.quantity) - Number(a.quantity)
        case 'product-asc':
          return (a.variant?.product?.name || '').localeCompare(b.variant?.product?.name || '')
        case 'product-desc':
          return (b.variant?.product?.name || '').localeCompare(a.variant?.product?.name || '')
        default:
          return 0
      }
    })

    return result
  }, [purchases, purchaseSort])

  const variantOptions: VariantOption[] = useMemo(() => {
    return variants.map((variant: ProductVariant) => {
      const product = allProducts?.find((p: Product) => p.id === variant.product)
      return {
        id: variant.id,
        size: variant.size,
        color: variant.color,
        gender: variant.gender,
        product: product ? { id: product.id, name: product.name } : undefined,
        label: product ? `${product.name} - ${variant.size} - ${variant.color || 'SC'}` : `Variante ${variant.id}`
      }
    })
  }, [variants, allProducts])

  // Mutation Handler
  const onSubmit = async () => {
    const result = await handleSubmit(purchaseItems)
    if (result.success) {
      setSuccess('Compra registrada exitosamente')
      setCreateModalOpen(false)
      handleClearAll()
      refetchPurchases()
    } else {
      setError(result.error || 'Error al registrar la compra')
    }
  }

  const handleDetailsPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setDetailsPage(value)
  }

  const handleFilterChange = (key: keyof PurchaseFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setDetailsPage(1)
  }

  return {
    // States
    error,
    success,
    createModalOpen,
    detailsPage,
    filters,
    
    // Data
    purchases,
    processedPurchases,
    purchaseSort,
    setPurchaseSort,
    variants,
    allProducts,
    variantOptions,
    purchaseItems,
    suppliers, // For the filters/create
    products: allProducts, // For the filters
    
    // Loading states
    detailsLoading,
    formLoading,
    
    // Event handlers
    setCreateModalOpen,
    setError,
    setSuccess,
    handleDetailsPageChange,
    handleFilterChange,
    onSubmit,

    // Purchase items handlers
    handleClearAll,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleVariantChange,
    
    // Data counts
    purchasesCount: purchasesData?.count || 0,
    
    // compatibility
    suppliersDetails: suppliers,
    productsDetails: allProducts,
  }
}
