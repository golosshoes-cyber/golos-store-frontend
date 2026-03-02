import React from 'react'
import {
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import { useProductsLogic } from '../../hooks/products/useProductsLogic'
import ProductsHeader from '../../components/products/ProductsHeader'
import ProductsTabs from '../../components/products/ProductsTabs'
import ProductDialog from '../../components/products/ProductDialog'
import ProductViewDialog from '../../components/products/ProductViewDialog'
import VariantDialog from '../../components/products/VariantDialog'
import VariantViewDialog from '../../components/products/VariantViewDialog'
import PageShell from '../../components/common/PageShell'

const ProductsPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    isLoading,
    error,
    activeTab,
    page,
    variantPage,
    productSearch,
    variantSearch,
    productInputValue,
    variantInputValue,
    variantError,
    productsData,
    variantsData,
    allProducts,
    allImages,
    productImages,
    variantsLoading,
    imagesLoading,
    dialogOpen,
    editingProduct,
    viewDialogOpen,
    viewingProduct,
    viewVariantDialogOpen,
    viewingVariant,
    viewingVariantProduct,
    variantDialogOpen,
    editingVariant,
    selectedProductForImages,
    setSelectedProductForImages,
    createProductMutation,
    updateProductMutation,
    createVariantMutation,
    updateVariantMutation,
    fetchError,
    setDialogOpen,
    setEditingProduct,
    setViewDialogOpen,
    setViewingProduct,
    setViewVariantDialogOpen,
    setViewingVariant,
    setViewingVariantProduct,
    setError,
    setVariantDialogOpen,
    setEditingVariant,
    setProductInputValue,
    setVariantInputValue,
    handlePageChange,
    handleVariantPageChange,
    handleTabChange,
    handleCreateProduct,
    handleViewProduct,
    handleViewVariant,
    handleEditProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleCreateVariant,
    handleEditVariant,
    handleDeleteVariant,
    handleImageUpload,
    handleDeleteImage,
  } = useProductsLogic()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageShell>
      {/* Header Principal de Productos */}
      <ProductsHeader onCreateProduct={handleCreateProduct} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los productos
        </Alert>
      )}

      <ProductsTabs
        activeTab={activeTab}
        productsData={productsData}
        variantsData={variantsData}
        allProducts={allProducts}
        allImages={allImages}
        productImages={productImages}
        isLoading={isLoading}
        variantsLoading={variantsLoading}
        imagesLoading={imagesLoading}
        page={page}
        variantPage={variantPage}
        productSearch={productSearch}
        variantSearch={variantSearch}
        productInputValue={productInputValue}
        variantInputValue={variantInputValue}
        error={error}
        variantError={variantError}
        isMobile={isMobile}
        selectedProductForImages={selectedProductForImages}
        onTabChange={handleTabChange}
        onProductInputValueChange={setProductInputValue}
        onVariantInputValueChange={setVariantInputValue}
        onPageChange={handlePageChange}
        onVariantPageChange={handleVariantPageChange}
        onCreateProduct={handleCreateProduct}
        onCreateVariant={handleCreateVariant}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProduct={handleUpdateProduct}
        onViewProduct={handleViewProduct}
        onEditVariant={handleEditVariant}
        onDeleteVariant={handleDeleteVariant}
        onViewVariant={handleViewVariant}
        onProductForImagesChange={setSelectedProductForImages}
        onImageUpload={handleImageUpload}
        onImageDelete={handleDeleteImage}
      />

      {/* Diálogo de ver producto */}
      <ProductViewDialog
        open={viewDialogOpen}
        product={viewingProduct}
        onClose={() => {
          setViewDialogOpen(false)
          setViewingProduct(null)
        }}
      />

      {/* Diálogo de crear/editar producto */}
      <ProductDialog
        open={dialogOpen}
        product={editingProduct}
        onClose={() => {
          setDialogOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={(productData) => {
          if (editingProduct) {
            updateProductMutation.mutate({ id: editingProduct.id, product: productData })
          } else {
            createProductMutation.mutate(productData)
          }
        }}
        loading={createProductMutation.isPending || updateProductMutation.isPending}
      />

      {/* Diálogo de ver variante */}
      <VariantViewDialog
        open={viewVariantDialogOpen}
        variant={viewingVariant}
        product={viewingVariantProduct}
        images={allImages || []}
        onClose={() => {
          setViewVariantDialogOpen(false)
          setViewingVariant(null)
          setViewingVariantProduct(null)
        }}
      />

      {/* Diálogo de crear/editar variante */}
      <VariantDialog
        open={variantDialogOpen}
        variant={editingVariant}
        products={allProducts?.results || []}
        onClose={() => {
          setVariantDialogOpen(false)
          setEditingVariant(null)
        }}
        onSubmit={(variantData) => {
          if (editingVariant) {
            updateVariantMutation.mutate({ id: editingVariant.id, variant: variantData })
          } else {
            createVariantMutation.mutate(variantData)
          }
        }}
        loading={createVariantMutation.isPending || updateVariantMutation.isPending}
      />
    </PageShell>
  )
}

export default ProductsPage
