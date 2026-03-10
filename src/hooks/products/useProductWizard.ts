import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import type { Product, ProductVariant } from '../../types'
import { extractApiErrorMessage } from '../../utils/apiError'

export const useProductWizard = (onComplete: () => void) => {
  const queryClient = useQueryClient()
  
  // State
  const [step, setStep] = useState(0)
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string>('')
  const [addedVariants, setAddedVariants] = useState<ProductVariant[]>([])
  const [imageUploadLoading, setImageUploadLoading] = useState(false)

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: (data) => {
      setCreatedProduct(data)
      setStep(1) // Pasar al siguiente paso
      setError('')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['all-products'] })
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al crear producto base'))
    },
  })

  const createVariantMutation = useMutation({
    mutationFn: productService.createVariant,
    onSuccess: (data) => {
      setAddedVariants(prev => [...prev, data])
      setError('')
      queryClient.invalidateQueries({ queryKey: ['variants'] })
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al crear variante'))
    },
  })

  // Handlers
  const handleProductSubmit = (productData: Partial<Product>) => {
    createProductMutation.mutate(productData)
  }

  const handleVariantSubmit = (variantData: Partial<ProductVariant>) => {
    if (!createdProduct) return
    createVariantMutation.mutate({ ...variantData, product: createdProduct.id })
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files || !createdProduct) return

    setImageUploadLoading(true)
    let uploadCount = 0
    const totalFiles = files.length

    Array.from(files).forEach(file => {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('product', createdProduct.id.toString())

      productService.uploadImage(createdProduct.id, formData).then(() => {
        uploadCount++
        if (uploadCount === totalFiles) {
          setImageUploadLoading(false)
          queryClient.invalidateQueries({ queryKey: ['all-images'] })
        }
      }).catch(err => {
        uploadCount++
        setError(extractApiErrorMessage(err, 'Error al subir una imagen'))
        if (uploadCount === totalFiles) {
          setImageUploadLoading(false)
        }
      })
    })
  }
  
  const handleNextStep = () => {
    setStep(prev => prev + 1)
  }

  const handleFinish = () => {
    setStep(0)
    setCreatedProduct(null)
    setAddedVariants([])
    setError('')
    onComplete()
  }

  const resetWizardState = () => {
    setStep(0)
    setCreatedProduct(null)
    setAddedVariants([])
    setError('')
  }

  return {
    step,
    createdProduct,
    addedVariants,
    error,
    setError,
    imageUploadLoading,
    handleProductSubmit,
    handleVariantSubmit,
    handleImageUpload,
    handleNextStep,
    handleFinish,
    resetWizardState,
    isCreatingProduct: createProductMutation.isPending,
    isCreatingVariant: createVariantMutation.isPending
  }
}
