// Tipos admin/Ops para gestión de la tienda.
// Los tipos puramente storefront (cart, checkout, auth cliente, productos públicos)
// viven en el proyecto golos-public-store.

export interface StoreHeroSlide {
  id: number
  order: number
  image_url: string
  eyebrow: string
  title: string
  subtitle: string
  cta_text: string
  cta_href: string
  enabled: boolean
  created_at?: string
  updated_at?: string
}

export interface StoreBranding {
  store_name: string
  tagline: string
  logo_url: string | null
  favicon_url: string
  hero_title: string
  hero_subtitle: string
  hero_image_url: string | null
  hero_slides?: StoreHeroSlide[]
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
  updated_at?: string
}

export interface StoreHeroSlideListResponse {
  detail: string
  code: string
  slides: StoreHeroSlide[]
}

export interface StoreHeroSlideResponse {
  detail: string
  code: string
  slide: StoreHeroSlide
}

export interface StoreHeroSlideReorderPayload {
  order: number[]
}

export interface StoreBrandingResponse {
  detail: string
  code: string
  branding: StoreBranding
}

export interface StoreOpsBrandingUpdateResponse {
  detail: string
  code: string
  branding: StoreBranding
}

export interface StoreShippingAddress {
  department: string
  department_code?: string
  city: string
  city_code?: string
  address_line1: string
  address_line2?: string
  reference?: string
  postal_code?: string
  recipient_name: string
  recipient_phone: string
}

export interface StoreOrderStatusDetail {
  code: string
  label: string
  stage: number
}

export interface StoreOrderTimelineEvent {
  code: string
  label: string
  at: string
}

export interface StoreOrderItem {
  variant_id: number
  product_name: string
  variant_info: string
  quantity: number
  unit_price: string
  subtotal: string
}

export interface StoreShipment {
  id: number
  carrier: string
  service: string
  tracking_number: string
  provider_reference: string | null
  label_url: string | null
  status: string
  shipping_cost: string
  currency: string
  created_at: string
}

export interface StoreOrder {
  customer_name: string
  sale_id: number
  status: string
  status_detail: StoreOrderStatusDetail
  payment_status: string
  payment_method: string | null
  payment_method_preference?: string | null
  payment_reference: string | null
  is_order: boolean
  total: string
  created_at: string
  updated_at: string
  items: StoreOrderItem[]
  timeline: StoreOrderTimelineEvent[]
  shipment?: StoreShipment | null
  shipping_address?: StoreShippingAddress
  invoice_required?: boolean
  billing_data?: {
    id_type: string
    id_number: string
    name: string
    email: string
  }
}

export interface StoreOpsOrdersResponse {
  detail: string
  code: string
  count: number
  page: number
  page_size: number
  has_next: boolean
  orders: StoreOrder[]
}

export interface StoreOpsSummaryResponse {
  detail: string
  code: string
  summary: {
    total_orders: number
    pending: number
    paid: number
    processing: number
    shipped: number
    delivered: number
    canceled: number
  }
}

export interface StoreOpsUpdateOrderStatusPayload {
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'canceled'
  note?: string
}

export interface StoreOpsUpdateOrderStatusResponse {
  detail: string
  code: string
  order: StoreOrder
}

export interface StoreOpsManualShipmentPayload {
  carrier: string
  tracking_number: string
  shipping_cost: string
  service?: string
  provider_reference?: string
  label_url?: string
  currency?: string
  status?: 'created' | 'in_transit' | 'delivered' | 'failed' | 'canceled'
}

export interface StoreOpsManualShipmentResponse {
  detail: string
  code: string
  shipment: StoreShipment
  order: StoreOrder
}

export interface StoreWompiHealthResponse {
  detail: string
  code: string
  configured: boolean
  environment: string
  api_base_url: string
  checkout_base_url: string
  missing: string[]
}
