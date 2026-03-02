import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNotification } from '../useNotification'
import { useReports } from './useReports'
import { productService } from '../../services/productService'
import type { InventoryHistoryParams, DailySummaryParams } from '../../types/reports'
import * as XLSX from 'xlsx'

export const useReportsLogic = () => {
  const { showSuccess, showError } = useNotification()
  const [activeTab, setActiveTab] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(new Set())
  
  // Inventory History filters
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [variantFilter, setVariantFilter] = useState('')
  const [movementTypeFilter, setMovementTypeFilter] = useState('')
  const [inventoryHistoryParams, setInventoryHistoryParams] = useState<InventoryHistoryParams>({ page: 1 })

  // Daily Summary filters
  const [dailyStartDate, setDailyStartDate] = useState('')
  const [dailyEndDate, setDailyEndDate] = useState('')

  const {
    variants,
    inventoryHistory,
    isInventoryHistoryLoading,
    inventoryHistoryError,
    fetchInventoryHistory,
    snapshots,
    isSnapshotsLoading,
    snapshotsError,
    createMonthlySnapshot,
    isCreatingSnapshot,
    lowStockVariants,
    lowStockError,
    fetchLowStockVariants,
  } = useReports({ showSuccess, showError })

  // Products for filter
  const { data: productsDetailsData } = useQuery({
    queryKey: ['products-simple'],
    queryFn: () => productService.getProducts({}),
  })

  const productsDetails = productsDetailsData?.results || []

  // Daily Summary
  const { data: dailySummary, isLoading: isDailySummaryLoading, error: dailySummaryError, refetch: refetchDailySummary } = useQuery({
    queryKey: ['daily-summary', dailyStartDate, dailyEndDate],
    queryFn: () => productService.dailyInventorySummary({ start: dailyStartDate, end: dailyEndDate } as DailySummaryParams),
    enabled: true
  })

  // Effects
  useEffect(() => {
    if (activeTab === 0) {
      fetchInventoryHistory(inventoryHistoryParams)
    }
  }, [activeTab, inventoryHistoryParams, fetchInventoryHistory])

  useEffect(() => {
    if (activeTab === 3 && !lowStockVariants) {
      fetchLowStockVariants()
    }
  }, [activeTab, lowStockVariants, fetchLowStockVariants])

  // Auto-fetch inventory history when filters change
  useEffect(() => {
    handleFetchInventoryHistory()
  }, [startDate, endDate, productFilter, variantFilter, movementTypeFilter])

  // Read active tab from URL params on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && !isNaN(Number(tabParam))) {
      const tabIndex = parseInt(tabParam, 10)
      if (tabIndex >= 0 && tabIndex <= 3) {
        setActiveTab(tabIndex)
      }
    }
  }, [])

  // Event handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setSelectedVariants(new Set()) // Reset selection on tab change
    // Update URL with tab parameter
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newValue.toString())
    window.history.replaceState({}, '', url.toString())
  }

  const handleSelectVariant = (id: number) => {
    if (id === -1) {
      setSelectedVariants(new Set())
      return
    }
    
    setSelectedVariants(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    setSelectedVariants(prev => {
      if (prev.size === lowStockVariants?.products?.length) {
        return new Set()
      } else {
        return new Set(lowStockVariants.products.map((p: any) => p.id))
      }
    })
  }

  const handleFetchInventoryHistory = () => {
    const params: InventoryHistoryParams = {
      start_date: startDate,
      end_date: endDate,
      product: productFilter,
      variant: variantFilter,
      movement_type: movementTypeFilter,
      page: 1
    }
    setInventoryHistoryParams(params)
    fetchInventoryHistory(params)
  }

  const handleCreateSnapshot = () => {
    // Get current month in YYYY-MM-DD format (first day of month)
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    
    createMonthlySnapshot({ month: currentMonth })
  }

  const handleExportExcel = () => {
    const data = snapshots?.results || []
    if (data.length === 0) {
      showError('No hay snapshots para exportar')
      return
    }

    const exportData = data.map((snapshot: any) => ({
      Mes: new Date(snapshot.month).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
      Producto: snapshot.product,
      Variante: `${snapshot.variant_color} - ${snapshot.variant_size}`,
      'Stock Inicial': snapshot.stock_opening,
      Entradas: snapshot.total_in,
      Salidas: snapshot.total_out,
      'Stock Final': snapshot.stock_closing,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Snapshots')

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const filename = `Snapshot-${year}-${month}.xlsx`

    XLSX.writeFile(wb, filename)
  }

  const handlePageChange = (page: number) => {
    setInventoryHistoryParams(prev => ({ ...prev, page }))
  }

  return {
    // State
    activeTab,
    selectedVariants,
    startDate,
    endDate,
    productFilter,
    variantFilter,
    movementTypeFilter,
    inventoryHistoryParams,
    dailyStartDate,
    dailyEndDate,
    
    // Data
    productsDetails,
    variants,
    inventoryHistory,
    snapshots,
    lowStockVariants,
    dailySummary,
    
    // Loading states
    isInventoryHistoryLoading,
    isSnapshotsLoading,
    isCreatingSnapshot,
    isDailySummaryLoading,
    
    // Error states
    inventoryHistoryError,
    snapshotsError,
    lowStockError,
    dailySummaryError,
    
    // Event handlers
    handleTabChange,
    handleSelectVariant,
    handleSelectAll,
    handleFetchInventoryHistory,
    handleCreateSnapshot,
    handleExportExcel,
    handlePageChange,
    
    // Setters
    setStartDate,
    setEndDate,
    setProductFilter,
    setVariantFilter,
    setMovementTypeFilter,
    setDailyStartDate,
    setDailyEndDate,
    refetchDailySummary,
  }
}
