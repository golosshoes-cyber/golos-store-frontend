import type { DashboardStats } from './index'

export { DashboardStats }

export interface RecentMovement {
  id: number
  type: string
  type_display: string
  product_name: string
  variant_info: string
  quantity: number
  created_at: string
}

export interface RecentMovementsResponse {
  movements: RecentMovement[]
}

export interface TopProduct {
  id: number
  product_name: string
  total_sold: number
  revenue: number
}

export interface TopProductsResponse {
  products: TopProduct[]
}

export interface SupplierPerformance {
  id: number
  name: string
  is_active: boolean
  total_quantity: number
  total_purchases: number
  total_products: number
  last_purchase?: string
}

export interface SupplierPerformanceResponse {
  suppliers: SupplierPerformance[]
}

export interface SalesChartData {
  date: string
  total: number
}

export interface SalesChartResponse {
  chart_data: SalesChartData[]
}

export interface ProductVariant {
  id: number
  sku: string
  product: number
  size: string
  color?: string
  gender: string
  stock: number
  price: number
  cost: number
  active: boolean
}

export interface SearchResultsResponse {
  results: ProductVariant[]
}

export interface DashboardHeaderProps {
  searchValue: string
  searchOpen: boolean
  searchLoading: boolean
  searchResults?: SearchResultsResponse
  onSearchValueChange: (value: string) => void
  onSearchOpenChange: (open: boolean) => void
  onNavigateToVariant: (variantId: number) => void
  onNavigateToCreateProduct: () => void
  onNavigateToCreateSale: () => void
  getProductName: (productId: number) => string
}

export interface DashboardAlertProps {
  lowStock: number
  onViewLowStock: () => void
}

export interface DashboardStatsCardsProps {
  stats?: DashboardStats
}

export interface DashboardMetricsProps {
  stats?: DashboardStats
}

export interface RecentMovementsProps {
  movements?: RecentMovement[]
  loading: boolean
}

export interface TopProductsProps {
  products?: TopProduct[]
  loading: boolean
}

export interface SupplierPerformanceProps {
  suppliers?: SupplierPerformance[]
  loading: boolean
}

export interface SalesChartProps {
  chartData?: SalesChartData[]
  loading: boolean
}
