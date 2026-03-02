import React, { useState } from 'react'
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
  CircularProgress,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material'
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
      <Paper>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  // Diálogo del visor de imágenes
  return (
    <>
      <Paper>
        {variants.length === 0 && search && !loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <Typography>No se encontraron variantes con esa búsqueda</Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Género</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Imagen</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variants?.map((variant) => {
                    const product = allProducts?.find(p => p.id === variant.product)
                    return (
                      <TableRow key={variant.id} hover>
                        <TableCell>{product?.name || 'N/A'}</TableCell>
                        <TableCell>{product ? generateSKUVariant(variant, product) : 'N/A'}</TableCell>
                        <TableCell>{variant.gender === 'male' ? 'Masculino' : variant.gender === 'female' ? 'Femenino' : 'Unisex'}</TableCell>
                        <TableCell>{variant.stock}</TableCell>
                        <TableCell>${parseFloat(variant.price.toString()).toFixed(2)}</TableCell>
                        <TableCell>{variant.active ? 'Activo' : 'Inactivo'}</TableCell>
                        <TableCell>
                          {(() => {
                            const assignedImage = images.find(img => img.variant === variant.id)
                            return assignedImage ? (
                              <Box
                                component="img"
                                src={assignedImage.image}
                                alt=""
                                sx={{
                                  width: 50,
                                  height: 50,
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                  borderRadius: 1,
                                  border: '1px solid #e0e0e0',
                                  '&:hover': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)',
                                    transition: 'all 0.2s ease-in-out'
                                  }
                                }}
                                onClick={() => handleImageClick(assignedImage.image, variant)}
                              />
                            ) : (
                              '-'
                            )
                          })()}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Ver detalles">
                              <IconButton size="small" onClick={() => onView(variant)} color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar variante">
                              <IconButton size="small" onClick={() => onEdit(variant)} color="warning">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar variante">
                              <IconButton size="small" onClick={() => onDelete(variant.id)} color="error">
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
            
            {(() => {
              const count = totalCount || 0
              return count > 20 && (
                <Box display="flex" justifyContent="center" p={2}>
                  <Pagination
                    count={Math.ceil(count / 20)}
                    page={page}
                    onChange={(_, newPage) => onPageChange(newPage)}
                  />
                </Box>
              )
            })()}
          </>
        )}
      </Paper>
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
          <Typography variant="h6" component="h2">
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
