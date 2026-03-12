import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { productService } from '../../services/productService'
import type { Product, ProductVariant } from '../../types'
import type { ImageUploadData } from '../../types/products'
import { showAcrylicConfirm } from '../../utils/showAcrylicConfirm'
import { extractApiErrorMessage } from '../../utils/apiError'

export const useProductsLogic = () => {
  const location = useLocation()
  const queryClient = useQueryClient()
  const theme = useTheme()
  
  // States
  const [wizardOpen, setWizardOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [viewVariantDialogOpen, setViewVariantDialogOpen] = useState(false)
  const [viewingVariant, setViewingVariant] = useState<ProductVariant | null>(null)
  const [viewingVariantProduct, setViewingVariantProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState<number>(0)
  const [variantPage, setVariantPage] = useState(1)
  const [variantDialogOpen, setVariantDialogOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [variantError, setVariantError] = useState<string>('')
  const [selectedProductForImages, setSelectedProductForImages] = useState<number | null>(null)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [variantSearch, setVariantSearch] = useState('')
  const [productInputValue, setProductInputValue] = useState('')
  const [variantInputValue, setVariantInputValue] = useState('')

  const blurActiveElement = () => {
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) {
      activeElement.blur()
    }
  }

  // Page change handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleVariantPageChange = (newPage: number) => {
    setVariantPage(newPage)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Tab change handler
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newValue.toString())
    window.history.replaceState({}, '', url.toString())
  }

  // Read active tab from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && !isNaN(Number(tabParam))) {
      const tabIndex = parseInt(tabParam, 10)
      if (tabIndex >= 0 && tabIndex <= 2) {
        setActiveTab(tabIndex)
      }
    }
  }, [])

  // Check for navigation state to open create modal
  useEffect(() => {
    if (location.state?.openCreateModal) {
      blurActiveElement()
      setWizardOpen(true)
      // Remove state to prevent reopening on reload
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => setProductSearch(productInputValue), 300)
    return () => clearTimeout(timeout)
  }, [productInputValue])

  useEffect(() => {
    const timeout = setTimeout(() => setVariantSearch(variantInputValue), 300)
    return () => clearTimeout(timeout)
  }, [variantInputValue])

  // Queries
  const {
    data: productsData,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['products', page, productSearch],
    queryFn: () => productService.getProducts({ page, limit: 20, search: productSearch }),
  })

  const {
    data: allProducts,
  } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
  })

  const {
    data: productImages,
    isLoading: imagesLoading,
  } = useQuery({
    queryKey: ['product-images', selectedProductForImages],
    queryFn: async () => {
      const allImages = await productService.getImages();
      return selectedProductForImages ? allImages.filter(img => img.product === selectedProductForImages) : [];
    },
    enabled: !!selectedProductForImages,
  })

  const {
    data: allImages,
  } = useQuery({
    queryKey: ['all-images'],
    queryFn: () => productService.getImages(),
    enabled: activeTab === 1,
  })

  const {
    data: variantsData,
    isLoading: variantsLoading,
  } = useQuery({
    queryKey: ['variants', variantPage, variantSearch],
    queryFn: () => productService.getVariants({ page: variantPage, limit: 20, search: variantSearch }),
  })

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['all-products'] })
      setDialogOpen(false)
      setError('')
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al crear producto'))
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<Product> }) =>
      productService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['all-products'] })
      setDialogOpen(false)
      setEditingProduct(null)
      setError('')
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al actualizar producto'))
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['all-products'] })
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al eliminar producto'))
    },
  })

  const createVariantMutation = useMutation({
    mutationFn: productService.createVariant,
    onSuccess: () => {
      blurActiveElement()
      queryClient.invalidateQueries({ queryKey: ['variants'] })
      setVariantDialogOpen(false)
      setEditingVariant(null)
      setVariantError('')
    },
    onError: (err: any) => {
      setVariantError(extractApiErrorMessage(err, 'Error al crear variante'))
    },
  })

  const updateVariantMutation = useMutation({
    mutationFn: ({ id, variant }: { id: number; variant: Partial<ProductVariant> }) =>
      productService.updateVariant(id, variant),
    onSuccess: () => {
      blurActiveElement()
      queryClient.invalidateQueries({ queryKey: ['variants'] })
      setVariantDialogOpen(false)
      setEditingVariant(null)
      setVariantError('')
    },
    onError: (err: any) => {
      setVariantError(extractApiErrorMessage(err, 'Error al actualizar variante'))
    },
  })

  const deleteVariantMutation = useMutation({
    mutationFn: productService.deleteVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['all-products'] })
    },
    onError: (err: any) => {
      setVariantError(extractApiErrorMessage(err, 'Error al eliminar variante'))
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: ({ productId, formData }: ImageUploadData) =>
      productService.uploadImage(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', selectedProductForImages] })
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al subir imagen'))
      setImageUploadLoading(false)
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: productService.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', selectedProductForImages] })
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al eliminar imagen'))
    },
  })

  // Event handlers
  const handleCreateProduct = () => {
    blurActiveElement()
    setWizardOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product)
    setViewDialogOpen(true)
  }

  const handleViewVariant = (variant: ProductVariant) => {
    const product = allProducts?.results?.find(p => p.id === variant.product)
    setViewingVariant(variant)
    setViewingVariantProduct(product || null)
    setViewVariantDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    blurActiveElement()
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleUpdateProduct = (product: Product) => {
    updateProductMutation.mutate({ id: product.id, product })
  }

  const handleDeleteProduct = async (productId: number) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Eliminar Producto',
      text: '¿Estás seguro de que quieres eliminar este producto?',
      icon: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (confirmed) {
      deleteProductMutation.mutate(productId)
    }
  }

  const handleCreateVariant = () => {
    blurActiveElement()
    setVariantDialogOpen(true)
  }

  const handleEditVariant = (variant: ProductVariant) => {
    blurActiveElement()
    setEditingVariant(variant)
    setVariantDialogOpen(true)
  }

  const handleDeleteVariant = async (variantId: number) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Eliminar Variante',
      text: '¿Estás seguro de que quieres eliminar esta variante?',
      icon: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (confirmed) {
      deleteVariantMutation.mutate(variantId)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !selectedProductForImages) return

    setImageUploadLoading(true)
    let uploadCount = 0
    const totalFiles = files.length

    Array.from(files).forEach(file => {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('product', selectedProductForImages.toString())

      uploadImageMutation.mutate({ productId: selectedProductForImages, formData }, {
        onSuccess: () => {
          uploadCount++
          if (uploadCount === totalFiles) {
            setImageUploadLoading(false)
          }
        },
        onError: () => {
          uploadCount++
          if (uploadCount === totalFiles) {
            setImageUploadLoading(false)
          }
        }
      })
    })

    e.target.value = ''
  }

  const handleDeleteImage = async (imageId: number) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Eliminar Imagen',
      text: '¿Eliminar esta imagen?',
      icon: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (confirmed) {
      deleteImageMutation.mutate(imageId)
    }
  }

  return {
    // States
    wizardOpen,
    page,
    dialogOpen,
    editingProduct,
    viewDialogOpen,
    viewingProduct,
    viewVariantDialogOpen,
    viewingVariant,
    viewingVariantProduct,
    error,
    activeTab,
    variantPage,
    variantDialogOpen,
    editingVariant,
    variantError,
    selectedProductForImages,
    imageUploadLoading,
    productSearch,
    variantSearch,
    productInputValue,
    variantInputValue,
    
    // Data
    productsData,
    allProducts,
    variantsData,
    productImages,
    allImages,
    
    // Loading states
    isLoading,
    variantsLoading,
    imagesLoading,
    
    // Mutation states
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    createVariantMutation,
    updateVariantMutation,
    deleteVariantMutation,
    uploadImageMutation,
    deleteImageMutation,
    
    // Error states
    fetchError,
    
    // Setters
    setWizardOpen,
    setPage,
    setDialogOpen,
    setEditingProduct,
    setViewDialogOpen,
    setViewingProduct,
    setViewVariantDialogOpen,
    setViewingVariant,
    setViewingVariantProduct,
    setError,
    setActiveTab,
    setVariantPage,
    setVariantDialogOpen,
    setEditingVariant,
    setVariantError,
    setSelectedProductForImages,
    setImageUploadLoading,
    setProductSearch,
    setVariantSearch,
    setProductInputValue,
    setVariantInputValue,
    
    // Event handlers
    handlePageChange,
    handleVariantPageChange,
    handleTabChange,
    handleCreateProduct,
    handleViewProduct,
    handleViewVariant,
    handleEditProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleCreateVariant,
    handleEditVariant,
    handleDeleteVariant,
    handleImageUpload,
    handleDeleteImage,
  }
}
