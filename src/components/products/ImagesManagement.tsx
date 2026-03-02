import React, { useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Autocomplete,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useQueryClient } from '@tanstack/react-query'
import { Product, ProductVariant, ProductImage } from '../../types'
import { productService } from '../../services/productService'

interface ImagesManagementProps {
  allProducts: Product[]
  selectedProduct: number | null
  onProductChange: (productId: number | null) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: (imageId: number) => void
  images: ProductImage[]
  loading: boolean
  uploadLoading: boolean
  variants: ProductVariant[]
}

const ImagesManagement: React.FC<ImagesManagementProps> = ({
  allProducts,
  selectedProduct,
  onProductChange,
  onUpload,
  onDelete,
  images,
  loading,
  uploadLoading,
  variants,
}) => {
  const queryClient = useQueryClient()
  const productOptions = useMemo(() => {
    const base = allProducts.map((p) => ({ label: p.name, id: p.id }))
    if (!selectedProduct) return base

    const alreadyIncluded = base.some((p) => p.id === selectedProduct)
    if (alreadyIncluded) return base

    return [{ id: selectedProduct, label: `Producto #${selectedProduct}` }, ...base]
  }, [allProducts, selectedProduct])

  const selectedOption = useMemo(() => {
    if (!selectedProduct) return null
    return productOptions.find((option) => option.id === selectedProduct) || null
  }, [productOptions, selectedProduct])

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gestión de Imágenes
      </Typography>

      <Autocomplete
        options={productOptions}
        value={selectedOption}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, newValue) => onProductChange(newValue ? newValue.id : null)}
        renderInput={(params) => <TextField {...params} label="Seleccionar producto para gestionar imágenes" />}
        sx={{ mb: 3, width: '100%' }}
      />

      {selectedProduct && (
        <>
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddIcon />}
                disabled={uploadLoading}
              >
                {uploadLoading ? <CircularProgress size={20} /> : 'Subir Imágenes'}
              </Button>
            </label>
          </Box>

          <Typography variant="h6" gutterBottom>
            Imágenes del Producto
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {images?.map((image: ProductImage) => (
                <Grid item xs={6} sm={4} md={3} key={image.id}>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <img
                      src={image.image}
                      alt={image.alt_text || ''}
                      style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Button
                      size="small"
                      color="error"
                      sx={{ position: 'absolute', top: 4, right: 4 }}
                      onClick={() => onDelete(image.id)}
                    >
                      <DeleteIcon />
                    </Button>
                    <TextField
                      select
                      size="small"
                      label="Asignar a variante"
                      value={image.variant || ''}
                      onChange={(e) => {
                        const variantId = Number(e.target.value) || null
                        productService.updateImage(image.id, { variant: variantId }).then(() => {
                          queryClient.invalidateQueries({ queryKey: ['product-images', selectedProduct] })
                        }).catch(err => console.error('Error updating image:', err))
                      }}
                      sx={{ mt: 1, width: '100%' }}
                    >
                      <MenuItem value="">Ninguna</MenuItem>
                      {variants.filter(v => v.product === selectedProduct).map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                          {`${v.size} - ${v.color || 'Sin color'} - ${v.gender === 'male' ? 'M' : v.gender === 'female' ? 'F' : 'U'}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Paper>
  )
}

export default ImagesManagement
