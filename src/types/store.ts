export interface StoreImage {
  id: number
  url: string | null
  is_primary: boolean
  alt_text?: string
  variant_id: number | null
}

export interface StoreVariant {
  id: number
  gender: 'male' | 'female' | 'unisex'
  color: string
  size: string
  price: string
  stock: number
  stock_minimum: number
}

export interface StoreProduct {
  id: number
  name: string
  brand: string
  description: string | null
  product_type: string
  image_url: string | null
  images: StoreImage[]
  variants: StoreVariant[]
}

export interface StoreBranding {
  store_name: string
  tagline: string
  logo_url: string | null
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
  updated_at?: string
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

export interface StoreProductsResponse {
  detail: string
  code: string
  count: number
  page: number
  page_size: number
  has_next: boolean
  products: StoreProduct[]
}

export interface StoreProductsSimpleResponse {
  detail: string
  code: string
  count: number
  products: StoreProduct[]
}

export interface StoreProductDetailResponse {
  detail: string
  code: string
  product: StoreProduct
}

export interface StoreCartItemInput {
  variant_id: number
  quantity: number
}

export interface StoreCartValidationItem {
  variant_id: number
  product_name: string
  variant_info: string
  quantity: number
  unit_price: string
  subtotal: string
  available_stock: number
  image_url?: string | null
}

export interface StoreCartValidationResponse {
  detail: string
  code: string
  items: StoreCartValidationItem[]
  total: string
  commercial?: StoreCommercialSummary
}

export interface StoreCommercialSummary {
  shipping_zone: 'local' | 'regional' | 'national'
  estimated_weight_grams: number
  gross_total: string
  product_cost_total: string
  payment_fee_total: string
  shipping_estimate: string
  packaging_cost: string
  risk_cost: string
  variable_cost_total: string
  projected_profit: string
  projected_margin_percent: string
  min_margin_percent: string
  is_viable_online: boolean
}

export interface StoreShippingAddress {
  department: string
  city: string
  address_line1: string
  address_line2?: string
  reference?: string
  postal_code?: string
  recipient_name: string
  recipient_phone: string
}

export interface StoreCheckoutRequest {
  customer_name: string
  customer_contact?: string
  items: StoreCartItemInput[]
  is_order?: boolean
  shipping_zone?: 'local' | 'regional' | 'national'
  estimated_weight_grams?: number
  shipping_address: StoreShippingAddress
}

export interface StoreCheckoutResponse {
  detail: string
  code: string
  order: {
    sale_id: number
    status: string
    is_order: boolean
    total: string
    items_count: number
  }
  commercial?: StoreCommercialSummary
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
}

export interface StoreOrderStatusResponse {
  detail: string
  code: string
  order: StoreOrder
}

export interface StoreOrderLookupResponse {
  detail: string
  code: string
  count: number
  orders: StoreOrder[]
}

export interface StoreOrderPaymentResponse {
  detail: string
  code: string
  payment: {
    reference: string
    method: string | null
    preferred_method?: string
    status: string
    paid_at: string | null
    checkout_url?: string
  }
  order: StoreOrder
}

export interface StoreWompiVerifyResponse {
  detail: string
  code: string
  transaction: {
    id: string
    status: string
    reference: string
  }
  order: StoreOrder
}

export interface StoreCustomerAuthUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_staff: boolean
  is_superuser: boolean
  groups: string[]
}

export interface StoreCustomerRegisterRequest {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export interface StoreCustomerLoginRequest {
  username: string
  password: string
}

export interface StoreCustomerAuthResponse {
  detail: string
  code: string
  access: string
  refresh: string
  user: StoreCustomerAuthUser
}

export interface StoreMyOrdersResponse {
  detail: string
  code: string
  count: number
  orders: StoreOrder[]
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




