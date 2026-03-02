import { useState, useEffect, useCallback } from 'react'

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

interface Variant {
  id: number
  cost?: number
}

export const usePurchaseItems = () => {
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(() => {

    // Carga desde localStorage al renderizar por primera vez
    const saved = localStorage.getItem('purchaseItems')
    return saved ? JSON.parse(saved) : []
  })

  // Guarda en localStorage cada vez que cambian los items
  useEffect(() => {
    localStorage.setItem('purchaseItems', JSON.stringify(purchaseItems))
  }, [purchaseItems])

  // Obtiene la variante y el costo predefinidos desde la URL
  const prefilledVariant = new URLSearchParams(window.location.search).get('variant')
  const prefilledCost = new URLSearchParams(window.location.search).get('cost')

  useEffect(() => {
    if (prefilledVariant) {
      // Limpia localStorage para asegurar datos prefabricados frescos
      localStorage.removeItem('purchaseItems')
      
      const newItem: PurchaseItem = { 
        variantId: prefilledVariant, 
        quantity: '1', 
        unitCost: prefilledCost || '', 
        supplierId: '',
        isNew: false,
        newProductId: '',
        newSize: '',
        newColor: '',
        newGender: 'unisex'
      }
      setPurchaseItems([newItem])
    }
  }, [prefilledVariant, prefilledCost])

  const handleClearAll = useCallback(() => {
    setPurchaseItems([])
    localStorage.removeItem('purchaseItems')
  }, [])

  const handleAddItem = useCallback(() => {
    const newItem: PurchaseItem = { 
      variantId: '', 
      quantity: '1', 
      unitCost: '', 
      supplierId: '',
      isNew: false,
      newProductId: '',
      newSize: '',
      newColor: '',
      newGender: 'unisex'
    }
    setPurchaseItems(prev => [...prev, newItem])
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    setPurchaseItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleItemChange = useCallback((index: number, field: string, value: string | boolean) => {
    setPurchaseItems(prev => {
      const newItems = [...prev]
      newItems[index] = { ...newItems[index], [field]: value }
      return newItems
    })
  }, [])

  const handleVariantChange = useCallback((index: number, variantId: string, variants: Variant[]) => {
    setPurchaseItems(prev => {
      const newItems = [...prev]
      newItems[index] = { ...newItems[index], variantId }
      
      // Llena el costo unitario cuando se selecciona una variante
      const variant = variants.find(v => v.id === parseInt(variantId))
      if (variant) {
        newItems[index].unitCost = variant.cost?.toString() || ''
      }
      
      return newItems
    })
  }, [])

  const validateItems = useCallback((items: PurchaseItem[]): string | null => {
    if (items.length === 0) {
      return 'Agrega al menos un item a la compra'
    }
    
    for (const item of items) {
      if (item.isNew) {
        if (!item.newProductId || !item.newSize || !item.newGender || !item.quantity || !item.unitCost) {
          return 'Todos los campos son requeridos para cada item'
        }
      } else {
        if (!item.variantId || !item.quantity || !item.unitCost) {
          return 'Todos los campos son requeridos para cada item'
        }
      }
      if (parseInt(item.quantity) <= 0 || parseFloat(item.unitCost) <= 0) {
        return 'Cantidad y costo deben ser mayores a cero'
      }
    }
    
    return null
  }, [])

  return {
    purchaseItems,
    handleClearAll,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleVariantChange,
    validateItems,
  }
}
