import React, { useEffect, useRef } from 'react'
import {
  Box,
  Pagination,
  Paper,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../hooks/useNotification'
import { dashboardService } from '../../services/dashboardService'
import { useSalesData } from '../../hooks/sales/useSalesData'
import { useSalesActions } from '../../hooks/sales/useSalesActions'
import { useSalesFilters } from '../../hooks/sales/useSalesFilters'
import SalesHeader from '../../components/sales/SalesHeader'
import SalesFilters from '../../components/sales/SalesFilters'
import SalesCard from '../../components/sales/SalesCard'
import SalesTable from '../../components/sales/SalesTable'
import SaleCreateEditDialog from '../../components/sales/SaleCreateEditDialog'
import SaleDetailsDialog from '../../components/sales/SaleDetailsDialog'
import PageShell from '../../components/common/PageShell'

const SalesPage: React.FC = () => {
  const { user } = useAuth()
  const { showSuccess, showError } = useNotification()
  const queryClient = useQueryClient()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const hasProcessedPrefill = useRef(false)

  // Custom hooks
  const {
    sales,
    totalCount,
    isLoading,
    error,
    searchTerm,
    filterStatus,
    setSearchTerm,
    setFilterStatus,
    handlePageChange,
    page,
  } = useSalesData()

  const {
    createSaleDialogOpen,
    editingSale,
    selectedSale,
    detailsDialogOpen,
    handleCreateSale,
    handleEditSale,
    handleConfirmSale,
    handleCancelSale,
    handleViewDetails,
    handleCloseDetails,
    handleCloseCreateDialog,
    isCreating,
  } = useSalesActions({
    showSuccess,
    showError,
  })

  const {
    anchorEl,
    filterOptions,
    currentFilterLabel,
    isMenuOpen,
    handleFilterMenuOpen,
    handleFilterMenuClose,
  } = useSalesFilters(filterStatus)

  // Resetear el ref cuando cambie la ubicación
  useEffect(() => {
    hasProcessedPrefill.current = false
  }, [location.pathname])

  // Manejar variante pre-llenada desde navegación
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const prefillVariant = searchParams.get('prefillVariant')

    if (prefillVariant && parseInt(prefillVariant) > 0 && !createSaleDialogOpen && !hasProcessedPrefill.current) {
      hasProcessedPrefill.current = true
      // Limpiar el param de la URL
      const newSearch = new URLSearchParams(location.search)
      newSearch.delete('prefillVariant')
      const newUrl = `${location.pathname}${newSearch.toString() ? `?${newSearch.toString()}` : ''}`
      window.history.replaceState({}, document.title, newUrl)
      handleCreateSale()
    }
  }, [location.search, createSaleDialogOpen])

  // Check for navigation state to open create modal
  useEffect(() => {
    if (location.state?.openCreateModal) {
      handleCreateSale()
    }
  }, [location.state])

  const handleFilterChange = (status: string) => {
    setFilterStatus(status)
    handleFilterMenuClose()
  }

  // Handler para submit del formulario de venta
  const handleSaleFormSubmit = async (saleData: any) => {
    try {
      // 1. Crear la venta (sin detalles)
      const createdSale = await dashboardService.createSale({
        customer: saleData.customer,
        is_order: saleData.is_order,
        payment_method: saleData.payment_method,
        payment_reference: saleData.payment_reference,
        created_by: user?.username || 'system'
      })
      
      // 2. Agregar cada detalle por separado
      for (const item of saleData.items || []) {
        const detailData = {
          sale: createdSale.id,
          variant: parseInt(item.variantId),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        }
        await dashboardService.createSaleDetail(detailData)
      }
      
      // 3. Limpiar formulario y refrescar datos
      handleCloseCreateDialog()
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      showSuccess('Venta creada exitosamente')
      
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error creating sale:', error)
      } else {
        console.error('Sale creation failed')
      }
      showError('Error al crear la venta. Por favor intenta de nuevo.')
    }
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error al cargar las ventas
        </Typography>
      </Paper>
    )
  }

  return (
    <PageShell>
      <SalesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateSale={handleCreateSale}
        isMobile={isMobile}
        filterComponent={
          <SalesFilters
            currentFilter={filterStatus}
            currentFilterLabel={currentFilterLabel}
            isMenuOpen={isMenuOpen}
            anchorEl={anchorEl}
            onMenuOpen={handleFilterMenuOpen}
            onMenuClose={handleFilterMenuClose}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
          />
        }
      />

      {/* Vista Desktop - Tabla */}
      {!isMobile && (
        <SalesTable
          sales={sales}
          loading={isLoading}
          page={page}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onEdit={handleEditSale}
          onConfirm={handleConfirmSale}
          onCancel={handleCancelSale}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Vista Mobile - Cards */}
      {isMobile && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sales.map((sale) => (
            <SalesCard
              key={sale.id}
              sale={sale}
              onEdit={handleEditSale}
              onViewDetails={handleViewDetails}
              onConfirm={handleConfirmSale}
              onCancel={handleCancelSale}
            />
          ))}
        </Box>
      )}

      {/* Paginación */}
      {totalCount > 20 && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Pagination
            count={Math.ceil(totalCount / 20)}
            onChange={(_, newPage) => handlePageChange(newPage)}
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}

      {/* Diálogo de crear/editar venta */}
      <SaleCreateEditDialog
        open={createSaleDialogOpen}
        sale={editingSale}
        onClose={handleCloseCreateDialog}
        onSubmit={handleSaleFormSubmit}
        loading={isCreating}
      />

      {/* Diálogo de detalles */}
      <SaleDetailsDialog
        key={`dialog-${selectedSale?.id || 'empty'}`}
        sale={selectedSale}
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
      />

    </PageShell>
  )
}

export default SalesPage
