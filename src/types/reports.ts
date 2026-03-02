export interface InventoryHistoryItem {
  id: number
  created_at: string
  product: string
  variant: number
  movement_type_display: string
  quantity: number
  stock_after: number
  observation: string
  direction: string
}

export interface InventorySnapshotItem {
  id: number
  month: string
  product: string
  product_sku?: string
  variant_color: string
  variant_size: string
  variant?: number
  stock_opening: number
  total_in: number
  total_out: number
  stock_closing: number
  created_at?: string
}

export interface DailySummaryItem {
  day: string
  total_in: number
  total_out: number
  balance: number
}

export interface LowStockVariant {
  id: number
  product_name: string
  variant_info: string
  current_stock: number
  stock_minimum: number
}

export interface InventoryHistoryParams {
  start_date?: string
  end_date?: string
  product?: string
  variant?: string
  movement_type?: string
  page?: number
}

export interface DailySummaryParams {
  start?: string
  end?: string
}
