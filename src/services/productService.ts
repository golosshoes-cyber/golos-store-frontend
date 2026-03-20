import { api } from './api'
import { Product, ProductVariant, ProductImage } from '../types'

// TODO: Implementar servicios de productos
export const productService = {
  // Servicios para Productos
  getProducts: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<{ count: number; next?: string; previous?: string; results: Product[] }> => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())
    if (params.search) query.append('search', params.search)
    const response = await api.get(`/api/products/?${query.toString()}`)
    return response.data
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}/`)
    return response.data
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post('/api/products/', product)
    return response.data
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.patch(`/api/products/${id}/`, product)
    return response.data
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}/`)
  },

  // Servicios para variantes
  getVariants: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<{ count: number; next?: string; previous?: string; results: ProductVariant[] }> => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())
    if (params.search) query.append('search', params.search)
    const response = await api.get(`/api/product-variants/?${query.toString()}`)
    return response.data
  },

  createVariant: async (variant: Partial<ProductVariant>): Promise<ProductVariant> => {
    const response = await api.post('/api/product-variants/', variant)
    return response.data
  },

  updateVariant: async (id: number, variant: Partial<ProductVariant>): Promise<ProductVariant> => {
    const response = await api.patch(`/api/product-variants/${id}/`, variant)
    return response.data
  },

  deleteVariant: async (id: number): Promise<void> => {
    await api.delete(`/api/product-variants/${id}/`)
  },

  adjustStock: async (variantId: number, currentStock: number, newStock: number, reason: string): Promise<any> => {
    const quantity = newStock - currentStock  // Calcular la diferencia
    const response = await api.post('/api/inventory-adjustments/', {
      variant: variantId,
      movement_type: 'adjustment',  // Tipo de movimiento
      quantity: quantity,           // Diferencia de stock
      observation: reason          // ← Campo correcto según serializer
    })
    return response.data
  },

  createPurchase: async (items: {variantId: number, quantity: number, unitCost: number, supplierId?: number}[]) => {
    // Group items by supplierId
    const itemsBySupplier: Record<number, any[]> = {}
    
    for (const item of items) {
      const supplierId = item.supplierId || 1 // fallback to 1 if not provided
      if (!itemsBySupplier[supplierId]) {
        itemsBySupplier[supplierId] = []
      }
      itemsBySupplier[supplierId].push({
        variant: item.variantId,
        quantity: item.quantity
      })
    }
    
    // Make a bulk purchase request for each supplier group
    let lastResponse = null
    for (const [supplierIdStr, supplierItems] of Object.entries(itemsBySupplier)) {
      const supplierId = parseInt(supplierIdStr)
      lastResponse = await api.post('/api/purchases/bulk_purchase/', { 
        supplier: supplierId, 
        items: supplierItems 
      })
    }
    
    // Return the data of the last response (or we could combine them if needed)
    return lastResponse?.data
  },

  // Servicios para imagenes 
  getImages: async (productId?: number): Promise<ProductImage[]> => {
    const url = productId ? `/api/product-images/?product=${productId}` : '/api/product-images/'
    const response = await api.get(url)
    return response.data.results
  },

  uploadImage: async (productId: number, formData: FormData): Promise<ProductImage> => {
    console.log('Uploading image for product:', productId)
    const response = await api.post('/api/product-images/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Upload response:', response.data)
    return response.data
  },

  updateImage: async (id: number, data: Partial<ProductImage>): Promise<ProductImage> => {
    const response = await api.patch(`/api/product-images/${id}/`, data)
    return response.data
  },

  deleteImage: async (id: number): Promise<void> => {
    await api.delete(`/api/product-images/${id}/`)
  },

  // Inventory Reports
  dailyInventorySummary: async (params?: { start?: string; end?: string }): Promise<any> => {
    const query = new URLSearchParams()
    if (params?.start) query.append('start', params.start)
    if (params?.end) query.append('end', params.end)
    const response = await api.get(`/api/inventory-report-daily/?${query.toString()}`)
    return response.data
  },

  lowStockVariants: async (): Promise<any> => {
    const response = await api.get('/api/dashboard/low_stock/')
    return response.data
  },

  createMonthlySnapshot: async (data?: { month?: string }): Promise<any> => {
    const response = await api.post('/inventory/close-month/', data || {})
    return response.data
  },

  bulkPurchase: async (data: any): Promise<any> => {
    const response = await api.post('/api/batch/bulk_purchase/', data)
    return response.data
  },

  bulkAdjustments: async (data: any): Promise<any> => {
    const response = await api.post('/api/batch/bulk_adjustments/', data)
    return response.data
  },

  inventoryHistory: async (params: { start_date?: string; end_date?: string; product?: string; variant?: string; movement_type?: string; page?: number } = {}): Promise<any> => {
    const query = new URLSearchParams()
    if (params.start_date) query.append('start_date', params.start_date)
    if (params.end_date) query.append('end_date', params.end_date)
    if (params.product) query.append('product', params.product)
    if (params.variant) query.append('variant', params.variant)
    if (params.movement_type) query.append('movement_type', params.movement_type)
    if (params.page) query.append('page', params.page.toString())
    const response = await api.get(`/api/inventory-history/?${query.toString()}`)
    return response.data
  },

  getInventorySnapshots: async (params: { page?: number; limit?: number } = {}): Promise<any> => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page.toString())
    if (params.limit) query.append('limit', params.limit.toString())
    const response = await api.get(`/api/inventory-snapshots/?${query.toString()}`)
    return response.data
  },
  
  financialReport: async (params?: { start_date?: string; end_date?: string }): Promise<any> => {
    console.log('--- PRODUCT SERVICE VERSION: 2026-03-17-V2 ---')
    const query = new URLSearchParams()
    if (params?.start_date) query.append('start_date', params.start_date)
    if (params?.end_date) query.append('end_date', params.end_date)
    const url = `/api/financial-report/?${query.toString()}`
    console.log('Fetching financial report from:', url)
    const response = await api.get(url)
    return response.data
  },
}
