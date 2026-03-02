import React from 'react'
import {
  Box,
  Typography,
  Paper,
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
  useMediaQuery,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Product, ProductVariant } from '../../types'
import ProductCard from './ProductCard'

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
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [editingProductId, setEditingProductId] = React.useState<number | null>(null)
  const [editingName, setEditingName] = React.useState('')

  if (loading) {
    return (
      <Paper>
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <Typography>Cargando productos...</Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Box>
      {products.length === 0 && search && !loading ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box display="flex" justifyContent="center" p={3}>
            <Typography>No se encontraron productos con esa búsqueda</Typography>
          </Box>
        </Paper>
      ) : (
        <>
          {/* Mobile View - Cards */}
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              {products?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
            </Box>
          ) : (
            /* Desktop View - Table */
            <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table aria-label="products table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre/Modelo</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Stock Total</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products?.map((product) => {
                    const totalStock = product.variants.reduce((sum: number, v: ProductVariant) => sum + v.stock, 0)

                    return (
                      <TableRow key={product.id} hover>
                        <TableCell>
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
                            />
                          ) : (
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight="medium"
                                onDoubleClick={() => {
                                  setEditingProductId(product.id)
                                  setEditingName(product.name)
                                }}
                                sx={{ cursor: 'pointer' }}
                              >
                                {product.name}
                              </Typography>
                              {product.description && product.description.length > 0 && (
                                <Typography variant="caption" color="textSecondary">
                                  {product.description.substring(0, 50)}...
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.product_type}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color={totalStock === 0 ? 'error.main' : 'text.primary'}
                          >
                            {totalStock} unidades
                          </Typography>
                        </TableCell>
                        <TableCell>{product.active ? 'Activo' : 'Inactivo'}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" onClick={() => onView(product)} color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar producto">
                              <IconButton size="small" onClick={() => onEdit(product)} color="warning">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar producto">
                              <IconButton size="small" onClick={() => onDelete(product.id)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {totalCount && totalCount > 20 && (
            <Box display="flex" justifyContent="center" p={2}>
              <Pagination
                count={Math.ceil(totalCount / 20)}
                page={page}
                onChange={(_, newPage) => onPageChange(newPage)}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default ProductsTable
