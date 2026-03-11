import { SHIPPING_STATUS_CONFIG } from '../constants/shippingConstants'

export const getStatusLabel = (status: string): string => {
  return SHIPPING_STATUS_CONFIG[status]?.label || status
}

export const getStatusConfig = (status: string) => {
  return SHIPPING_STATUS_CONFIG[status] || {
    label: status,
    color: '#6b7280',
    icon: '📦',
    bgColor: '#f3f4f6'
  }
}
