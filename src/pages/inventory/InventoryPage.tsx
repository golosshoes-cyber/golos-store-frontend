import React, { useState, useEffect, useRef } from 'react'
import {
} from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useInventoryData } from '../../hooks/inventory/useInventoryData'
import { useNotification } from '../../hooks/useNotification'
import InventoryTabs from '../../components/inventory/InventoryTabs'
import InventoryAdjustmentDialog from '../../components/inventory/InventoryAdjustmentDialog'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import { Inventory as InventoryIcon } from '@mui/icons-material'
import ExportButton from '../../components/common/ExportButton'
import { exportService } from '../../services/exportService'
import { useTheme, useMediaQuery } from '@mui/material'

const InventoryPage: React.FC = () => {
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const location = useLocation()
  const hasProcessedPrefill = useRef(false)

  const { showSuccess, showError } = useNotification()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    page,
    setPage,
    searchTerm,
    lowStockOnly,
    filteredVariants,
    totalCount,
    isLoading,
    getProductInfo,
    getStockStatus,
    handleSearchChange,
    toggleLowStockOnly,
    adjustStockMutation,
    isAdjustingStock,
  } = useInventoryData({ showSuccess, showError })

  const handleAdjustStock = (variant: any) => {
    setSelectedVariant(variant)
    setAdjustmentDialogOpen(true)
  }

  // Resetear el ref cuando cambie la ubicación
  useEffect(() => {
    hasProcessedPrefill.current = false
  }, [location.pathname])

  // Manejar variante pre-llenada desde navegación
  useEffect(() => {
    const state = location.state as { prefillVariant?: number }
    if (state?.prefillVariant && state.prefillVariant > 0 && !adjustmentDialogOpen && !isLoading && !hasProcessedPrefill.current) {
      hasProcessedPrefill.current = true
      const variant = filteredVariants.find((v: any) => v.id === state.prefillVariant)
      if (variant) {
        window.history.replaceState({}, document.title)
        handleAdjustStock(variant)
      }
    }
  }, [location.state, adjustmentDialogOpen, isLoading, filteredVariants])

  const handleSaveAdjustment = (variantId: number, newStock: number, reason: string) => {
    const variant = selectedVariant
    if (!variant) return

    adjustStockMutation.mutate({
      variantId,
      currentStock: variant.stock,
      newStock,
      reason
    }, {
      onSuccess: () => {
        setAdjustmentDialogOpen(false)
        setSelectedVariant(null)
      },
    })
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  return (
    <PageShell>
      <GlobalSectionHeader 
        title="Inventario"
        subtitle="Control de existencias y ajustes de stock para todas las variantes"
        icon={<InventoryIcon sx={{ fontSize: 30 }} />}
        actions={
          <ExportButton 
            onExport={(format) => exportService.exportInventory(format)} 
            fullWidth={isMobile}
          />
        }
      />

      <InventoryTabs
        variants={filteredVariants}
        loading={isLoading}
        page={page}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        lowStockOnly={lowStockOnly}
        onToggleLowStock={toggleLowStockOnly}
        getProductInfo={getProductInfo}
        getStockStatus={getStockStatus}
        onAdjustStock={handleAdjustStock}
      />

      {/* Diálogo de ajuste de stock */}
      <InventoryAdjustmentDialog
        open={adjustmentDialogOpen}
        variant={selectedVariant}
        productInfo={selectedVariant ? getProductInfo(selectedVariant.product) : undefined}
        onClose={() => {
          setAdjustmentDialogOpen(false)
          setSelectedVariant(null)
        }}
        onSave={handleSaveAdjustment}
        loading={isAdjustingStock}
      />
    </PageShell>
  )
}

export default InventoryPage
