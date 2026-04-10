import React from 'react'
import {
  Box,
  Tabs,
  Tab,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import InventoryHistoryTab from '../../components/reports/InventoryHistoryTab'
import SnapshotTab from '../../components/reports/SnapshotTab'
import DailySummaryTab from '../../components/reports/DailySummaryTab'
import LowStockTab from '../../components/reports/LowStockTab'
import FinanceTab from '../../components/reports/FinanceTab'
import { useReportsLogic } from '../../hooks/reports/useReportsLogic'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import { Assessment as AssessmentIcon } from '@mui/icons-material'

const ReportsPage: React.FC = () => {
  const theme = useTheme()

  const {
    activeTab,
    selectedVariants,
    snapshotMonth,
    setSnapshotMonth,
    monthlyReport,
    isMonthlyReportLoading,
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
    productsDetails,
    variants,
    inventoryHistory,
    lowStockVariants,
    dailySummary,
    financialReport,
    isInventoryHistoryLoading,
    isDailySummaryLoading,
    isFinancialReportLoading,
    inventoryHistoryError,
    lowStockError,
    dailySummaryError,
    financialReportError,
    handleTabChange,
    handleSelectVariant,
    handleSelectAll,
    handleFetchInventoryHistory,
    handleExportHistory,
    handlePageChange,
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
  } = useReportsLogic()

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Reportes Avanzados"
        subtitle="Consulta estadísticas detalladas de inventario, compras y productos."
        icon={<AssessmentIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      />

      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'light' ? '0 1px 3px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        mt: 2,
      }}>
        {/* Tabs Header */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, px: 0.5, bgcolor: 'background.paper' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 44,
              '& .MuiTabs-indicator': {
                backgroundColor: 'text.primary',
                height: 2,
              },
              '& .MuiTab-root': {
                minHeight: 44,
                textTransform: 'none',
                fontSize: '12px',
                fontWeight: 500,
                color: 'text.disabled',
                px: 2,
                minWidth: 'auto',
                transition: 'all 0.1s ease',
                '&.Mui-selected': {
                  color: 'text.primary',
                },
                '&:hover': {
                  color: 'text.secondary',
                }
              },
            }}
          >
            <Tab label="Historial de Inventario" />
            <Tab label="Snapshot Mensual" />
            <Tab label="Resumen Diario" />
            <Tab label="Stock Bajo" />
            <Tab label="Finanzas" />
          </Tabs>
        </Box>

        <Box sx={{ p: 0 }}>
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
              onExportHistory={handleExportHistory}
            />
          )}
          {activeTab === 1 && (
            <SnapshotTab
              monthlyReport={monthlyReport}
              isMonthlyReportLoading={isMonthlyReportLoading}
              snapshotMonth={snapshotMonth}
              onSnapshotMonthChange={setSnapshotMonth}
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
          {activeTab === 4 && (
            <FinanceTab
              startDate={financeStartDate}
              endDate={financeEndDate}
              onStartDateChange={setFinanceStartDate}
              onEndDateChange={setFinanceEndDate}
              onRefetch={refetchFinancialReport}
              reportData={financialReport}
              isLoading={isFinancialReportLoading}
              error={financialReportError}
            />
          )}
        </Box>
      </Box>
    </PageShell>
  )
}

export default ReportsPage
