import React from 'react'
import {
  Box,
  Alert,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  AddShoppingCart
} from '@mui/icons-material'
import PurchaseFilters from '../../components/purchases/PurchaseFilters'
import PurchasesTable from '../../components/purchases/PurchasesTable'
import PurchasesCards from '../../components/purchases/PurchasesCards'
import CreatePurchaseDialog from '../../components/purchases/CreatePurchaseDialog'
import { usePurchaseLogic } from '../../hooks/purchases/usePurchaseLogic'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import GradientButton from '../../components/common/GradientButton'

const PurchasePage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const {
    error,
    success,
    createModalOpen,
    detailsPage,
    filters,
    purchases,
    suppliersDetails,
    productsDetails,
    variants,
    allProducts,
    suppliers,
    variantOptions,
    purchaseItems,
    detailsLoading,
    isLoading,
    purchasesCount,
    setCreateModalOpen,
    setError,
    setSuccess,
    handleDetailsPageChange,
    handleFilterChange,
    onSubmit,
    handleClearAll,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleVariantChange,
  } = usePurchaseLogic()

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Compras"
        subtitle="Gestiona compras y entradas de inventario de forma centralizada"
        icon={<AddShoppingCart sx={{ fontSize: { xs: 24, sm: 30 } }} />}
        actions={
          <GradientButton
            startIcon={<AddShoppingCart />}
            onClick={() => setCreateModalOpen(true)}
          >
            Crear Compra
          </GradientButton>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ mb: 2.5 }}>
        <PurchaseFilters
          filters={filters}
          suppliers={suppliersDetails}
          products={productsDetails}
          isMobile={isMobile}
          onFilterChange={handleFilterChange}
        />
      </Box>

      {/* Purchases Table - Desktop */}
      {!isMobile && (
        <PurchasesTable
          purchases={purchases}
          isLoading={detailsLoading}
        />
      )}

      {/* Purchases Cards - Mobile */}
      {isMobile && (
        <PurchasesCards
          purchases={purchases}
          isLoading={detailsLoading}
        />
      )}

      {/* Pagination */}
      {purchasesCount > 20 && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Pagination
            count={Math.ceil(purchasesCount / 20)}
            page={detailsPage}
            onChange={handleDetailsPageChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}

      {/* Create Purchase Dialog */}
      <CreatePurchaseDialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        purchaseItems={purchaseItems}
        variantOptions={variantOptions}
        allProducts={allProducts}
        suppliers={suppliers}
        variants={variants}
        isLoading={isLoading}
        isMobile={isMobile}
        onClearAll={handleClearAll}
        onAddItem={handleAddItem}
        onItemChange={handleItemChange}
        onVariantChange={handleVariantChange}
        onRemoveItem={handleRemoveItem}
        onSubmit={onSubmit}
      />
    </PageShell>
  )
}

export default PurchasePage
