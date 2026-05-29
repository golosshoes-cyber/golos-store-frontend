import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '../useDebounce'
import { useNotification } from '../useNotification'
import { productService } from '../../services/productService'
import { api } from '../../services/api'
import type { ProductVariant } from '../../types'
import type { InventoryHistoryParams, DailySummaryParams } from '../../types/reports'
import { extractApiErrorMessage } from '../../utils/apiError'

export const useReportsLogic = () => {
  const { showSuccess, showError } = useNotification()
  const queryClient = useQueryClient()
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
    d.setDate(1)
    return d.toISOString().split('T')[0]
  })
  const [financeEndDate, setFinanceEndDate] = useState(new Date().toISOString().split('T')[0])

  // Variants for mapping (cache 5 min)
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
    staleTime: 1000 * 60 * 5,
  })

  // Inventory History Query
  const inventoryHistoryQuery = useQuery({
    queryKey: ['inventory-history', inventoryHistoryParams],
    queryFn: () => productService.inventoryHistory(inventoryHistoryParams),
    enabled: true,
  })

  // Inventory Snapshots Query
  const snapshotsQuery = useQuery({
    queryKey: ['inventory-snapshots', snapshotsParams],
    queryFn: () => api.get('/api/inventory-snapshots/', { params: snapshotsParams }).then(r => r.data),
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

  const fetchInventoryHistory = useCallback((params: InventoryHistoryParams) => {
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

  // Products for filter — cachear 5 min
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
    if (activeTab === 3 && !lowStockQuery.data && !lowStockQuery.isLoading && !lowStockQuery.error) {
      fetchLowStockVariants()
    }
  }, [activeTab, lowStockQuery.data, lowStockQuery.isLoading, lowStockQuery.error, fetchLowStockVariants])

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
    setSelectedVariants(new Set())
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
      const variantsList = lowStockQuery.data?.products || []
      if (prev.size === variantsList.length) {
        return new Set()
      } else {
        return new Set(variantsList.map((p: any) => p.id))
      }
    })
  }, [lowStockQuery.data])

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
    variants: variantsQuery.data,
    inventoryHistory: inventoryHistoryQuery.data,
    snapshots: snapshotsQuery.data,
    snapshotsParams,
    monthlyReport,
    lowStockVariants: lowStockQuery.data,
    dailySummary,
    financialReport,

    // Loading states
    isInventoryHistoryLoading: inventoryHistoryQuery.isLoading,
    isSnapshotsLoading: snapshotsQuery.isLoading,
    isCreatingSnapshot: createSnapshotMutation.isPending,
    isMonthlyReportLoading,
    isDailySummaryLoading,
    isFinancialReportLoading,

    // Error states
    inventoryHistoryError: inventoryHistoryQuery.error,
    snapshotsError: snapshotsQuery.error,
    lowStockError: lowStockQuery.error,
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
