import React from 'react'
import {
  Box,
  TextField,
  Alert,
  Tabs,
  Tab,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material'
import type { Product, ProductVariant, ProductImage } from '../../types'
import ProductsTable from './ProductsTable'
import VariantsTable from './VariantsTable'
import VariantsCards from './VariantsCards'
import ImagesManagement from './ImagesManagement'
import GradientButton from '../common/GradientButton'
import { useThemeMode } from '../../contexts/ThemeModeContext'

interface ProductsTabsProps {
  activeTab: number
  productsData?: { results: Product[]; count: number }
  variantsData?: { results: ProductVariant[]; count: number }
  allProducts?: { results: Product[] }
  allImages?: ProductImage[]
  productImages?: ProductImage[]
  isLoading: boolean
  variantsLoading: boolean
  imagesLoading: boolean
  page: number
  variantPage: number
  productSearch: string
  variantSearch: string
  productInputValue: string
  variantInputValue: string
  error: string
  variantError: string
  isMobile: boolean
  selectedProductForImages: number | null
  onTabChange: (_: React.SyntheticEvent, newValue: number) => void
  onProductInputValueChange: (value: string) => void
  onVariantInputValueChange: (value: string) => void
  onPageChange: (page: number) => void
  onVariantPageChange: (page: number) => void
  onCreateProduct: () => void
  onCreateVariant: () => void
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: number) => void
  onUpdateProduct: (product: Product) => void
  onViewProduct: (product: Product) => void
  onEditVariant: (variant: ProductVariant) => void
  onDeleteVariant: (variantId: number) => void
  onViewVariant: (variant: ProductVariant) => void
  onProductForImagesChange: (productId: number | null) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageDelete: (imageId: number) => void
}

const ProductsTabs: React.FC<ProductsTabsProps> = ({
  activeTab,
  productsData,
  variantsData,
  allProducts,
  allImages,
  productImages,
  isLoading,
  variantsLoading,
  imagesLoading,
  page,
  variantPage,
  productSearch,
  variantSearch,
  productInputValue,
  variantInputValue,
  variantError,
  isMobile,
  selectedProductForImages,
  onTabChange,
  onProductInputValueChange,
  onVariantInputValueChange,
  onPageChange,
  onVariantPageChange,
  onCreateVariant,
  onEditProduct,
  onDeleteProduct,
  onUpdateProduct,
  onViewProduct,
  onEditVariant,
  onDeleteVariant,
  onViewVariant,
  onProductForImagesChange,
  onImageUpload,
  onImageDelete,
}) => {
  const theme = useTheme()
  const { mode } = useThemeMode()

  const searchFieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: mode === 'light' ? alpha('#000', 0.02) : alpha('#fff', 0.02),
      borderRadius: 1.5,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: mode === 'light' ? alpha('#000', 0.04) : alpha('#fff', 0.04),
      },
      '&.Mui-focused': {
        bgcolor: 'background.paper',
      }
    }
  }

  return (
    <>
      <Tabs 
        value={activeTab} 
        onChange={onTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 40,
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: 'text.primary',
            height: 2,
          },
          '& .MuiTab-root': {
            minHeight: 40,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 400,
            color: 'text.secondary',
            px: 2,
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              color: 'text.primary',
              fontWeight: 500,
            },
            '&:hover': {
              color: 'text.primary',
              opacity: 1,
            }
          },
        }}
      >
        <Tab label="Productos" />
        <Tab label="Variantes" />
        <Tab label="Imágenes" />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ mb: 3 }}>
          <TextField
            key="product-search"
            placeholder="Buscar por nombre, marca o tipo..."
            value={productInputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProductInputValueChange(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ fontSize: 18, mr: 1, color: 'text.disabled' }} />,
            }}
            sx={searchFieldSx}
          />
          <Box sx={{ mt: 3 }}>
            <ProductsTable
              products={productsData?.results || []}
              loading={isLoading}
              page={page}
              totalCount={productsData?.count || 0}
              onPageChange={onPageChange}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              search={productSearch}
              onUpdate={onUpdateProduct}
              onView={onViewProduct}
            />
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ mb: 3 }}>
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={2}
            mb={3}
          >
            <TextField
              key="variant-search"
              placeholder="Buscar por SKU, producto o género..."
              value={variantInputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onVariantInputValueChange(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ fontSize: 18, mr: 1, color: 'text.disabled' }} />,
              }}
              sx={searchFieldSx}
            />
            <GradientButton
              startIcon={<AddIcon />}
              onClick={onCreateVariant}
              size="small"
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                whiteSpace: 'nowrap',
                height: 40,
                borderRadius: 1.5,
              }}
            >
              Nueva Variante
            </GradientButton>
          </Box>

          {variantError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
              {variantError}
            </Alert>
          )}

          {isMobile ? (
            <VariantsCards
              variants={variantsData?.results || []}
              loading={variantsLoading}
              page={variantPage}
              totalCount={variantsData?.count || 0}
              allProducts={allProducts?.results || []}
              onPageChange={onVariantPageChange}
              onEdit={onEditVariant}
              onDelete={onDeleteVariant}
              images={allImages || []}
              search={variantSearch}
              onView={onViewVariant}
            />
          ) : (
            <VariantsTable
              variants={variantsData?.results || []}
              loading={variantsLoading}
              page={variantPage}
              totalCount={variantsData?.count || 0}
              allProducts={allProducts?.results || []}
              onPageChange={onVariantPageChange}
              onEdit={onEditVariant}
              onDelete={onDeleteVariant}
              images={allImages || []}
              search={variantSearch}
              onView={onViewVariant}
            />
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <ImagesManagement
          allProducts={allProducts?.results || []}
          selectedProduct={selectedProductForImages}
          onProductChange={onProductForImagesChange}
          onUpload={onImageUpload}
          onDelete={onImageDelete}
          images={productImages || []}
          loading={imagesLoading}
          uploadLoading={false}
          variants={variantsData?.results || []}
        />
      )}
    </>
  )
}

export default ProductsTabs
