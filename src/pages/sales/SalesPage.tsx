import React, { useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme, useMediaQuery } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle as ConfirmIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { alpha, Button } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../hooks/useNotification'
import { dashboardService } from '../../services/dashboardService'
import { useSalesData } from '../../hooks/sales/useSalesData'
import { useSalesActions } from '../../hooks/sales/useSalesActions'
import { useSalesFilters } from '../../hooks/sales/useSalesFilters'
import SalesHeader from '../../components/sales/SalesHeader'
import SalesTabs from '../../components/sales/SalesTabs'
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
  const navigate = useNavigate()
  const hasProcessedPrefill = useRef(false)
  const hasOpenedCreate = useRef(false)

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
    salesSort,
    setSalesSort,
    selectedSales,
    setSelectedSales,
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
    handleBulkConfirm,
    handleBulkCancel,
  } = useSalesActions({
    showSuccess,
    showError,
  })

  const {
    filterOptions,
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

  // Check for navigation state or query param to open create modal
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const isCreateParam = params.get('create') === 'true'
    
    if ((location.state?.openCreateModal || isCreateParam) && !createSaleDialogOpen && !hasOpenedCreate.current) {
      handleCreateSale()
      hasOpenedCreate.current = true
      
      // Clean up the URL parameter or state
      if (isCreateParam) {
        const newParams = new URLSearchParams(location.search)
        newParams.delete('create')
        const newSearch = newParams.toString()
        navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true })
      }
    }
  }, [location.state, location.search, createSaleDialogOpen, handleCreateSale, location.pathname, navigate])

  const handleFilterChange = (status: string) => {
    setFilterStatus(status)
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
        onCreateSale={handleCreateSale}
        isMobile={isMobile}
      />

      <SalesTabs
        sales={sales}
        loading={isLoading}
        page={page}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onEdit={handleEditSale}
        onConfirm={handleConfirmSale}
        onCancel={handleCancelSale}
        onViewDetails={handleViewDetails}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={handleFilterChange}
        filterOptions={filterOptions}
        salesSort={salesSort}
        setSalesSort={setSalesSort}
        selectedSales={selectedSales}
        setSelectedSales={setSelectedSales}
      />


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

      {/* FLOATING BULK ACTION BAR */}
      {selectedSales.length > 0 && (
        <Box sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'text.primary',
          color: 'background.paper',
          px: 2,
          py: 1.2,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out',
          '@keyframes slideUp': {
            from: { transform: 'translateX(-50%) translateY(100%)', opacity: 0 },
            to: { transform: 'translateX(-50%) translateY(0)', opacity: 1 }
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 2, borderRight: '1px solid rgba(255,255,255,0.2)' }}>
            <Box sx={{ 
              width: 20, height: 20, borderRadius: '50%', 
              bgcolor: 'background.paper', color: 'text.primary',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700
            }}>
              {selectedSales.length}
            </Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
              {selectedSales.length === 1 ? 'Seleccionada' : 'Seleccionadas'}
            </Typography>
          </Box>

          <Button
            size="small"
            startIcon={<ConfirmIcon sx={{ fontSize: 16 }} />}
            onClick={() => handleBulkConfirm(selectedSales)}
            sx={{ 
              color: 'inherit', textTransform: 'none', fontSize: '12px',
              '&:hover': { bgcolor: alpha('#fff', 0.1) }
            }}
          >
            Confirmar
          </Button>

          <Button
            size="small"
            startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
            onClick={() => handleBulkCancel(selectedSales)}
            sx={{ 
              color: '#ff4d4d', textTransform: 'none', fontSize: '12px',
              '&:hover': { bgcolor: alpha('#ff4d4d', 0.1) }
            }}
          >
            Cancelar
          </Button>

          <Box
            onClick={() => setSelectedSales([])}
            sx={{ 
              ml: 1, p: 0.5, borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              '&:hover': { bgcolor: alpha('#fff', 0.1) }
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      )}

    </PageShell>
  )
}

export default SalesPage
