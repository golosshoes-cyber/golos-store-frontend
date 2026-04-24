import { api } from './api'
import type {
  StoreBrandingResponse,
  StoreHeroSlideListResponse,
  StoreHeroSlideResponse,
  StoreOpsBrandingUpdateResponse,
  StoreOpsOrdersResponse,
  StoreOpsManualShipmentPayload,
  StoreOpsManualShipmentResponse,
  StoreOpsSummaryResponse,
  StoreOpsUpdateOrderStatusPayload,
  StoreOpsUpdateOrderStatusResponse,
  StoreWompiHealthResponse,
} from '../types/store'

type StoreOpsOrdersParams = {
  page?: number
  page_size?: number
  status?: string
  search?: string
}

export const storeService = {
  // Branding público (para favicon — no requiere auth)
  getBranding: async (): Promise<StoreBrandingResponse> => {
    const response = await api.get('/api/store/branding/')
    return response.data
  },

  // Wompi health — monitoreo admin
  getWompiHealth: async (): Promise<StoreWompiHealthResponse> => {
    const response = await api.get('/api/store/wompi/health/')
    return response.data
  },

  // Admin: pedidos y ops
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
      logo_url: string | null
      favicon_url: string | null
      hero_title: string | null
      hero_subtitle: string | null
      hero_image_url: string | null
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
      maintenance_mode: boolean
      maintenance_message: string
    }>,
  ): Promise<StoreOpsBrandingUpdateResponse> => {
    const response = await api.patch('/api/store/ops/branding/', payload)
    return response.data
  },

  // Hero Carousel Slides
  listHeroSlides: async (): Promise<StoreHeroSlideListResponse> => {
    const response = await api.get('/api/store/ops/branding/hero-slides/')
    return response.data
  },

  createHeroSlide: async (formData: FormData): Promise<StoreHeroSlideResponse> => {
    const response = await api.post('/api/store/ops/branding/hero-slides/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  updateHeroSlide: async (
    slideId: number,
    formData: FormData,
  ): Promise<StoreHeroSlideResponse> => {
    const response = await api.patch(
      `/api/store/ops/branding/hero-slides/${slideId}/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data
  },

  deleteHeroSlide: async (slideId: number): Promise<void> => {
    await api.delete(`/api/store/ops/branding/hero-slides/${slideId}/`)
  },

  reorderHeroSlides: async (
    order: number[],
  ): Promise<StoreHeroSlideListResponse> => {
    const response = await api.post('/api/store/ops/branding/hero-slides/reorder/', {
      order,
    })
    return response.data
  },
}
