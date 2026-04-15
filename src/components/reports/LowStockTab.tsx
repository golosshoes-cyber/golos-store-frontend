import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import type { LowStockVariant } from '../../types/reports'

interface LowStockTabProps {
  selectedVariants: Set<number>
  lowStockVariants?: { products: LowStockVariant[] }
  lowStockError?: { message: string }
  onSelectVariant: (id: number) => void
  onSelectAll: () => void
}

const LowStockTab: React.FC<LowStockTabProps> = ({
  selectedVariants,
  lowStockVariants,
  lowStockError,
  onSelectVariant,
  onSelectAll,
}) => {
  const theme = useTheme()
  const mode = theme.palette.mode
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const [stockFilter, setStockFilter] = useState<number | null>(null)

  const allItems = lowStockVariants?.products || []
  const uniqueStockValues = Array.from(new Set(allItems.map(i => i.current_stock))).sort((a, b) => a - b)

  const handleStockFilterClick = () => {
    if (stockFilter === null) {
      setStockFilter(uniqueStockValues[0] ?? null)
    } else {
      const idx = uniqueStockValues.indexOf(stockFilter)
      const next = uniqueStockValues[idx + 1]
      setStockFilter(next !== undefined ? next : null)
    }
  }

  const items = stockFilter === null ? allItems : allItems.filter(i => i.current_stock === stockFilter)
  const isAnySelected = selectedVariants.size > 0

  return (
    <Box sx={{ position: 'relative' }}>
      {/* TOOLBAR INTEGRATED */}
      <Box sx={{
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
      }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
          Variantes en Alerta de Stock
        </Typography>
        <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
          {stockFilter !== null ? `${items.length} de ${allItems.length}` : allItems.length} variantes encontradas
        </Typography>
      </Box>

      {lowStockError && (
        <Alert severity="error" sx={{ m: 2, borderRadius: 1.5, py: 0.5 }}>
          <Typography variant="caption">{lowStockError.message}</Typography>
        </Alert>
      )}

      {!lowStockVariants ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress size={30} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Cargando alertas...</Typography>
        </Box>
      ) : (
        <>
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={1.5}>
                {items.map((item: LowStockVariant) => (
                  <Grid item xs={12} key={item.id}>
                    <Card sx={{ 
                      borderRadius: 1.5, 
                      border: `1px solid ${selectedVariants.has(item.id) ? theme.palette.primary.main : theme.palette.divider}`,
                      bgcolor: selectedVariants.has(item.id) ? alpha(theme.palette.primary.main, 0.02) : 'background.paper',
                      boxShadow: 'none'
                    }}>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="subtitle2" fontWeight={700}>{item.product_name}</Typography>
                          <input 
                            type="checkbox" 
                            checked={selectedVariants.has(item.id)} 
                            onChange={() => onSelectVariant(item.id)}
                            style={{ width: 16, height: 16, cursor: 'pointer' }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                          {item.variant_info}
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                          <Box>
                            <Typography sx={{ fontSize: '10px', color: 'text.disabled', textTransform: 'uppercase' }}>Actual</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'error.main' }}>{item.current_stock}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '10px', color: 'text.disabled', textTransform: 'uppercase' }}>Mínimo</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{item.stock_minimum}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ py: 1.2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedVariants.size === items.length && items.length > 0} 
                          onChange={onSelectAll} 
                          style={{ width: 14, height: 14, cursor: 'pointer' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>Producto / Variante</TableCell>
                    <TableCell
                      align="right"
                      onClick={handleStockFilterClick}
                      sx={{
                        fontWeight: 700, py: 1.2, fontSize: '11px', textTransform: 'uppercase',
                        cursor: 'pointer', userSelect: 'none',
                        color: stockFilter !== null ? 'primary.main' : 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        Stock Actual
                        <Box component="span" sx={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: 16, fontSize: '9px', fontWeight: 800, lineHeight: 1,
                          color: stockFilter !== null ? 'primary.main' : 'inherit',
                          opacity: stockFilter !== null ? 1 : 0.4,
                        }}>
                          {stockFilter !== null ? stockFilter : '▲▼'}
                        </Box>
                        {stockFilter !== null && (
                          <Box
                            component="span"
                            onClick={(e) => { e.stopPropagation(); setStockFilter(null) }}
                            sx={{ fontSize: '9px', opacity: 0.5, lineHeight: 1, '&:hover': { opacity: 1 } }}
                          >
                            ✕
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Stock Mínimo</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }} align="right">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">No hay alertas de stock</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item: LowStockVariant) => (
                      <TableRow 
                        key={item.id} 
                        hover
                        onClick={() => onSelectVariant(item.id)}
                        sx={{ 
                          cursor: 'pointer',
                          bgcolor: selectedVariants.has(item.id) ? alpha(theme.palette.primary.main, 0.03) : 'transparent',
                          '&:hover': { bgcolor: selectedVariants.has(item.id) ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.01) }
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ py: 1.2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={selectedVariants.has(item.id)} 
                              readOnly
                              style={{ width: 14, height: 14, cursor: 'pointer' }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{item.product_name}</Typography>
                            <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>{item.variant_info}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'error.main' }}>
                            {item.current_stock}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                            {item.stock_minimum}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ 
                            display: 'inline-flex', px: 1, py: 0.2, borderRadius: 1, 
                            fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
                            bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main'
                          }}>
                            Crítico
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/inventory/purchases', { state: { openCreateModal: true, initialVariant: item.id } });
                            }}
                            sx={{ fontSize: '10px', py: 0.2, minWidth: 'auto', borderRadius: 1.2 }}
                          >
                            Comprar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* FLOATING BULK ACTIONS */}
          {isAnySelected && (
            <Box sx={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'text.primary',
              color: 'background.paper',
              px: { xs: 2, sm: 3 },
              py: 1.2,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              zIndex: 1300,
              width: { xs: '90%', sm: 'auto' },
            }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.2)', pr: 3 }}>
                {selectedVariants.size} seleccionados
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="inherit"
                  onClick={() => navigate('/inventory/purchases', { state: { openCreateModal: true, initialVariants: Array.from(selectedVariants) } })}
                  sx={{ 
                    bgcolor: 'background.paper', 
                    color: 'text.primary', 
                    fontSize: '11px', 
                    fontWeight: 700,
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: alpha('#fff', 0.9) } 
                  }}
                >
                  Comprar ({selectedVariants.size})
                </Button>
                <Button 
                  size="small" 
                  variant="text" 
                  onClick={() => onSelectVariant(-1)}
                  sx={{ color: 'background.paper', fontSize: '11px', opacity: 0.8 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default LowStockTab
