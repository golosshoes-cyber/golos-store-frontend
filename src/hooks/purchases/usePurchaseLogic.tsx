import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import { supplierService } from '../../services/supplierService'
import { purchaseService } from '../../services/purchaseService'
import { usePurchaseItems } from './usePurchaseItems'
import { usePurchaseForm } from './usePurchaseForm'
import type { PurchaseFilters, PurchaseFormData, VariantOption } from '../../types/purchases'
import type { ProductVariant, Product } from '../../types'

export const usePurchaseLogic = () => {
  // States
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailsPage, setDetailsPage] = useState(1)
  const [filters, setFilters] = useState<PurchaseFilters>({
    supplier: '',
    product: '',
    start_date: '',
    end_date: '',
    search: ''
  })

  // Custom hooks
  const {
    purchaseItems,
    handleClearAll,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleVariantChange,
    validateItems,
  } = usePurchaseItems()

  const { handleSubmit, isLoading } = usePurchaseForm()

  // Fetch data for details tab
  const { data: purchasesData, isLoading: detailsLoading } = useQuery({
    queryKey: ['purchases-details', detailsPage, filters],
    queryFn: () => purchaseService.getPurchases({
      page: detailsPage,
      supplier: filters.supplier,
      product: filters.product,
      start_date: filters.start_date,
      end_date: filters.end_date,
      search: filters.search,
    } as PurchaseFormData),
  })

  const { data: suppliersDetailsData } = useQuery({
    queryKey: ['suppliers-simple'],
    queryFn: () => supplierService.getSuppliers({ limit: 1000 }),
  })

  const { data: productsDetailsData } = useQuery({
    queryKey: ['products-simple'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
  })

  const { data: variantsData } = useQuery({
    queryKey: ['variants'],
    queryFn: () => productService.getVariants({ limit: 1000 }),
  })

  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getSuppliers({ limit: 1000 }),
  })

  const { data: allProductsData } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => productService.getProducts({}),
  })

  // Processed data
  const purchases = purchasesData?.results || []
  const suppliersDetails = suppliersDetailsData?.results || []
  const productsDetails = productsDetailsData?.results || []
  const variants = variantsData?.results || []
  const allProducts = allProductsData?.results || []
  const suppliers = suppliersData?.results || []

  const variantOptions: VariantOption[] = variants.map((variant: ProductVariant) => {
    const product = allProducts?.find((p: Product) => p.id === variant.product)
    return {
      id: variant.id,
      size: variant.size,
      color: variant.color,
      gender: variant.gender,
      product: product ? { id: product.id, name: product.name } : undefined,
      label: `${product?.name || 'N/A'} - ${variant.size} - ${variant.color || 'Sin color'} - ${variant.gender === 'male' ? 'Masculino' : variant.gender === 'female' ? 'Femenino' : 'Unisex'}`
    }
  })

  // Event handlers
  const handleDetailsPageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setDetailsPage(newPage)
  }

  const handleFilterChange = (key: keyof PurchaseFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const onSubmit = async () => {
    
    const validationError = validateItems(purchaseItems)
    if (validationError) {
      setError(validationError)
      return
    }
    
    const result = await handleSubmit(purchaseItems)
    
    if (result.success) {
      setSuccess('Compra creada exitosamente')
      setError('')
      handleClearAll()
      localStorage.removeItem('purchaseItems')
      setCreateModalOpen(false)
    } else {
      setError(result.error || 'Error al crear la compra')
      setSuccess('')
    }
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
    suppliersDetails,
    productsDetails,
    variants,
    allProducts,
    suppliers,
    variantOptions,
    purchaseItems,
    
    // Loading states
    detailsLoading,
    isLoading,
    
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
  }
}
