import React from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Product, ProductVariant } from '../../types'

interface ProductsTableProps {
  products: Product[]
  loading: boolean
  page: number
  totalCount: number | undefined
  onPageChange: (page: number) => void
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
  search?: string
  onUpdate?: (product: Product) => void
  onView: (product: Product) => void
  
  // New Props
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  loading,
  page,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
  search,
  onUpdate,
  onView,
  selectedIds,
  onSelectionChange,
  currentSort,
  onSortChange,
}) => {
  const theme = useTheme()

  const [editingProductId, setEditingProductId] = React.useState<number | null>(null)
  const [editingName, setEditingName] = React.useState('')

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 300,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Box>
      {products.length === 0 && search && !loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography variant="body2" color="text.secondary">
            No se encontraron productos con esa búsqueda
          </Typography>
        </Box>
      ) : (
        <Box>
          {/* Desktop View - Table */}
          <TableContainer sx={{ 
            width: '100%', 
            overflowX: 'auto',
            bgcolor: 'transparent',
          }}>
            <Table aria-label="products table" size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.02)' }}>
                  <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pl: 2 }}>
                    <input 
                      type="checkbox" 
                      style={{ accentColor: theme.palette.text.primary, width: 14, height: 14 }} 
                      checked={products.length > 0 && selectedIds.length === products.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectionChange(products.map(p => p.id))
                        } else {
                          onSelectionChange([])
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Imagen
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px', py: 1.2
                  }}>
                    Producto / Modelo
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Marca
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Tipo
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: currentSort.includes('stock') ? 'text.primary' : 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer',
                    '&:hover': { color: 'text.primary' }
                  }}
                  onClick={() => onSortChange(currentSort === 'stock-desc' ? 'stock-asc' : 'stock-desc')}
                  >
                    Stock Total 
                    <Box component="span" sx={{ opacity: currentSort.includes('stock') ? 1 : 0.5, ml: 0.5 }}>
                      {currentSort === 'stock-asc' ? '↑' : currentSort === 'stock-desc' ? '↓' : '↕'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Estado
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`, pr: 2,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((product) => {
                  const totalStock = product.variants.reduce((sum: number, v: ProductVariant) => sum + v.stock, 0)

                  return (
                    <TableRow 
                      key={product.id} 
                      hover 
                      selected={selectedIds.includes(product.id)}
                      sx={{ 
                        '&:last-child td': { border: 0 },
                        '&.Mui-selected': { bgcolor: alpha(theme.palette.text.primary, 0.04) },
                        '&.Mui-selected:hover': { bgcolor: alpha(theme.palette.text.primary, 0.06) }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ pl: 2 }}>
                        <input 
                          type="checkbox" 
                          style={{ accentColor: theme.palette.text.primary, width: 14, height: 14 }} 
                          checked={selectedIds.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onSelectionChange([...selectedIds, product.id])
                            } else {
                              onSelectionChange(selectedIds.filter(id => id !== product.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          width: 44, height: 44, borderRadius: 2, 
                          overflow: 'hidden', border: `1px solid ${theme.palette.divider}`,
                          bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: '18px', opacity: 0.3 }}>👟</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {editingProductId === product.id ? (
                          <TextField
                            value={editingName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingName(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') {
                                onUpdate?.({ ...product, name: editingName })
                                setEditingProductId(null)
                              }
                              if (e.key === 'Escape') {
                                setEditingProductId(null)
                              }
                            }}
                            onBlur={() => {
                              if (editingName !== product.name) {
                                onUpdate?.({ ...product, name: editingName })
                              }
                              setEditingProductId(null)
                            }}
                            autoFocus
                            size="small"
                            fullWidth
                            sx={{ '& .MuiInputBase-input': { fontSize: '12px', py: 0.5 } }}
                          />
                        ) : (
                          <Box>
                            <Typography
                              variant="body2"
                              onDoubleClick={() => {
                                setEditingProductId(product.id)
                                setEditingName(product.name)
                              }}
                              sx={{ cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                            >
                              {product.name}
                            </Typography>
                            {product.description && product.description.length > 0 && (
                              <Typography sx={{ fontSize: '10px', color: 'text.disabled', mt: 0.2 }}>
                                {product.description.substring(0, 40)}...
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                          {product.brand}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          px: 0.8, py: 0.2, borderRadius: 1, bgcolor: alpha(theme.palette.text.disabled, 0.08), 
                          color: 'text.secondary', fontSize: '10px', fontWeight: 500, display: 'inline-flex', textTransform: 'capitalize'
                        }}>
                          {product.product_type}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ 
                          fontSize: '12px', fontWeight: 600, 
                          color: totalStock === 0 ? 'error.main' : totalStock < 10 ? 'warning.main' : 'success.main' 
                        }}>
                          {totalStock} <Box component="span" sx={{ fontSize: '10px', fontWeight: 400, color: 'text.disabled' }}>uds</Box>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-flex', px: 1, py: 0.3, borderRadius: 1,
                          fontSize: '10px', fontWeight: 600,
                          bgcolor: product.active ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                          color: product.active ? theme.palette.success.main : theme.palette.error.main,
                        }}>
                          {product.active ? 'Activo' : 'Inactivo'}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 2 }}>
                        <Box display="flex" gap={0.5} justifyContent="flex-end">
                          {[
                            { icon: <VisibilityIcon sx={{ fontSize: 13 }} />, title: 'Ver', onClick: () => onView(product) },
                            { icon: <EditIcon sx={{ fontSize: 13 }} />, title: 'Editar', onClick: () => onEdit(product) },
                            { icon: <DeleteIcon sx={{ fontSize: 13 }} />, title: 'Eliminar', onClick: () => onDelete(product.id), danger: true }
                          ].map((action, idx) => (
                            <Tooltip key={idx} title={action.title}>
                              <IconButton 
                                size="small" 
                                onClick={action.onClick}
                                sx={{ 
                                  width: 28, height: 28, borderRadius: 1.5,
                                  border: `1px solid ${theme.palette.divider}`,
                                  color: 'text.disabled',
                                  '&:hover': { 
                                    color: action.danger ? 'error.main' : 'text.primary',
                                    borderColor: action.danger ? 'error.main' : 'text.disabled',
                                    bgcolor: action.danger ? alpha(theme.palette.error.main, 0.05) : 'action.hover'
                                  }
                                }}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION INTEGRATED */}
          <Box sx={{ 
            p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
          }}>
            <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
              {totalCount || 0} productos · Página {page} de {Math.ceil((totalCount || 0) / 20) || 1}
            </Typography>
            <Pagination
              count={Math.ceil((totalCount || 0) / 20)}
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)}
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
        </Box>
      )}
    </Box>
  )
}

export default ProductsTable
