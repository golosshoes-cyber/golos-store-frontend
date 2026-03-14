import React, { useState } from 'react'
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
  CircularProgress,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { ProductVariant, Product } from '../../types'
import DialogShell from '../common/DialogShell'

interface VariantsTableProps {
  variants: ProductVariant[]
  loading: boolean
  page: number
  totalCount: number | undefined
  allProducts: Product[]
  onPageChange: (page: number) => void
  onEdit: (variant: ProductVariant) => void
  onDelete: (variantId: number) => void
  images: any[]
  search?: string
  onView: (variant: ProductVariant) => void
  
  // New Props
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

const VariantsTable: React.FC<VariantsTableProps> = ({
  variants,
  loading,
  page,
  totalCount,
  allProducts,
  onPageChange,
  onEdit,
  onDelete,
  images,
  search,
  onView,
  selectedIds,
  onSelectionChange,
  currentSort,
  onSortChange,
}) => {
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedVariantName, setSelectedVariantName] = useState<string>('')
  const theme = useTheme()

  const handleCloseImageViewer = () => {
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) {
      activeElement.blur()
    }
    setImageViewerOpen(false)
  }

  const handleImageClick = (imageUrl: string, variant: ProductVariant) => {
    const product = allProducts?.find(p => p.id === variant.product)
    const variantName = `${product?.name || 'N/A'} - ${variant.size} ${variant.color || ''}`
    setSelectedImage(imageUrl)
    setSelectedVariantName(variantName)
    setImageViewerOpen(true)
  }

  const generateSKUVariant = (variant: ProductVariant, product: Product) => {
    const brand = product.brand.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    const name = product.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    const color = (variant.color || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    const size = variant.size.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase()
    return `${brand}-${name}-${color}-${size}`
  }

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
    <>
      <Box>
        <TableContainer sx={{ 
          width: '100%', 
          overflowX: 'auto',
          bgcolor: 'transparent',
        }}>
          {variants.length === 0 && search && !loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography variant="body2" color="text.secondary">
                No se encontraron variantes con esa búsqueda
              </Typography>
            </Box>
          ) : (
            <Table aria-label="variants table" size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.02)' }}>
                  <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, pl: 2 }}>
                    <input 
                      type="checkbox" 
                      style={{ accentColor: theme.palette.text.primary, width: 14, height: 14 }} 
                      checked={variants.length > 0 && selectedIds.length === variants.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectionChange(variants.map(v => v.id))
                        } else {
                          onSelectionChange([])
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px', py: 1.2
                  }}>
                    Producto
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    SKU
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Género
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: currentSort.includes('stock') ? 'text.primary' : 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer',
                    '&:hover': { color: 'text.primary' }
                  }}
                  onClick={() => onSortChange(currentSort === 'stock-desc' ? 'stock-asc' : 'stock-desc')}
                  >
                    Stock 
                    <Box component="span" sx={{ opacity: currentSort.includes('stock') ? 1 : 0.5, ml: 0.5 }}>
                      {currentSort === 'stock-asc' ? '↑' : currentSort === 'stock-desc' ? '↓' : '↕'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: currentSort.includes('price') ? 'text.primary' : 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer',
                    '&:hover': { color: 'text.primary' }
                  }}
                  onClick={() => onSortChange(currentSort === 'price-desc' ? 'price-asc' : 'price-desc')}
                  >
                    Precio 
                    <Box component="span" sx={{ opacity: currentSort.includes('price') ? 1 : 0.5, ml: 0.5 }}>
                      {currentSort === 'price-asc' ? '↑' : currentSort === 'price-desc' ? '↓' : '↕'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: '10px', fontWeight: 600, color: 'text.disabled',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    Imagen
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
                {variants?.map((variant) => {
                  const product = allProducts?.find(p => p.id === variant.product)
                  return (
                    <TableRow 
                      key={variant.id} 
                      hover 
                      selected={selectedIds.includes(variant.id)}
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
                          checked={selectedIds.includes(variant.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onSelectionChange([...selectedIds, variant.id])
                            } else {
                              onSelectionChange(selectedIds.filter(id => id !== variant.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 600 }}>
                          {product?.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          fontSize: '10px', color: 'text.secondary', bgcolor: alpha(theme.palette.text.disabled, 0.08),
                          px: 0.8, py: 0.2, borderRadius: 1, display: 'inline-flex', fontFamily: 'monospace'
                        }}>
                          {product ? generateSKUVariant(variant, product) : 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          px: 0.8, py: 0.2, borderRadius: 1, bgcolor: alpha(theme.palette.text.disabled, 0.08), 
                          color: 'text.secondary', fontSize: '10px', fontWeight: 500, display: 'inline-flex', textTransform: 'capitalize'
                        }}>
                          {variant.gender}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ 
                          fontSize: '12px', fontWeight: 600, 
                          color: variant.stock === 0 ? 'error.main' : variant.stock < 5 ? 'warning.main' : 'success.main' 
                        }}>
                          {variant.stock}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                          ${parseFloat(variant.price.toString()).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-flex', px: 1, py: 0.3, borderRadius: 1,
                          fontSize: '10px', fontWeight: 600,
                          bgcolor: variant.active ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                          color: variant.active ? theme.palette.success.main : theme.palette.error.main,
                        }}>
                          {variant.active ? 'Activo' : 'Inactivo'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const assignedImage = images.find(img => img.variant === variant.id)
                          return assignedImage ? (
                            <Box
                              component="img"
                              src={assignedImage.image}
                              alt=""
                              sx={{
                                width: 32,
                                height: 32,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.1s ease',
                                '&:hover': { transform: 'scale(1.05)' }
                              }}
                              onClick={() => handleImageClick(assignedImage.image, variant)}
                            />
                          ) : (
                            <Box sx={{ 
                              width: 32, height: 32, borderRadius: 1, border: `1px solid ${theme.palette.divider}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              bgcolor: 'action.hover', color: 'text.disabled'
                            }}>
                              <VisibilityIcon sx={{ fontSize: 14, opacity: 0.5 }} />
                            </Box>
                          )
                        })()}
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 2 }}>
                        <Box display="flex" gap={0.5} justifyContent="flex-end">
                          {[
                            { icon: <VisibilityIcon sx={{ fontSize: 13 }} />, title: 'Ver', onClick: () => onView(variant) },
                            { icon: <EditIcon sx={{ fontSize: 13 }} />, title: 'Editar', onClick: () => onEdit(variant) },
                            { icon: <DeleteIcon sx={{ fontSize: 13 }} />, title: 'Eliminar', onClick: () => onDelete(variant.id), danger: true }
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
          )}
        </TableContainer>

        {/* PAGINATION INTEGRATED */}
        <Box sx={{ 
          p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.1)
        }}>
          <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
            {totalCount || 0} variantes · Página {page} de {Math.ceil((totalCount || 0) / 20) || 1}
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

      {/* PAGINATION MOVED INTO TABLE BOX */}

      <DialogShell
        open={imageViewerOpen}
        onClose={handleCloseImageViewer}
        maxWidth="md"
        fullWidth
        contentSx={{ p: 0, position: 'relative' }}
        actions={
          <Button
            onClick={handleCloseImageViewer}
            startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 2,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            Cerrar
          </Button>
        }
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {selectedVariantName}
          </Typography>
        </Box>
        {selectedImage && (
          <Box
            component="img"
            src={selectedImage}
            alt={selectedVariantName}
            sx={{
              width: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        )}
      </DialogShell>
    </>
  )
}

export default VariantsTable
