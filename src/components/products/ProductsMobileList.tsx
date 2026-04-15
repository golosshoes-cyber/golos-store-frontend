import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Pagination,
  Paper,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Product, ProductVariant } from '../../types'
import { mobileCardSx, mobileCardHeaderSx, mobileCardDividerSx, mobileMetricSx } from '../common/mobileCardStyles'

interface ProductsMobileListProps {
  products: Product[]
  loading: boolean
  page: number
  totalCount: number | undefined
  onPageChange: (page: number) => void
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
  onView: (product: Product) => void
  search?: string
}

const ProductsMobileList: React.FC<ProductsMobileListProps> = ({
  products,
  loading,
  page,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  search,
}) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (products.length === 0 && search) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No se encontraron productos con esa búsqueda
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {products.map((product) => {
          const totalStock = product.variants.reduce((sum: number, v: ProductVariant) => sum + v.stock, 0)
          const stockTone = totalStock === 0 ? 'error' : totalStock < 10 ? 'warning' : 'success'

          return (
            <Card key={product.id} sx={mobileCardSx(theme)}>
              {/* Header */}
              <Box sx={{ ...mobileCardHeaderSx(theme), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{
                    fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' }, color: 'white',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {product.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', mt: 0.2 }}>
                    {product.brand}
                  </Typography>
                </Box>
                <Box sx={{
                  px: 1, py: 0.3, borderRadius: 1, ml: 1, flexShrink: 0,
                  bgcolor: product.active ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                  border: `1px solid ${product.active ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                }}>
                  <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'white', textTransform: 'uppercase' }}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </Typography>
                </Box>
              </Box>

              {/* Content */}
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}>
                  <Paper sx={mobileMetricSx(theme, stockTone)}>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500 }}>
                      Stock Total
                    </Typography>
                    <Typography fontWeight="bold" color={`${stockTone}.main`} sx={{ fontSize: '1.1rem', mt: 0.3 }}>
                      {totalStock} <Box component="span" sx={{ fontSize: '10px', fontWeight: 400, color: 'text.disabled' }}>uds</Box>
                    </Typography>
                  </Paper>
                  <Paper sx={mobileMetricSx(theme, 'neutral')}>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500 }}>
                      Tipo
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mt: 0.3, textTransform: 'capitalize' }}>
                      {product.product_type}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ ...mobileCardDividerSx(theme), pt: 1, display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  {[
                    { icon: <VisibilityIcon sx={{ fontSize: 14 }} />, title: 'Ver', onClick: () => onView(product) },
                    { icon: <EditIcon sx={{ fontSize: 14 }} />, title: 'Editar', onClick: () => onEdit(product) },
                    { icon: <DeleteIcon sx={{ fontSize: 14 }} />, title: 'Eliminar', onClick: () => onDelete(product.id), danger: true },
                  ].map((action, idx) => (
                    <Tooltip key={idx} title={action.title}>
                      <IconButton
                        size="small"
                        onClick={action.onClick}
                        sx={{
                          width: 30, height: 30, borderRadius: 1.5,
                          border: `1px solid ${theme.palette.divider}`,
                          color: 'text.disabled',
                          '&:hover': {
                            color: action.danger ? 'error.main' : 'text.primary',
                            borderColor: action.danger ? 'error.main' : 'text.disabled',
                            bgcolor: action.danger ? alpha(theme.palette.error.main, 0.05) : 'action.hover',
                          }
                        }}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Pagination */}
      <Box sx={{
        mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: `1px solid ${theme.palette.divider}`, pt: 1.5,
      }}>
        <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
          {totalCount || 0} productos · Pág {page} de {Math.ceil((totalCount || 0) / 20) || 1}
        </Typography>
        <Pagination
          count={Math.ceil((totalCount || 0) / 20)}
          page={page}
          onChange={(_, newPage) => onPageChange(newPage)}
          size="small"
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: '11px', height: 28, minWidth: 28, borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper',
              '&.Mui-selected': { bgcolor: 'text.primary', color: 'background.default', border: 'none' },
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default ProductsMobileList
