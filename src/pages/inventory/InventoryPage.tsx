import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useInventoryData } from '../../hooks/inventory/useInventoryData'
import { useNotification } from '../../hooks/useNotification'
import InventoryHeader from '../../components/inventory/InventoryHeader'
import InventoryCard from '../../components/inventory/InventoryCard'
import InventoryTable from '../../components/inventory/InventoryTable'
import InventoryAdjustmentDialog from '../../components/inventory/InventoryAdjustmentDialog'
import PageShell from '../../components/common/PageShell'

const InventoryPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const location = useLocation()
  const hasProcessedPrefill = useRef(false)

  const { showSuccess, showError } = useNotification()

  const {
    filteredVariants,
    isLoading,
    searchTerm,
    lowStockOnly,
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
      // Buscar la variante pre-llenada en los datos cargados
      const variant = filteredVariants.find((v: any) => v.id === state.prefillVariant)
      if (variant) {
        // Limpiar el state inmediatamente para evitar re-aperturas
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <PageShell>
      <InventoryHeader
        searchTerm={searchTerm}
        lowStockOnly={lowStockOnly}
        onSearchChange={handleSearchChange}
        onToggleLowStock={toggleLowStockOnly}
      />

      {/* Vista Desktop - Tabla */}
      {!isMobile && (
        <Box 
          sx={{ 
            borderRadius: 2, 
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.text.primary, 0.02) }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Inventario ({filteredVariants.length} variantes)
            </Typography>
          </Box>

          {filteredVariants.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {lowStockOnly ? 'No hay productos con stock bajo' : 'No se encontraron variantes'}
              </Typography>
            </Box>
          ) : (
            <InventoryTable
              variants={filteredVariants}
              getProductInfo={getProductInfo}
              getStockStatus={getStockStatus}
              onAdjustStock={handleAdjustStock}
            />
          )}
        </Box>
      )}

      {/* Vista Mobile - Cards */}
      {isMobile && (
        <Box>
          <Box sx={{ mb: 2, px: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Inventario ({filteredVariants.length} variantes)
            </Typography>
          </Box>

          {filteredVariants.length === 0 ? (
            <Box 
              sx={{ 
                p: 8, 
                textAlign: 'center', 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {lowStockOnly ? 'No hay productos con stock bajo' : 'No se encontraron variantes'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {filteredVariants.map((variant) => (
                <InventoryCard
                  key={variant.id}
                  variant={variant}
                  getProductInfo={getProductInfo}
                  getStockStatus={getStockStatus}
                  onAdjustStock={handleAdjustStock}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Diálogo de ajuste de stock */}
      <InventoryAdjustmentDialog
        open={adjustmentDialogOpen}
        variant={selectedVariant}
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
