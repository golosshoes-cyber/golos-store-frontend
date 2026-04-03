import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import { extractApiErrorMessage } from '../../utils/apiError'

interface PurchaseItemData {
  variantId: number
  quantity: number
  unitCost: number
  supplierId?: number
}

interface PurchaseItem {
  variantId: string
  quantity: string
  unitCost: string
  supplierId: string
  isNew: boolean
  newProductId: string
  newSize: string
  newColor: string
  newGender: string
}

export const usePurchaseForm = () => {
  const queryClient = useQueryClient()

  const createPurchaseMutation = useMutation({
    mutationFn: ({ items, paymentMethod }: { items: PurchaseItemData[], paymentMethod: string }) => 
      productService.createPurchase(items, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['low-stock-products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['variants'] })
      queryClient.invalidateQueries({ queryKey: ['current-cash-session'] })
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] })
    },
  })

  const handleSubmit = async (items: PurchaseItem[], paymentMethod: string = 'none'): Promise<{ success: boolean; error?: string }> => {
    try {
      const purchaseItemsData: PurchaseItemData[] = []
      
      for (const item of items) {
        let variantId = item.variantId
        
        // Create new variant if needed
        if (item.isNew) {
          const newVariant = await productService.createVariant({
            product: parseInt(item.newProductId),
            size: item.newSize,
            color: item.newColor,
            gender: item.newGender,
            stock: 0,
            price: parseFloat(item.unitCost),
            cost: parseFloat(item.unitCost),
            active: true,
          })
          variantId = newVariant.id.toString()
        }
        
        purchaseItemsData.push({
          variantId: parseInt(variantId),
          quantity: parseInt(item.quantity),
          unitCost: parseFloat(item.unitCost),
          supplierId: item.supplierId ? parseInt(item.supplierId) : undefined
        })
      }
      
      await createPurchaseMutation.mutateAsync({ items: purchaseItemsData, paymentMethod })
      
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: extractApiErrorMessage(error, 'Error al crear la compra')
      }
    }
  }

  return {
    createPurchaseMutation,
    handleSubmit,
    isLoading: createPurchaseMutation.isPending,
  }
}
