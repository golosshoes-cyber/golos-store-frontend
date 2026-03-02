import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTheme } from '@mui/material/styles'
import { dashboardService } from '../../services/dashboardService'
import { Sale } from '../../types'
import { showAcrylicConfirm } from '../../utils/showAcrylicConfirm'
import { extractApiErrorMessage } from '../../utils/apiError'

interface UseSalesActionsProps {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

export const useSalesActions = ({ showSuccess, showError }: UseSalesActionsProps) => {
  const queryClient = useQueryClient()
  const theme = useTheme()
  
  // Estados para diálogos
  const [createSaleDialogOpen, setCreateSaleDialogOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Mutación para crear venta
  const createSaleMutation = useMutation({
    mutationFn: dashboardService.createSale,
    onSuccess: () => {
      setCreateSaleDialogOpen(false)
      setEditingSale(null)
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (err: any) => {
      console.error('Error creating sale:', err)
    },
  })

  // Mutación para confirmar venta
  const confirmSaleMutation = useMutation({
    mutationFn: dashboardService.confirmSale,
    onSuccess: () => {
      showSuccess('Venta confirmada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: any) => {
      const errorMessage = extractApiErrorMessage(error, 'Error al confirmar la venta')
      showError(errorMessage)
    },
  })

  // Mutación para cancelar venta
  const cancelSaleMutation = useMutation({
    mutationFn: dashboardService.cancelSale,
    onSuccess: () => {
      showSuccess('Venta cancelada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: any) => {
      const errorMessage = extractApiErrorMessage(error, 'Error al cancelar la venta')
      showError(errorMessage)
    },
  })

  // Handlers
  const handleCreateSale = () => {
    setEditingSale(null)
    setCreateSaleDialogOpen(true)
  }

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale)
    setCreateSaleDialogOpen(true)
  }

  const handleConfirmSale = async (saleId: number) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Confirmar Venta',
      text: '¿Estás seguro de que quieres confirmar esta venta? Esta acción afectará el inventario.',
      icon: 'warning',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
    })

    if (confirmed) {
      try {
        await confirmSaleMutation.mutateAsync(saleId)
      } catch (_error: any) {
        // onError mutation already handles user feedback
      }
    }
  }

  const handleCancelSale = async (saleId: number) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Cancelar Venta',
      text: '¿Estás seguro de que quieres cancelar esta venta? Esta acción no se puede deshacer.',
      icon: 'error',
      confirmText: 'Cancelar Venta',
      cancelText: 'Cerrar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
    })

    if (confirmed) {
      try {
        await cancelSaleMutation.mutateAsync(saleId)
      } catch (_error: any) {
        // onError mutation already handles user feedback
      }
    }
  }

  const handleViewDetails = (sale: Sale) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setSelectedSale(sale)
    setDetailsDialogOpen(true)
  }

  const handleCloseDetails = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDetailsDialogOpen(false)
    setSelectedSale(null)
  }

  const handleCloseCreateDialog = () => {
    setCreateSaleDialogOpen(false)
    setEditingSale(null)
  }

  return {
    // Estados de diálogos
    createSaleDialogOpen,
    editingSale,
    selectedSale,
    detailsDialogOpen,
    
    // Setters de diálogos
    setCreateSaleDialogOpen,
    setEditingSale,
    setSelectedSale,
    setDetailsDialogOpen,
    
    // Handlers
    handleCreateSale,
    handleEditSale,
    handleConfirmSale,
    handleCancelSale,
    handleViewDetails,
    handleCloseDetails,
    handleCloseCreateDialog,
    
    // Mutations
    createSaleMutation,
    confirmSaleMutation,
    cancelSaleMutation,
    
    // Loading states
    isCreating: createSaleMutation.isPending,
    isConfirming: confirmSaleMutation.isPending,
    isCanceling: cancelSaleMutation.isPending,
  }
}
