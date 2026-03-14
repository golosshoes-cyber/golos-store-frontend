export interface Purchase {
  id: number
  movement_type: string
  created_at: string
  variant?: {
    id: number
    size: string
    color: string
    gender: string
    product?: {
      id: number
      name: string
      sku: string
    }
  }
  supplier: {
    id: number
    name: string
    nit?: string
  } | null
  quantity: number
  unit_cost: number
  total_cost: number
  observation?: string
}

export interface PurchaseItem {
  isNew: boolean
  variantId: string
  quantity: string
  unitCost: string
  supplierId: string
  newProductId?: string
  newSize?: string
  newColor?: string
  newGender?: string
}

export interface VariantOption {
  id: number
  size: string
  color?: string
  gender: string
  product?: {
    id: number
    name: string
  }
  label: string
}

export interface PurchaseFilters {
  supplier?: string
  product?: string
  start_date?: string
  end_date?: string
  search?: string
  ordering?: string
}

export interface PurchaseFormData {
  page: number
  supplier?: string
  product?: string
  start_date?: string
  end_date?: string
  search?: string
}
