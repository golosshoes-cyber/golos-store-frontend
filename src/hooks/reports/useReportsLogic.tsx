import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from '../useDebounce'
import { useQuery } from '@tanstack/react-query'
import { useNotification } from '../useNotification'
import { useReports } from './useReports'
import { productService } from '../../services/productService'
import type { InventoryHistoryParams, DailySummaryParams } from '../../types/reports'
import { api } from '../../services/api'

export const useReportsLogic = () => {
  const { showSuccess, showError } = useNotification()
  const [activeTab, setActiveTab] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(new Set())
  
  // Snapshot filters/pagination
  const [snapshotsParams, setSnapshotsParams] = useState<{ page: number }>({ page: 1 })

  // Reporte mensual: mes seleccionado, por defecto el mes anterior
  const [snapshotMonth, setSnapshotMonth] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [monthlyReport, setMonthlyReport] = useState<any[]>([])
  const [isMonthlyReportLoading, setIsMonthlyReportLoading] = useState(false)
  
  // Inventory History filters
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [variantFilter, setVariantFilter] = useState('')
  const [movementTypeFilter, setMovementTypeFilter] = useState('')
  const [inventoryHistoryParams, setInventoryHistoryParams] = useState<InventoryHistoryParams>({ page: 1 })

  // Valores debounced para campos de texto libre (evita request por cada tecla)
  const debouncedVariantFilter = useDebounce(variantFilter, 400)
  const debouncedStartDate = useDebounce(startDate, 400)
  const debouncedEndDate = useDebounce(endDate, 400)
  // Ref para saber si es la primera carga (no disparar fetch en mount)
  const isFirstRender = useRef(true)

  // Daily Summary filters
  const [dailyStartDate, setDailyStartDate] = useState('')
  const [dailyEndDate, setDailyEndDate] = useState('')

  // Financial Report filters
  const [financeStartDate, setFinanceStartDate] = useState(() => {
    const d = new Date()
    d.setDate(1) // First day of current month
    return d.toISOString().split('T')[0]
  })
  const [financeEndDate, setFinanceEndDate] = useState(new Date().toISOString().split('T')[0])

  const {
    variants,
    inventoryHistory,
    isInventoryHistoryLoading,
    inventoryHistoryError,
    fetchInventoryHistory,
    snapshots,
    isSnapshotsLoading,
    snapshotsError,
    fetchSnapshots,
    createMonthlySnapshot,
    isCreatingSnapshot,
    lowStockVariants,
    isLowStockLoading,
    lowStockError,
    fetchLowStockVariants,
  } = useReports({ showSuccess, showError })

  // Products for filter — cachear 5 min, no cambian frecuentemente
  const { data: productsDetailsData } = useQuery({
    queryKey: ['products-simple'],
    queryFn: () => productService.getProducts({}),
    staleTime: 5 * 60_000,
  })

  const productsDetails = productsDetailsData?.results || []

  // Daily Summary — solo ejecuta cuando el tab 2 está activo
  const { data: dailySummary, isLoading: isDailySummaryLoading, error: dailySummaryError, refetch: refetchDailySummary } = useQuery({
    queryKey: ['daily-summary', dailyStartDate, dailyEndDate],
    queryFn: () => productService.dailyInventorySummary({ start: dailyStartDate, end: dailyEndDate } as DailySummaryParams),
    enabled: activeTab === 2,
    staleTime: 30_000,
  })

  // Financial Report — solo ejecuta cuando el tab 4 está activo
  const { data: financialReport, isLoading: isFinancialReportLoading, error: financialReportError, refetch: refetchFinancialReport } = useQuery({
    queryKey: ['financial-report', financeStartDate, financeEndDate],
    queryFn: () => productService.financialReport({ start_date: financeStartDate, end_date: financeEndDate }),
    enabled: activeTab === 4,
    staleTime: 30_000,
  })

  // Effects
  useEffect(() => {
    if (activeTab === 0) {
      fetchInventoryHistory(inventoryHistoryParams)
    }
  }, [activeTab, inventoryHistoryParams, fetchInventoryHistory])

  useEffect(() => {
    if (activeTab === 1) {
      fetchSnapshots(snapshotsParams.page)
    }
  }, [activeTab, snapshotsParams, fetchSnapshots])

  useEffect(() => {
    if (activeTab === 3 && !lowStockVariants && !isLowStockLoading && !lowStockError) {
      fetchLowStockVariants()
    }
  }, [activeTab, lowStockVariants, isLowStockLoading, lowStockError, fetchLowStockVariants])

  // Auto-fetch: debounced para texto libre, inmediato para selects
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    handleFetchInventoryHistory()
  }, [debouncedStartDate, debouncedEndDate, productFilter, debouncedVariantFilter, movementTypeFilter])

  // Read active tab from URL params on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && !isNaN(Number(tabParam))) {
      const tabIndex = parseInt(tabParam, 10)
      if (tabIndex >= 0 && tabIndex <= 4) {
        setActiveTab(tabIndex)
      }
    }
  }, [])

  // Event handlers
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setSelectedVariants(new Set()) // Reset selection on tab change
    // Update URL with tab parameter
    const url = new URL(window.location.href)
    url.searchParams.set('tab', newValue.toString())
    window.history.replaceState({}, '', url.toString())
  }, [])

  const handleSelectVariant = useCallback((id: number) => {
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
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedVariants(prev => {
      const variantsList = lowStockVariants?.products || []
      if (prev.size === variantsList.length) {
        return new Set()
      } else {
        return new Set(variantsList.map((p: any) => p.id))
      }
    })
  }, [lowStockVariants])

  const handleFetchInventoryHistory = useCallback(() => {
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
  }, [startDate, endDate, productFilter, variantFilter, movementTypeFilter, fetchInventoryHistory])

  const handleCreateSnapshot = useCallback(() => {
    // snapshotMonth tiene formato "YYYY-MM", el backend espera "YYYY-MM-DD"
    createMonthlySnapshot({ month: `${snapshotMonth}-01` })
  }, [createMonthlySnapshot, snapshotMonth])

  const handleFetchMonthlyReport = useCallback(async (month: string) => {
    if (!month) return
    setIsMonthlyReportLoading(true)
    try {
      const data = await productService.getMonthlyReport(month)
      setMonthlyReport(data)
    } catch {
      showError('Error al cargar el reporte mensual')
      setMonthlyReport([])
    } finally {
      setIsMonthlyReportLoading(false)
    }
  }, [showError])

  // Cargar reporte cuando cambia el mes o cuando se activa el tab
  useEffect(() => {
    if (activeTab === 1 && snapshotMonth) {
      handleFetchMonthlyReport(snapshotMonth)
    }
  }, [activeTab, snapshotMonth, handleFetchMonthlyReport])

  const handleExportExcel = useCallback(async () => {
    try {
      let allData: any[] = []
      let page = 1
      let hasNext = true

      while (hasNext) {
        const response = await productService.getInventorySnapshots({ page, limit: 100 })
        allData = [...allData, ...(response.results || [])]
        hasNext = !!response.next
        page++
      }

      if (allData.length === 0) {
        showError('No hay snapshots para exportar')
        return
      }

      const XLSX = await import('xlsx')
      const exportData = allData.map((snapshot: any) => ({
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
      XLSX.writeFile(wb, `Snapshot-Completo-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.xlsx`)
    } catch (error) {
      showError('Error al exportar los datos')
      console.error(error)
    }
  }, [showError])

  const handleExportHistory = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      if (productFilter) params.append('product', productFilter)
      if (variantFilter) params.append('variant', variantFilter)
      if (movementTypeFilter) params.append('movement_type', movementTypeFilter)

      const response = await api.get(`/api/inventory-history/export/?${params.toString()}`)
      const allData: any[] = response.data.results || []

      if (allData.length === 0) {
        showError('No hay movimientos para exportar')
        return
      }

      const rows = allData.map((item: any) => ({
        Fecha: new Date(item.created_at).toLocaleDateString('es-ES'),
        Hora: new Date(item.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        Producto: item.product,
        'Variante ID': item.variant,
        Movimiento: item.movement_type_display,
        Cantidad: item.quantity,
        'Stock Después': item.stock_after,
        Observación: item.observation || '',
      }))

      const XLSX = await import('xlsx')
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Historial')
      const now = new Date()
      XLSX.writeFile(wb, `Historial-Inventario-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.xlsx`)
    } catch {
      showError('Error al exportar el historial')
    }
  }, [startDate, endDate, productFilter, variantFilter, movementTypeFilter, showError])

  const handlePageChange = useCallback((page: number) => {
    setInventoryHistoryParams(prev => {
      const newParams = { ...prev, page }
      fetchInventoryHistory(newParams)
      return newParams
    })
  }, [fetchInventoryHistory])

  const handleSnapshotPageChange = useCallback((page: number) => {
    setSnapshotsParams(prev => {
      const newParams = { ...prev, page }
      fetchSnapshots(newParams.page)
      return newParams
    })
  }, [fetchSnapshots])

  return {
    // State
    activeTab,
    selectedVariants,
    snapshotMonth,
    startDate,
    endDate,
    productFilter,
    variantFilter,
    movementTypeFilter,
    inventoryHistoryParams,
    dailyStartDate,
    dailyEndDate,
    financeStartDate,
    financeEndDate,
    
    // Data
    productsDetails,
    variants,
    inventoryHistory,
    snapshots,
    snapshotsParams,
    monthlyReport,
    lowStockVariants,
    dailySummary,
    financialReport,

    // Loading states
    isInventoryHistoryLoading,
    isSnapshotsLoading,
    isCreatingSnapshot,
    isMonthlyReportLoading,
    isDailySummaryLoading,
    isFinancialReportLoading,
    
    // Error states
    inventoryHistoryError,
    snapshotsError,
    lowStockError,
    dailySummaryError,
    financialReportError,
    
    // Event handlers
    handleTabChange,
    handleSelectVariant,
    handleSelectAll,
    handleFetchInventoryHistory,
    handleCreateSnapshot,
    handleFetchMonthlyReport,
    handleExportExcel,
    handleExportHistory,
    handlePageChange,
    handleSnapshotPageChange,
    
    // Setters
    setSnapshotMonth,
    setStartDate,
    setEndDate,
    setProductFilter,
    setVariantFilter,
    setMovementTypeFilter,
    setDailyStartDate,
    setDailyEndDate,
    setFinanceStartDate,
    setFinanceEndDate,
    refetchDailySummary,
    refetchFinancialReport,
  }
}
