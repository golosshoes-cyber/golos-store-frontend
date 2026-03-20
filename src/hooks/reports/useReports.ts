import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../../services/productService'
import { api } from '../../services/api'
import type { ProductVariant } from '../../types'
import { extractApiErrorMessage } from '../../utils/apiError'

interface UseReportsProps {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

export const useReports = ({ showSuccess, showError }: UseReportsProps) => {
  const queryClient = useQueryClient()

  // Inventory History Params
  const [inventoryHistoryParams, setInventoryHistoryParams] = useState<{
    start_date?: string
    end_date?: string
    product?: string
    variant?: string
    movement_type?: string
    page?: number
  }>({})

  // Inventory Snapshots Params
  const [snapshotsParams, setSnapshotsParams] = useState<{ page?: number }>({ page: 1 })

  // Query for variants to map IDs to details
  const variantsQuery = useQuery({
    queryKey: ['variants'],
    queryFn: async () => {
      let allVariants: ProductVariant[] = []
      let url = '/api/product-variants/?limit=1000'
      while (url) {
        const response = await api.get(url)
        allVariants.push(...(response.data.results as ProductVariant[]))
        url = response.data.next
      }
      return { count: allVariants.length, results: allVariants, next: null, previous: null }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Inventory Snapshots Query
  const snapshotsQuery = useQuery({
    queryKey: ['inventory-snapshots', snapshotsParams],
    queryFn: () => api.get('/api/inventory-snapshots/', { params: snapshotsParams }).then(r => r.data),
  })

  // Inventory History Query
  const inventoryHistoryQuery = useQuery({
    queryKey: ['inventory-history', inventoryHistoryParams],
    queryFn: () => productService.inventoryHistory(inventoryHistoryParams),
    enabled: true,
  })

  // Create Monthly Snapshot Mutation
  const createSnapshotMutation = useMutation({
    mutationFn: productService.createMonthlySnapshot,
    onSuccess: () => {
      showSuccess('Snapshot mensual creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['inventory-history'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-snapshots'] })
    },
    onError: (error: any) => {
      const errorMessage = extractApiErrorMessage(error, 'Error al crear el snapshot mensual')
      showError(errorMessage)
    },
  })

  // Low Stock Variants Query
  const lowStockQuery = useQuery({
    queryKey: ['low-stock-variants'],
    queryFn: productService.lowStockVariants,
    enabled: false,
  })

  const fetchInventoryHistory = useCallback((params: typeof inventoryHistoryParams) => {
    setInventoryHistoryParams(params)
  }, [])

  const fetchSnapshots = useCallback((page: number) => {
    setSnapshotsParams({ page })
  }, [])

  const createMonthlySnapshot = useCallback((data?: { month?: string }) => {
    createSnapshotMutation.mutate(data)
  }, [createSnapshotMutation])

  const fetchLowStockVariants = useCallback(() => {
    lowStockQuery.refetch()
  }, [lowStockQuery])

  return {
    // Variants for mapping
    variants: variantsQuery.data,

    // Inventory History
    inventoryHistory: inventoryHistoryQuery.data,
    isInventoryHistoryLoading: inventoryHistoryQuery.isLoading,
    inventoryHistoryError: inventoryHistoryQuery.error,
    fetchInventoryHistory,

    // Monthly Snapshot
    snapshots: snapshotsQuery.data,
    isSnapshotsLoading: snapshotsQuery.isLoading,
    snapshotsError: snapshotsQuery.error,
    fetchSnapshots,
    createMonthlySnapshot,
    isCreatingSnapshot: createSnapshotMutation.isPending,

    // Low Stock
    lowStockVariants: lowStockQuery.data,
    isLowStockLoading: lowStockQuery.isLoading,
    lowStockError: lowStockQuery.error,
    fetchLowStockVariants,

    // Financial Report
    fetchFinancialReport: (params: { start_date?: string; end_date?: string }) => {
      return queryClient.fetchQuery({
        queryKey: ['financial-report', params],
        queryFn: () => productService.financialReport(params),
      })
    },
  }
}
