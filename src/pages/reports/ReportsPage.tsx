import React from 'react'
import {
  Box,
  Paper,
  Tabs,
  Tab,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import InventoryHistoryTab from '../../components/reports/InventoryHistoryTab'
import SnapshotTab from '../../components/reports/SnapshotTab'
import DailySummaryTab from '../../components/reports/DailySummaryTab'
import LowStockTab from '../../components/reports/LowStockTab'
import { useReportsLogic } from '../../hooks/reports/useReportsLogic'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import { Assessment as AssessmentIcon } from '@mui/icons-material'

const ReportsPage: React.FC = () => {
  const theme = useTheme()

  const {
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
    productsDetails,
    variants,
    inventoryHistory,
    snapshots,
    lowStockVariants,
    dailySummary,
    isInventoryHistoryLoading,
    isSnapshotsLoading,
    isCreatingSnapshot,
    isDailySummaryLoading,
    inventoryHistoryError,
    snapshotsError,
    lowStockError,
    dailySummaryError,
    handleTabChange,
    handleSelectVariant,
    handleSelectAll,
    handleFetchInventoryHistory,
    handleCreateSnapshot,
    handleExportExcel,
    handlePageChange,
    setStartDate,
    setEndDate,
    setProductFilter,
    setVariantFilter,
    setMovementTypeFilter,
    setDailyStartDate,
    setDailyEndDate,
    refetchDailySummary,
  } = useReportsLogic()

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Reportes Avanzados"
        subtitle="Consulta estadísticas detalladas de inventario, compras y productos."
        icon={<AssessmentIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      />

      {/* Tabs */}
      <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
            backgroundColor:
              theme.palette.mode === 'light'
                ? alpha(theme.palette.primary.main, 0.08)
                : alpha(theme.palette.primary.main, 0.2),
            '& .MuiTabs-flexContainer': {
              flexDirection: { xs: 'column', sm: 'row' },
            },
            '& .MuiTab-root': {
              minHeight: 48,
              fontWeight: 'medium',
            },
          }}
        >
          <Tab label="Historial de Inventario" />
          <Tab label="Snapshot Mensual" />
          <Tab label="Resumen Diario" />
          <Tab label="Stock Bajo" />
        </Tabs>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {activeTab === 0 && (
            <InventoryHistoryTab
              startDate={startDate}
              endDate={endDate}
              productFilter={productFilter}
              variantFilter={variantFilter}
              movementTypeFilter={movementTypeFilter}
              inventoryHistoryParams={inventoryHistoryParams}
              productsDetails={productsDetails}
              variants={variants}
              inventoryHistory={inventoryHistory}
              isInventoryHistoryLoading={isInventoryHistoryLoading}
              inventoryHistoryError={inventoryHistoryError ? { message: inventoryHistoryError.message } : undefined}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onProductFilterChange={setProductFilter}
              onVariantFilterChange={setVariantFilter}
              onMovementTypeFilterChange={setMovementTypeFilter}
              onFetchInventoryHistory={handleFetchInventoryHistory}
              onPageChange={handlePageChange}
            />
          )}
          {activeTab === 1 && (
            <SnapshotTab
              snapshots={snapshots}
              isSnapshotsLoading={isSnapshotsLoading}
              snapshotsError={snapshotsError ? { message: snapshotsError.message } : undefined}
              isCreatingSnapshot={isCreatingSnapshot}
              onCreateSnapshot={handleCreateSnapshot}
              onExportExcel={handleExportExcel}
            />
          )}
          {activeTab === 2 && (
            <DailySummaryTab
              dailyStartDate={dailyStartDate}
              dailyEndDate={dailyEndDate}
              dailySummary={dailySummary}
              isDailySummaryLoading={isDailySummaryLoading}
              dailySummaryError={dailySummaryError ? { message: dailySummaryError.message } : undefined}
              onDailyStartDateChange={setDailyStartDate}
              onDailyEndDateChange={setDailyEndDate}
              onRefetchDailySummary={refetchDailySummary}
            />
          )}
          {activeTab === 3 && (
            <LowStockTab
              selectedVariants={selectedVariants}
              lowStockVariants={lowStockVariants}
              lowStockError={lowStockError ? { message: lowStockError.message } : undefined}
              onSelectVariant={handleSelectVariant}
              onSelectAll={handleSelectAll}
            />
          )}
        </Box>
      </Paper>
    </PageShell>
  )
}

export default ReportsPage
