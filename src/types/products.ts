import type { Product, ProductVariant, ProductImage } from './index'

export interface ProductFilters {
  search: string
  page: number
  limit?: number
}

export interface VariantFilters {
  search: string
  page: number
  limit?: number
}

export interface ProductFormData {
  name: string
  description?: string
  sku?: string
  price?: number
  cost?: number
  category?: string
  brand?: string
  active?: boolean
}

export interface VariantFormData {
  product: number
  sku: string
  size: string
  color?: string
  gender: 'male' | 'female' | 'unisex'
  stock: number
  price: number
  cost: number
  active?: boolean
}

export interface ImageUploadData {
  productId: number
  formData: FormData
}

export interface ProductDialogProps {
  open: boolean
  product?: Product
  onClose: () => void
  onSubmit: (data: ProductFormData) => void
  loading: boolean
}

export interface VariantDialogProps {
  open: boolean
  variant?: ProductVariant
  products: Product[]
  onClose: () => void
  onSubmit: (data: VariantFormData) => void
  loading: boolean
}

export interface ProductViewDialogProps {
  open: boolean
  product?: Product
  onClose: () => void
}

export interface VariantViewDialogProps {
  open: boolean
  variant?: ProductVariant
  product?: Product
  onClose: () => void
}

export interface ProductsTableProps {
  products: Product[]
  loading: boolean
  page: number
  totalCount: number
  onPageChange: (page: number) => void
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
  search: string
  onUpdate: (product: Product) => void
  onView: (product: Product) => void
}

export interface VariantsTableProps {
  variants: ProductVariant[]
  loading: boolean
  page: number
  totalCount: number
  allProducts: Product[]
  onPageChange: (page: number) => void
  onEdit: (variant: ProductVariant) => void
  onDelete: (variantId: number) => void
  images: ProductImage[]
  search: string
  onView: (variant: ProductVariant) => void
}

export interface VariantsCardsProps {
  variants: ProductVariant[]
  loading: boolean
  page: number
  totalCount: number
  allProducts: Product[]
  onPageChange: (page: number) => void
  onEdit: (variant: ProductVariant) => void
  onDelete: (variantId: number) => void
  images: ProductImage[]
  search: string
  onView: (variant: ProductVariant) => void
}

export interface ImagesManagementProps {
  allProducts: Product[]
  selectedProduct: number | null
  onProductChange: (productId: number | null) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: (imageId: number) => void
  images: ProductImage[]
  loading: boolean
  uploadLoading: boolean
  variants: ProductVariant[]
}
