import React from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { FileDownload as FileDownloadIcon } from '@mui/icons-material'
import InventorySnapshotCard from './InventorySnapshotCard'

interface MonthlyReportItem {
  month: string
  variant_id: number
  product: string
  product_sku: string
  variant_color: string
  variant_size: string
  stock_opening: number
  total_in: number
  total_out: number
  stock_closing: number
}

interface SnapshotTabProps {
  monthlyReport: MonthlyReportItem[]
  isMonthlyReportLoading: boolean
  snapshotMonth: string
  onSnapshotMonthChange: (month: string) => void
}

const SnapshotTab: React.FC<SnapshotTabProps> = React.memo(({
  monthlyReport,
  isMonthlyReportLoading,
  snapshotMonth,
  onSnapshotMonthChange,
}) => {
  const theme = useTheme()
  const mode = theme.palette.mode
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const monthLabel = snapshotMonth
    ? new Date(`${snapshotMonth}-15`).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    : ''

  const handleExport = async () => {
    if (monthlyReport.length === 0) return
    const XLSX = await import('xlsx')
    const rows = monthlyReport.map(item => ({
      Producto: item.product,
      SKU: item.product_sku,
      Color: item.variant_color,
      Talla: item.variant_size,
      'Stock Inicial': item.stock_opening,
      Entradas: item.total_in,
      Salidas: item.total_out,
      'Stock Final': item.stock_closing,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Snapshot')
    XLSX.writeFile(wb, `Snapshot-${snapshotMonth}.xlsx`)
  }

  return (
    <Box>
      {/* TOOLBAR */}
      <Box sx={{
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1),
        flexWrap: 'wrap',
        gap: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600 }}>
            Mes:
          </Typography>
          <input
            type="month"
            value={snapshotMonth}
            onChange={e => onSnapshotMonthChange(e.target.value)}
            style={{
              height: 32,
              padding: '0 8px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: 6,
              border: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
            {isMonthlyReportLoading
              ? 'Calculando...'
              : monthlyReport.length === 0
                ? `Sin actividad en ${monthLabel}`
                : `${monthlyReport.length} producto${monthlyReport.length !== 1 ? 's' : ''} con movimientos en ${monthLabel}`
            }
          </Typography>
          {!isMonthlyReportLoading && monthlyReport.length > 0 && (
            <Tooltip title="Exportar Excel">
              <IconButton size="small" onClick={handleExport} sx={{ p: 0.5 }}>
                <FileDownloadIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {isMonthlyReportLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={30} />
        </Box>
      ) : monthlyReport.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" py={8} gap={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Sin movimientos en {monthLabel}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            No hubo compras ni ventas en este mes
          </Typography>
        </Box>
      ) : (
        <>
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {monthlyReport.map((item) => (
                  <Grid item xs={12} key={item.variant_id}>
                    <InventorySnapshotCard item={{ ...item, id: item.variant_id } as any} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Producto / Variante</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Stock Inicial</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Entradas</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Salidas</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Stock Final</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyReport.map((item) => (
                    <TableRow
                      key={item.variant_id}
                      hover
                      sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) } }}
                    >
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{item.product}</Typography>
                          <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>
                            {item.variant_color} - {item.variant_size}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{item.stock_opening}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '12px', color: 'success.main', fontWeight: 700 }}>+{item.total_in}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '12px', color: 'error.main', fontWeight: 700 }}>-{item.total_out}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>{item.stock_closing}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  )
})

SnapshotTab.displayName = 'SnapshotTab'

export default SnapshotTab
