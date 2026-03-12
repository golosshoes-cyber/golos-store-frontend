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
      <TableContainer sx={{ 
        width: '100%', 
        overflowX: 'auto',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        bgcolor: 'background.paper',
        mb: 2
      }}>
        {variants.length === 0 && search && !loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography variant="body2" color="text.secondary">
              No se encontraron variantes con esa búsqueda
            </Typography>
          </Box>
        ) : (
          <Table aria-label="variants table">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Género</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants?.map((variant) => {
                const product = allProducts?.find(p => p.id === variant.product)
                return (
                  <TableRow key={variant.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                        {product ? generateSKUVariant(variant, product) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {variant.gender}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={variant.stock === 0 ? 'error.main' : 'text.primary'}>
                        {variant.stock}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ${parseFloat(variant.price.toString()).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        px: 1, 
                        py: 0.25, 
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 500,
                        bgcolor: variant.active ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08),
                        color: variant.active ? theme.palette.success.main : theme.palette.error.main,
                        border: `1px solid ${variant.active ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2)}`
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
                              width: 36,
                              height: 36,
                              objectFit: 'cover',
                              cursor: 'pointer',
                              borderRadius: 1.5,
                              border: `1px solid ${theme.palette.divider}`,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                opacity: 0.8,
                                transform: 'scale(1.05)',
                              }
                            }}
                            onClick={() => handleImageClick(assignedImage.image, variant)}
                          />
                        ) : (
                          <Typography variant="caption" color="text.disabled">Sin imagen</Typography>
                        )
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={0.5} justifyContent="flex-end">
                        <Tooltip title="Ver">
                          <IconButton size="small" onClick={() => onView(variant)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => onEdit(variant)} sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}>
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => onDelete(variant.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {(() => {
        const count = totalCount || 0
        return count > 20 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={Math.ceil(count / 20)}
              page={page}
              onChange={(_, newPage) => onPageChange(newPage)}
              size="small"
            />
          </Box>
        )
      })()}

      <DialogShell
        open={imageViewerOpen}
        onClose={handleCloseImageViewer}
        maxWidth="md"
        fullWidth
        contentSx={{ p: 0, position: 'relative' }}
        actions={
          <Button
            onClick={handleCloseImageViewer}
            startIcon={<CloseIcon />}
            color="primary"
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
