import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import type { Product, ProductVariant, ProductImage } from '../../types'
import ProductsTable from './ProductsTable'
import VariantsTable from './VariantsTable'
import VariantsCards from './VariantsCards'
import ImagesManagement from './ImagesManagement'
import GradientButton from '../common/GradientButton'

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
  return (
    <>
      <Tabs 
        value={activeTab} 
        onChange={onTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-flexContainer': {
            flexDirection: { xs: 'column', sm: 'row', lg: 'row' },
          },
          mb: 2
        }}
      >
        <Tab label="Productos" />
        <Tab label="Variantes" />
        <Tab label="Imágenes" />
      </Tabs>

      <Divider sx={{ my: 3 }} />

      {activeTab === 0 && (
        <TextField
          key="product-search"
          label="Buscar productos"
          value={productInputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProductInputValueChange(e.target.value)}
          fullWidth
          sx={{ mb: 2, mt: 2 }}
        />
      )}

      {activeTab === 0 && (
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
      )}

      {activeTab === 1 && (
        <>
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={2}
            mb={3}
          >
            <Typography variant="h4">Variantes</Typography>
            <GradientButton
              startIcon={<AddIcon />}
              onClick={onCreateVariant}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                minWidth: { xs: 'auto', sm: '120px' }
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

          <TextField
            key="variant-search"
            label="Buscar variantes"
            value={variantInputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onVariantInputValueChange(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

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
        </>
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
