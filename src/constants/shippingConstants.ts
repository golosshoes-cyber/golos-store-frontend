export const SHIPPING_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; bgColor: string }> = {
  created: { label: 'Guía creada', color: '#fbbf24', icon: '📦', bgColor: '#fef3c7' },
  in_transit: { label: 'En tránsito', color: '#3b82f6', icon: '🚚', bgColor: '#dbeafe' },
  delivered: { label: 'Entregado', color: '#10b981', icon: '✅', bgColor: '#d1fae5' },
  failed: { label: 'Fallido', color: '#ef4444', icon: '❌', bgColor: '#fee2e2' },
  canceled: { label: 'Cancelado', color: '#6b7280', icon: '🚫', bgColor: '#f3f4f6' }
}

export const MOCK_SHIPPING_QUOTE = {
  services: [
    { name: 'Estándar', cost: '12500', eta_hours: 48, available: true },
    { name: 'Express', cost: '18500', eta_hours: 24, available: true }
  ]
}
