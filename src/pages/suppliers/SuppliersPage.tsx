import React, { useState } from 'react'
import {
  useTheme,
  useMediaQuery,
  Box,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Business as BusinessIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supplierService } from '../../services/supplierService'
import { Supplier } from '../../types'
import SuppliersTabs from '../../components/suppliers/SuppliersTabs'
import SupplierDialog from '../../components/suppliers/SupplierDialog'
import { useLocation } from 'react-router-dom'
import GradientButton from '../../components/common/GradientButton'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import { showAcrylicConfirm } from '../../utils/showAcrylicConfirm'
import { extractApiErrorMessage } from '../../utils/apiError'
import ExportButton from '../../components/common/ExportButton'
import { exportService } from '../../services/exportService'

// Componente principal de proveedores
const SuppliersPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const [page, setPage] = useState(1)

  
  // Manejar cambio de página de proveedores con scroll hacia arriba
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Hacer scroll hacia arriba suavemente
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [error, setError] = useState<string>('')
  const [supplierSearch, setSupplierSearch] = useState('')
  const [supplierInputValue, setSupplierInputValue] = useState('')

  // Debounced search for suppliers
  React.useEffect(() => {
    const timeout = setTimeout(() => setSupplierSearch(supplierInputValue), 300)
    return () => clearTimeout(timeout)
  }, [supplierInputValue])

  // Obtiene el cliente de la query
  const queryClient = useQueryClient()

  // Fetch proveedores
  const { data: suppliersData, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getSuppliers({}),
  })

  // Local filtering and pagination
  const allSuppliers = suppliersData?.results || []
  const filteredSuppliers = allSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.nit?.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.phone?.includes(supplierSearch)
  )
  const totalFiltered = filteredSuppliers.length
  const startIndex = (page - 1) * 20
  const endIndex = startIndex + 20
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex)

  // Reset page when search changes
  React.useEffect(() => {
    setPage(1)
  }, [supplierSearch])

  // Crear Proveedor
  const createSupplierMutation = useMutation({
    mutationFn: supplierService.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      setDialogOpen(false)
      setError('')
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al crear proveedor'))
    },
  })

  // Actualiza Proveedor
  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, supplier }: { id: number; supplier: Partial<Supplier> }) =>
      supplierService.updateSupplier(id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      setDialogOpen(false)
      setEditingSupplier(null)
      setError('')
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al actualizar proveedor'))
    },
  })

  // Eliminar Proveedor
  const deleteSupplierMutation = useMutation({
    mutationFn: supplierService.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al eliminar proveedor'))
    },
  })

  // Check for navigation state to open create modal
  React.useEffect(() => {
    if (location.state?.openCreateModal) {
      setDialogOpen(true)
    }
  }, [location.state])

  // Crear Proveedor
  const handleCreateSupplier = () => {
    if (dialogOpen) {
      setDialogOpen(false)
      setTimeout(() => setDialogOpen(true), 100)
    } else {
      setDialogOpen(true)
    }
    setEditingSupplier(null)
  }

  // Editar Proveedor
  const handleEditSupplier = async (supplier: Supplier) => {
    try {
      const fullSupplier = await supplierService.getSupplier(supplier.id)
      setEditingSupplier(fullSupplier)
      setDialogOpen(true)
    } catch (error) {
      setError('Error al cargar datos del proveedor')
    }
  }

  // Eliminar Proveedor
  const handleDeleteSupplier = async (supplierId: number) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Eliminar Proveedor',
      text: '¿Estás seguro de que quieres eliminar este proveedor?',
      icon: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (confirmed) {
      deleteSupplierMutation.mutate(supplierId)
    }
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Proveedores"
        subtitle="Gestiona tu catálogo de proveedores y sus detalles"
        icon={<BusinessIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
        actions={
          <Box sx={{ display: 'flex', gap: 1, width: isMobile ? '100%' : 'auto' }}>
            <ExportButton 
              onExport={(format) => exportService.exportSuppliersReport(format)} 
              fullWidth={isMobile}
            />
            <GradientButton
              startIcon={<AddIcon />}
              onClick={handleCreateSupplier}
              size="small"
              fullWidth={isMobile}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Crear Proveedor
            </GradientButton>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <SuppliersTabs
        suppliers={paginatedSuppliers}
        loading={isLoading}
        page={page}
        totalCount={totalFiltered}
        onPageChange={handlePageChange}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        searchTerm={supplierInputValue}
        onSearchChange={setSupplierInputValue}
      />

      {/* Diálogo de crear/editar proveedor */}
      <SupplierDialog
        key={editingSupplier?.id || 'create'}
        open={dialogOpen}
        supplier={editingSupplier}
        onClose={() => {
          setDialogOpen(false)
          setEditingSupplier(null)
        }}
        onSubmit={(supplierData) => {
          if (editingSupplier) {
            updateSupplierMutation.mutate({ id: editingSupplier.id, supplier: supplierData })
          } else {
            createSupplierMutation.mutate(supplierData)
          }
        }}
        loading={createSupplierMutation.isPending || updateSupplierMutation.isPending}
      />

    </PageShell>
  )
}

export default SuppliersPage
