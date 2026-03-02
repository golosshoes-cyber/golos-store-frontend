import { api } from './api'
import type {
  StoreBrandingResponse,
  StoreCartItemInput,
  StoreCartValidationResponse,
  StoreCheckoutRequest,
  StoreCheckoutResponse,
  StoreCustomerAuthResponse,
  StoreCustomerLoginRequest,
  StoreCustomerRegisterRequest,
  StoreMyOrdersResponse,
  StoreOpsBrandingUpdateResponse,
  StoreOpsOrdersResponse,
  StoreOpsManualShipmentPayload,
  StoreOpsManualShipmentResponse,
  StoreOpsSummaryResponse,
  StoreOpsUpdateOrderStatusPayload,
  StoreOpsUpdateOrderStatusResponse,
  StoreOrderLookupResponse,
  StoreOrderPaymentResponse,
  StoreOrderStatusResponse,
  StoreProductDetailResponse,
  StoreProductsSimpleResponse,
  StoreProductsResponse,
  StoreWompiHealthResponse,
  StoreWompiVerifyResponse,
} from '../types/store'

type StoreListParams = {
  page?: number
  page_size?: number
  q?: string
  brand?: string
  product_type?: string
  ordering?: 'name' | '-name' | 'brand' | '-brand' | 'newest' | 'oldest'
}

type StoreOpsOrdersParams = {
  page?: number
  page_size?: number
  status?: string
  search?: string
}

