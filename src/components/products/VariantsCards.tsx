import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Pagination,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { ProductVariant, Product } from '../../types'
import VariantCard from './VariantCard'
import DialogShell from '../common/DialogShell'

interface VariantsCardsProps {
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

const VariantsCards: React.FC<VariantsCardsProps> = ({
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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

  if (loading) {
    return (
      <Paper>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      </Paper>
    )
  }

  if (variants.length === 0 && search && !loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No se encontraron variantes con esa búsqueda</Typography>
      </Paper>
    )
  }

  return (
    <>
      <Box>
      <Grid container spacing={2}>
        {variants?.map((variant) => {
          const product = allProducts?.find(p => p.id === variant.product)
          const assignedImage = images.find(img => img.variant === variant.id)
          
          if (!product) return null

          return (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              lg={4} 
              key={variant.id}
            >
              <VariantCard
                variant={variant}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                image={assignedImage}
                onImageClick={handleImageClick}
              />
            </Grid>
          )
        })}
      </Grid>
      
      {totalCount && totalCount > (isMobile ? 6 : 9) && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Pagination
            count={Math.ceil(totalCount / 20)}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}
    </Box>

    {/* Diálogo del visor de imágenes */}
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

export default VariantsCards
