import React from 'react'
import {
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  AddShoppingCart,
} from '@mui/icons-material'
import PurchasesTabs from '../../components/purchases/PurchasesTabs'
import CreatePurchaseDialog from '../../components/purchases/CreatePurchaseDialog'
import { usePurchaseLogic } from '../../hooks/purchases/usePurchaseLogic'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import GradientButton from '../../components/common/GradientButton'
import ExportButton from '../../components/common/ExportButton'
import { exportService } from '../../services/exportService'
import { Box } from '@mui/material'

const PurchasePage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const {
    error,
    success,
    createModalOpen,
    detailsPage,
    filters,
    processedPurchases,
    suppliersDetails,
    productsDetails,
    purchaseSort,
    setPurchaseSort,
    variantOptions,
    variants,
    allProducts,
    suppliers,
    purchaseItems,
    detailsLoading,
    formLoading,
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
          <Box sx={{ display: 'flex', gap: 1, width: isMobile ? '100%' : 'auto' }}>
            <ExportButton 
              onExport={(format) => exportService.exportPurchases(format)} 
              fullWidth={isMobile}
            />
            <GradientButton
              startIcon={<AddShoppingCart />}
              onClick={() => setCreateModalOpen(true)}
              fullWidth={isMobile}
            >
              Crear Compra
            </GradientButton>
          </Box>
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

      <PurchasesTabs
        purchases={processedPurchases}
        loading={detailsLoading}
        page={detailsPage}
        totalCount={purchasesCount}
        onPageChange={handleDetailsPageChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        suppliers={suppliersDetails}
        products={productsDetails}
        purchaseSort={purchaseSort}
        onSortChange={setPurchaseSort}
      />

      {/* Create Purchase Dialog */}
      <CreatePurchaseDialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        purchaseItems={purchaseItems}
        variantOptions={variantOptions}
        allProducts={allProducts}
        suppliers={suppliers}
        variants={variants}
        isLoading={formLoading}
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