export const storeService = {
  registerCustomer: async (payload: StoreCustomerRegisterRequest): Promise<StoreCustomerAuthResponse> => {
    const response = await api.post('/api/store/auth/register/', payload)
    return response.data
  },

  loginCustomer: async (payload: StoreCustomerLoginRequest): Promise<StoreCustomerAuthResponse> => {
    const response = await api.post('/api/store/auth/login/', payload)
    return response.data
  },

  getMyOrders: async (): Promise<StoreMyOrdersResponse> => {
    const response = await api.get('/api/store/me/orders/')
    return response.data
  },

  getBranding: async (): Promise<StoreBrandingResponse> => {
    const response = await api.get('/api/store/branding/')
    return response.data
  },

  getProducts: async (params: StoreListParams = {}): Promise<StoreProductsResponse> => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page.toString())
    if (params.page_size) query.append('page_size', params.page_size.toString())
    if (params.q) query.append('q', params.q)
    if (params.brand) query.append('brand', params.brand)
    if (params.product_type) query.append('product_type', params.product_type)
    if (params.ordering) query.append('ordering', params.ordering)

    const suffix = query.toString() ? `?${query.toString()}` : ''
    const response = await api.get(`/api/store/products/${suffix}`)
    return response.data
  },

  getFeaturedProducts: async (limit?: number): Promise<StoreProductsSimpleResponse> => {
    const suffix = limit ? `?limit=${limit}` : ''
    const response = await api.get(`/api/store/products/featured/${suffix}`)
    return response.data
  },

  getRelatedProducts: async (productId: number, limit?: number): Promise<StoreProductsSimpleResponse> => {
    const suffix = limit ? `?limit=${limit}` : ''
    const response = await api.get(`/api/store/products/${productId}/related/${suffix}`)
    return response.data
  },

  getProductDetail: async (productId: number): Promise<StoreProductDetailResponse> => {
    const response = await api.get(`/api/store/products/${productId}/`)
    return response.data
  },

  validateCart: async (
    items: StoreCartItemInput[],
    options?: { shipping_zone?: 'local' | 'regional' | 'national'; estimated_weight_grams?: number },
  ): Promise<StoreCartValidationResponse> => {
    const response = await api.post('/api/store/cart/validate/', { items, ...options })
    return response.data
  },

  checkout: async (payload: StoreCheckoutRequest): Promise<StoreCheckoutResponse> => {
    const response = await api.post('/api/store/checkout/', payload)
    return response.data
  },


  lookupOrders: async (params: { sale_id?: number; customer?: string; customer_contact?: string }): Promise<StoreOrderLookupResponse> => {
    const query = new URLSearchParams()
    if (params.sale_id) query.append('sale_id', params.sale_id.toString())
    if (params.customer) query.append('customer', params.customer)
    if (params.customer_contact) query.append('customer_contact', params.customer_contact)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    const response = await api.get(`/api/store/orders/lookup/${suffix}`)
    return response.data
  },
  getOrderStatus: async (saleId: number, customerContact?: string): Promise<StoreOrderStatusResponse> => {
    const suffix = customerContact ? `?customer_contact=${encodeURIComponent(customerContact)}` : ''
    const response = await api.get(`/api/store/orders/${saleId}/${suffix}`)
    return response.data
  },

  payOrder: async (saleId: number, customerContact: string, paymentMethod: string): Promise<StoreOrderPaymentResponse> => {
    const response = await api.post(`/api/store/orders/${saleId}/pay/`, {
      customer_contact: customerContact,
      payment_method: paymentMethod,
    })
    return response.data
  },

  verifyWompiTransaction: async (
    saleId: number,
    customerContact: string,
    transactionId: string,
  ): Promise<StoreWompiVerifyResponse> => {
    const response = await api.post(`/api/store/orders/${saleId}/wompi/verify/`, {
      customer_contact: customerContact,
      transaction_id: transactionId,
    })
    return response.data
  },

  getWompiHealth: async (): Promise<StoreWompiHealthResponse> => {
    const response = await api.get('/api/store/wompi/health/')
    return response.data
  },

  getOpsSummary: async (): Promise<StoreOpsSummaryResponse> => {
    const response = await api.get('/api/store/ops/summary/')
    return response.data
  },

  getOpsOrders: async (params: StoreOpsOrdersParams = {}): Promise<StoreOpsOrdersResponse> => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page.toString())
    if (params.page_size) query.append('page_size', params.page_size.toString())
    if (params.status) query.append('status', params.status)
    if (params.search) query.append('search', params.search)

    const suffix = query.toString() ? `?${query.toString()}` : ''
    const response = await api.get(`/api/store/ops/orders/${suffix}`)
    return response.data
  },

  updateOpsOrderStatus: async (
    saleId: number,
    payload: StoreOpsUpdateOrderStatusPayload,
  ): Promise<StoreOpsUpdateOrderStatusResponse> => {
    const response = await api.patch(`/api/store/ops/orders/${saleId}/status/`, payload)
    return response.data
  },

  registerOpsManualShipment: async (
    saleId: number,
    payload: StoreOpsManualShipmentPayload,
  ): Promise<StoreOpsManualShipmentResponse> => {
    const response = await api.post(`/api/store/ops/orders/${saleId}/shipment/manual/`, payload)
    return response.data
  },

  getOpsBranding: async (): Promise<StoreBrandingResponse> => {
    const response = await api.get('/api/store/ops/branding/')
    return response.data
  },

  updateOpsBranding: async (
    payload: Partial<{
      store_name: string
      tagline: string
      logo_url: string
      favicon_url: string
      hero_title: string
      hero_subtitle: string
      legal_representative_name: string
      legal_id_type: string
      legal_id_number: string
      legal_contact_email: string
      legal_contact_phone: string
      legal_contact_address: string
      legal_contact_city: string
      legal_contact_department: string
      promo_top_enabled: boolean
      promo_top_title: string
      promo_top_text: string
      promo_top_image_desktop_url: string
      promo_top_image_mobile_url: string
      promo_bottom_enabled: boolean
      promo_bottom_title: string
      promo_bottom_text: string
    }>,
  ): Promise<StoreOpsBrandingUpdateResponse> => {
    const response = await api.patch('/api/store/ops/branding/', payload)
    return response.data
  },
}




