/**
 * User interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
  groups: string[];
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Auth response interface
 */
export interface AuthResponse {
  access: string;
  refresh: string;
}

/**
 * Supplier interface
 */
export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  nit?: string;
  preferred_products?: number[];
  average_price?: number;
  last_purchase_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Purchase {
  id: number
  movement_type: string
  quantity: number
  unit_cost: number
  total_cost: number
  observation?: string
  created_at: string
  variant: {
    id: number
    product: {
      id: number
      name: string
      sku: string
    }
    size: string
    color: string
    gender: string
  }
  supplier: {
    id: number
    name: string
    nit: string
  } | null
}
export interface Product {
  id: number;
  name: string;
  description?: string;
  brand: string;
  product_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

/**
 * Product variant interface
 */
export interface ProductVariant {
  id: number;
  product: number;
  product_name?: string;
  product_brand?: string;
  image_url?: string | null;
  sku: string;
  size: string;
  gender: string;
  color?: string;
  stock: number;
  price: number;
  cost: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

/**
 * Product image interface
 */
export interface ProductImage {
  id: number;
  product: number;
  variant: number | null;
  image: string;
  alt_text?: string;
  is_primary: boolean;
  file_size?: number;
  width?: number;
  height?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface ElectronicInvoice {
  id: number;
  external_id: string;
  number: string;
  cufe?: string;
  qr_data?: string;
  pdf_url?: string;
  xml_url?: string;
  status: string;
  created_at: string;
  sent_at?: string;
}

/**
 * Sale interface
 */
export interface Sale {
  id: number;
  customer: string;
  total: string | number;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled' | 'cancelled';
  payment_status?: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: 'CASH' | 'NEQUI' | 'DAVIPLATA' | 'CARD' | 'TRANSFER' | 'PSE' | 'OTHER' | string | null;
  payment_reference?: string | null;
  created_at: string;
  created_by: string;
  details: SaleDetail[];
  is_order?: boolean;
  active?: boolean;
  document_number?: string | null;
  invoice_required?: boolean;
  invoicing_method?: 'NONE' | 'AUTOMATIC' | 'MANUAL';
  is_electronic_invoice?: boolean;
  electronic_invoice?: ElectronicInvoice | null;
}

/**
 * Sale detail interface
 */
export interface SaleDetail {
  id: number;
  sale: number;
  variant: number | ProductVariant;
  quantity: number;
  price: string | number;
  subtotal: string | number;
}

/**
 * Products stats interface
 */
export interface ProductsStats {
  total: number;
  active_variants: number;
  low_stock: number;
  inventory_value: number;
}

/**
 * Sales stats interface
 */
export interface SalesStats {
  total: number;
  completed: number;
  pending: number;
  recent_month: {
    count: number;
    total: number;
  };
  recent_week: {
    count: number;
    total: number;
  };
}

/**
 * Purchases stats interface
 */
export interface PurchasesStats {
  recent_month: {
    count: number;
    total_quantity: number;
  };
}

/**
 * Suppliers stats interface
 */
export interface SuppliersStats {
  total: number;
  active: number;
  with_purchases: number;
}

/**
 * Dashboard stats interface
 */
export interface DashboardStats {
  products: ProductsStats;
  sales: SalesStats;
  purchases: PurchasesStats;
  suppliers: SuppliersStats;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
