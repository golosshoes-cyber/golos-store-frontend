import React from 'react'
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { FileDownload as FileDownloadIcon } from '@mui/icons-material'
import type { Product } from '../../types'
import type { InventoryHistoryItem, InventoryHistoryParams } from '../../types/reports'
import InventoryHistoryCard from './InventoryHistoryCard'

interface InventoryHistoryTabProps {
  startDate: string
  endDate: string
  productFilter: string
  variantFilter: string
  movementTypeFilter: string
  inventoryHistoryParams: InventoryHistoryParams
  productsDetails: Product[]
  variants?: { results: any[] }
  inventoryHistory?: { results: InventoryHistoryItem[]; count: number }
  isInventoryHistoryLoading: boolean
  inventoryHistoryError?: { message: string }
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onProductFilterChange: (value: string) => void
  onVariantFilterChange: (value: string) => void
  onMovementTypeFilterChange: (value: string) => void
  onFetchInventoryHistory: () => void
  onPageChange: (page: number) => void
  onExportHistory: () => void
}

const InventoryHistoryTab: React.FC<InventoryHistoryTabProps> = React.memo(({
  startDate,
  endDate,
  productFilter,
  variantFilter,
  movementTypeFilter,
  inventoryHistoryParams,
  productsDetails,
  variants,
  inventoryHistory,
  isInventoryHistoryLoading,
  inventoryHistoryError,
  onStartDateChange,
  onEndDateChange,
  onProductFilterChange,
  onVariantFilterChange,
  onMovementTypeFilterChange,
  onPageChange,
  onExportHistory,
}) => {
  const theme = useTheme()
  const mode = theme.palette.mode
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const totalCount = inventoryHistory?.count || 0
  const currentPage = inventoryHistoryParams.page || 1
  const totalPages = Math.ceil(totalCount / 20) || 1

  return (
    <Box>
      {/* TOOLBAR INTEGRATED */}
      <Box sx={{
        p: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.2,
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
      }}>
        <TextField
          label="Inicio"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ 
            width: { xs: '100%', sm: 140 },
            '& .MuiInputBase-root': { 
              fontSize: '11px', 
              borderRadius: 1.5,
              height: 36,
              bgcolor: mode === 'light' ? '#fff' : alpha('#fff', 0.03)
            },
            '& .MuiInputLabel-root': { 
              fontSize: '11px',
              '&.Mui-focused, &.MuiInputLabel-shrink': {
                transform: 'translate(14px, -8px) scale(0.85)',
                bgcolor: mode === 'light' ? '#fff' : theme.palette.background.paper,
                px: 0.5,
                fontWeight: 700
              }
            }
          }}
        />
        <TextField
          label="Fin"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ 
            width: { xs: '100%', sm: 140 },
            '& .MuiInputBase-root': { 
              fontSize: '11px', 
              borderRadius: 1.5,
              height: 36,
              bgcolor: mode === 'light' ? '#fff' : alpha('#fff', 0.03)
            },
            '& .MuiInputLabel-root': { 
              fontSize: '11px',
              '&.Mui-focused, &.MuiInputLabel-shrink': {
                transform: 'translate(14px, -8px) scale(0.85)',
                bgcolor: mode === 'light' ? '#fff' : theme.palette.background.paper,
                px: 0.5,
                fontWeight: 700
              }
            }
          }}
        />
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
          <InputLabel sx={{ fontSize: '12px' }}>Producto</InputLabel>
          <Select
            value={productFilter}
            onChange={(e: SelectChangeEvent<string>) => onProductFilterChange(e.target.value)}
            label="Producto"
            sx={{ fontSize: '12px', borderRadius: 1.5 }}
          >
            <MenuItem value="" sx={{ fontSize: '12px' }}>
              <em>Todos</em>
            </MenuItem>
            {productsDetails.map((product: Product) => (
              <MenuItem key={product.id} value={product.id} sx={{ fontSize: '12px' }}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ width: { xs: '100%', sm: 150 } }}>
          <InputLabel sx={{ fontSize: '12px' }}>Movimiento</InputLabel>
          <Select
            value={movementTypeFilter}
            onChange={(e: SelectChangeEvent<string>) => onMovementTypeFilterChange(e.target.value)}
            label="Movimiento"
            sx={{ fontSize: '12px', borderRadius: 1.5 }}
          >
            <MenuItem value="" sx={{ fontSize: '12px' }}>
              <em>Todos</em>
            </MenuItem>
            <MenuItem value="Compra" sx={{ fontSize: '12px' }}>Compra</MenuItem>
            <MenuItem value="Venta" sx={{ fontSize: '12px' }}>Venta</MenuItem>
            <MenuItem value="Ajuste" sx={{ fontSize: '12px' }}>Ajuste</MenuItem>
            <MenuItem value="Devolución" sx={{ fontSize: '12px' }}>Devolución</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="ID Variante"
          value={variantFilter}
          onChange={(e) => onVariantFilterChange(e.target.value)}
          size="small"
          placeholder="Escribir..."
          sx={{ 
            width: { xs: '100%', sm: 120 },
            '& .MuiInputBase-root': { 
              fontSize: '11px', 
              borderRadius: 1.5,
              height: 36,
              bgcolor: mode === 'light' ? '#fff' : alpha('#fff', 0.03)
            },
            '& .MuiInputLabel-root': { 
              fontSize: '11px',
              '&.Mui-focused, &.MuiInputLabel-shrink': {
                transform: 'translate(14px, -8px) scale(0.85)',
                bgcolor: mode === 'light' ? '#fff' : theme.palette.background.paper,
                px: 0.5,
                fontWeight: 700
              }
            }
          }}
        />
      </Box>

      {isInventoryHistoryLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <>
          {inventoryHistoryError && (
            <Alert severity="error" sx={{ m: 2, borderRadius: 1.5, py: 0.5 }}>
              <Typography variant="caption">{inventoryHistoryError.message}</Typography>
            </Alert>
          )}

          {inventoryHistory && (
            isMobile ? (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {inventoryHistory.results?.map((item: InventoryHistoryItem) => {
                    const variant = variants?.results?.find(v => v.id === item.variant)
                    const variantDisplay = variant ? `${variant.color} - ${variant.size}` : item.variant.toString()
                    return (
                      <Grid item xs={12} key={item.id}>
                        <InventoryHistoryCard item={item} variantDisplay={variantDisplay} />
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
            ) : (
              <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Producto / Variante</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Movimiento</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Cantidad</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Stock Final</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Observación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryHistory.results?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Typography variant="body2" color="text.secondary">No hay movimientos registrados</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      inventoryHistory.results?.map((item: InventoryHistoryItem) => {
                        const variant = variants?.results?.find(v => v.id === item.variant)
                        return (
                          <TableRow 
                            key={item.id} 
                            hover
                            sx={{ 
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) }
                            }}
                          >
                            <TableCell sx={{ py: 1.2 }}>
                              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                                {new Date(item.created_at).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                                  {item.product}
                                </Typography>
                                <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>
                                  {variant ? `${variant.color} - ${variant.size}` : `Variante #${item.variant}`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ 
                                display: 'inline-flex',
                                px: 1, py: 0.2, borderRadius: 1,
                                fontSize: '10px', fontWeight: 700,
                                textTransform: 'uppercase',
                                bgcolor: item.movement_type_display === 'Venta' ? alpha(theme.palette.error.main, 0.1) : 
                                         item.movement_type_display === 'Compra' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.info.main, 0.1),
                                color: item.movement_type_display === 'Venta' ? 'error.main' : 
                                       item.movement_type_display === 'Compra' ? 'success.main' : 'info.main'
                              }}>
                                {item.movement_type_display}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ 
                                fontSize: '12px', 
                                fontWeight: 700,
                                color: item.quantity > 0 ? 'success.main' : 'error.main'
                              }}>
                                {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                                {item.stock_after}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                                {item.observation || '-'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}

          {/* INTEGRATED PREMIUM FOOTER */}
          <Box sx={{
            p: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
                {totalCount} movimientos · Página {currentPage} de {totalPages}
              </Typography>
              {totalCount > 0 && (
                <Tooltip title="Exportar Excel (todas las páginas)">
                  <IconButton size="small" onClick={onExportHistory} sx={{ p: 0.5 }}>
                    <FileDownloadIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Pagination
              count={totalPages}
              page={currentPage}
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
        </>
      )}
    </Box>
  )
})

InventoryHistoryTab.displayName = 'InventoryHistoryTab'

export default InventoryHistoryTab
