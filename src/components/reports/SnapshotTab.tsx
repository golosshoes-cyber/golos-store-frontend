import React from 'react'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useMediaQuery,
  Pagination,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import type { InventorySnapshotItem } from '../../types/reports'
import InventorySnapshotCard from './InventorySnapshotCard'

interface SnapshotTabProps {
  snapshots?: { results: InventorySnapshotItem[], count: number }
  snapshotsParams: { page: number }
  isSnapshotsLoading: boolean
  snapshotsError?: { message: string }
  isCreatingSnapshot: boolean
  onCreateSnapshot: () => void
  onExportExcel: () => void
  onPageChange: (page: number) => void
}

const SnapshotTab: React.FC<SnapshotTabProps> = ({
  snapshots,
  snapshotsParams,
  isSnapshotsLoading,
  snapshotsError,
  isCreatingSnapshot,
  onCreateSnapshot,
  onExportExcel,
  onPageChange,
}) => {
  const theme = useTheme()
  const mode = theme.palette.mode
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const items = snapshots?.results || []

  return (
    <Box>
      {/* TOOLBAR INTEGRATED */}
      <Box sx={{
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={onCreateSnapshot}
            disabled={isCreatingSnapshot}
            sx={{ 
              height: 32, 
              fontSize: '11px', 
              fontWeight: 700, 
              borderRadius: 1.5,
              bgcolor: 'text.primary',
              color: 'background.paper',
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.8) }
            }}
          >
            {isCreatingSnapshot ? <CircularProgress size={16} color="inherit" /> : 'Crear Snapshot'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={onExportExcel}
            sx={{ 
              height: 32, 
              fontSize: '11px', 
              fontWeight: 700, 
              borderRadius: 1.5,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: 'text.primary', bgcolor: 'transparent' }
            }}
          >
            Exportar Excel
          </Button>
        </Box>
        <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
          {items.length} registros mensuales
        </Typography>
      </Box>

      {snapshotsError && (
        <Alert severity="error" sx={{ m: 2, borderRadius: 1.5, py: 0.5 }}>
          <Typography variant="caption">{snapshotsError.message}</Typography>
        </Alert>
      )}

      {isSnapshotsLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <>
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {items.map((snapshot: InventorySnapshotItem) => (
                  <Grid item xs={12} key={snapshot.id}>
                    <InventorySnapshotCard item={snapshot} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Mes</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Producto / Variante</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Stock Inicial</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Entradas</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Salidas</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Stock Final</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">No hay snapshots disponibles</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((snapshot: InventorySnapshotItem) => (
                      <TableRow 
                        key={snapshot.id} 
                        hover
                        sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) } }}
                      >
                        <TableCell sx={{ py: 1.2 }}>
                          <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                            {new Date(snapshot.month).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{snapshot.product}</Typography>
                            <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>{snapshot.variant_color} - {snapshot.variant_size}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{snapshot.stock_opening}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '12px', color: 'success.main', fontWeight: 700 }}>+{snapshot.total_in}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '12px', color: 'error.main', fontWeight: 700 }}>{snapshot.total_out}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>{snapshot.stock_closing}</Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* INTEGRATED PREMIUM FOOTER */}
          {!isMobile && items.length > 0 && (
            <Box sx={{ 
              p: 1.5, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
            }}>
              <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
                {snapshots?.count || 0} registros · Página {snapshotsParams.page} de {Math.ceil((snapshots?.count || 0) / 20)}
              </Typography>
              <Pagination
                count={Math.ceil((snapshots?.count || 0) / 20)}
                page={snapshotsParams.page}
                onChange={(_, p) => onPageChange(p)}
                size="small"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '11px',
                    height: 28,
                    minWidth: 28,
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: 'background.paper',
                    '&.Mui-selected': { bgcolor: 'text.primary', color: 'background.default', border: 'none' },
                    '&:hover': { borderColor: 'text.disabled' }
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default SnapshotTab
