import React from 'react'
import {
  Box,
  Typography,
  Paper,
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
  useTheme,
  useMediaQuery,
} from '@mui/material'
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
}

const InventoryHistoryTab: React.FC<InventoryHistoryTabProps> = ({
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
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Historial de Inventario
      </Typography>
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha Fin"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Producto</InputLabel>
              <Select
                value={productFilter}
                onChange={(e: SelectChangeEvent<string>) => onProductFilterChange(e.target.value)}
                label="Producto"
              >
                <MenuItem value="">
                  <em>Todos los productos</em>
                </MenuItem>
                {productsDetails.map((product: Product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Variante"
              value={variantFilter}
              onChange={(e) => onVariantFilterChange(e.target.value)}
              placeholder="ID de la variante"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Movimiento</InputLabel>
              <Select
                value={movementTypeFilter}
                onChange={(e: SelectChangeEvent<string>) => onMovementTypeFilterChange(e.target.value)}
                label="Tipo de Movimiento"
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="Compra">Compra</MenuItem>
                <MenuItem value="Venta">Venta</MenuItem>
                <MenuItem value="Ajuste">Ajuste</MenuItem>
                <MenuItem value="Devolución">Devolución</MenuItem>
                <MenuItem value="Devolución de venta">Devolución de venta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {isInventoryHistoryLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {inventoryHistoryError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              Error al cargar el historial: {inventoryHistoryError.message}
            </Alert>
          )}

          {inventoryHistory && (
            isMobile ? (
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
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Producto</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Variante</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Cantidad</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Balance</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Razón</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryHistory.results?.map((item: InventoryHistoryItem) => {
                      const variant = variants?.results?.find(v => v.id === item.variant)
                      return (
                        <TableRow key={item.id} hover>
                          <TableCell>{new Date(item.created_at).toLocaleDateString('es-ES')}</TableCell>
                          <TableCell>{item.product}</TableCell>
                          <TableCell>{variant ? `${variant.color} - ${variant.size}` : item.variant.toString()}</TableCell>
                          <TableCell>{item.movement_type_display}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.stock_after}</TableCell>
                          <TableCell>{item.observation}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}

          {inventoryHistory && inventoryHistory.count > 20 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil((inventoryHistory.count || 0) / 20)}
                page={inventoryHistoryParams.page || 1}
                onChange={(_, p) => onPageChange(p)}
                color="primary"
                size="small"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minWidth: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default InventoryHistoryTab
