import React from 'react'
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
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Checkbox,
} from '@mui/material'
import { Style as StyleIcon, AddShoppingCart, Edit } from '@mui/icons-material'
import type { LowStockVariant } from '../../types/reports'
import { useNavigate } from 'react-router-dom'

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Variantes con Stock Bajo
      </Typography>

      {/* Batch buttons */}
      {selectedVariants.size > 0 && (
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {}}
            sx={{ minWidth: 180 }}
          >
            Comprar Seleccionados ({selectedVariants.size})
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {}}
            sx={{ minWidth: 180 }}
          >
            Ajustar Seleccionados ({selectedVariants.size})
          </Button>
          <Button
            variant="text"
            onClick={() => onSelectVariant(-1)}
            sx={{ minWidth: 120 }}
          >
            Limpiar Selección
          </Button>
        </Box>
      )}

      {lowStockError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Error al cargar variantes de stock bajo: {lowStockError.message}
        </Alert>
      )}

      {!lowStockVariants ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Cargando variantes con stock bajo...
          </Typography>
        </Box>
      ) : (
        <>
          {isMobile ? (
            <Grid container spacing={2}>
              {lowStockVariants.products?.map((item: LowStockVariant) => (
                <Grid item xs={12} key={item.id}>
                  <Card sx={{
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                    maxWidth: '100%',
                    minWidth: 0
                  }}>
                    {/* Header Visual Compacto */}
                    <Box sx={{
                      p: { xs: 1.5, sm: 2 },
                      background: item.current_stock < item.stock_minimum ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' : 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                      color: 'white',
                      borderRadius: 2,
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                      position: 'relative'
                    }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                        {/* Información Principal */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              fontSize: { xs: '0.9rem', sm: '1.2rem', lg: '1.4rem' },
                              lineHeight: 1.1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mb: 0.5
                            }}
                          >
                            {item.product_name}
                          </Typography>
                          
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                opacity: 0.9,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.variant_info}
                            </Typography>
                            
                            {/* Estado */}
                            <Chip
                              label={item.current_stock < item.stock_minimum ? 'Stock Bajo' : 'Stock OK'}
                              color={item.current_stock < item.stock_minimum ? 'error' : 'success'}
                              size="small"
                              sx={{
                                fontSize: { xs: '0.55rem', sm: '0.65rem' },
                                height: { xs: 18, sm: 22 },
                                fontWeight: 'bold',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }}
                            />
                          </Box>
                        </Box>
                        
                        {/* Icono */}
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.15)',
                            width: { xs: 32, sm: 38, lg: 42 },
                            height: { xs: 32, sm: 38, lg: 42 },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                        >
                          <StyleIcon sx={{ fontSize: { xs: 16, sm: 20, lg: 22 }}} />
                        </Avatar>
                        <Checkbox 
                          checked={selectedVariants.has(item.id)} 
                          onChange={() => onSelectVariant(item.id)} 
                          sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                        />
                      </Box>
                    </Box>

                    {/* Contenido Principal */}
                    <CardContent sx={{ p: 1 }}>
                      {/* Grid de Información - Layout Compacto */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                          gap: { xs: 1, sm: 2 },
                          mb: { xs: 1, sm: 2 }
                        }}
                      >
                        {/* Stock Actual */}
                        <Paper
                          sx={{
                            p: { xs: 1, sm: 1.5 },
                            textAlign: 'center',
                            borderRadius: 2,
                            background: item.current_stock < item.stock_minimum ? '#ffebee' : '#e8f5e8',
                            border: `2px solid ${item.current_stock < item.stock_minimum ? '#f44336' : '#4caf50'}`
                          }}
                        >
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
                            Stock Actual
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={item.current_stock < item.stock_minimum ? 'error.main' : 'success.main'}
                            sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                          >
                            {item.current_stock}
                          </Typography>
                        </Paper>

                        {/* Stock Mínimo */}
                        <Paper
                          sx={{
                            p: { xs: 1, sm: 1.5 },
                            textAlign: 'center',
                            borderRadius: 2,
                            background: '#e3f2fd',
                            border: '1px solid #90caf9'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, color: 'text.secondary' }}>
                            Stock Mínimo
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary.main"
                            sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                          >
                            {item.stock_minimum}
                          </Typography>
                        </Paper>
                      </Box>
                    </CardContent>
                    {/* Acciones */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        pt: 2,
                        borderTop: '1px solid #f0f0f0'
                      }}
                    >
                      <Tooltip title="Agregar a compra">
                        <IconButton
                          size="small"
                          onClick={() => navigate('/purchases', { state: { openCreateModal: true } })}
                          color="primary"
                          sx={{
                            width: { xs: 32, sm: 36 },
                            height: { xs: 32, sm: 36 },
                            '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
                          }}
                        >
                          <AddShoppingCart />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ajustar stock">
                        <IconButton
                          size="small"
                          onClick={() => navigate('/inventory')}
                          color="warning"
                          sx={{
                            width: { xs: 32, sm: 36 },
                            height: { xs: 32, sm: 36 },
                            '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 18 } }
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 50 }}>
                      <Checkbox 
                        checked={selectedVariants.size === lowStockVariants?.products?.length && lowStockVariants.products.length > 0} 
                        onChange={onSelectAll} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Producto</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Variante</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Stock Actual</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Stock Mínimo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockVariants.products?.map((item: LowStockVariant) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Checkbox 
                          checked={selectedVariants.has(item.id)} 
                          onChange={() => onSelectVariant(item.id)} 
                        />
                      </TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.variant_info}</TableCell>
                      <TableCell>{item.current_stock}</TableCell>
                      <TableCell>{item.stock_minimum}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button size="small" onClick={() => navigate('/purchases', { state: { openCreateModal: true } })}>
                            Comprar
                          </Button>
                          <Button size="small" onClick={() => navigate('/inventory')}>
                            Ajustar
                          </Button>
                        </Box>
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
}

export default LowStockTab
