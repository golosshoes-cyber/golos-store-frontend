import React, { useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Autocomplete,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Collections as CollectionsIcon,
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

  const theme = useTheme()

  return (
    <Box sx={{ p: 0 }}>
      {/* HEADER SECTION - COMPACT */}
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Box sx={{ 
            width: 32, height: 32, borderRadius: 1.5, 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.palette.primary.main
          }}>
            <CollectionsIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>
              Gestión de Imágenes
            </Typography>
            <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
              Administra las fotografías de tus productos y asígnalas a variantes
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Autocomplete
            options={productOptions}
            value={selectedOption}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, newValue) => onProductChange(newValue ? newValue.id : null)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="Seleccionar producto..." 
                size="small"
                sx={{ 
                  width: 280,
                  '& .MuiInputBase-root': { fontSize: '12px', height: 32 },
                }} 
              />
            )}
            sx={{ width: 'auto' }}
          />
          
          {selectedProduct && (
            <>
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
                  variant="contained"
                  component="span"
                  startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                  disabled={uploadLoading}
                  size="small"
                  sx={{ 
                    height: 32, 
                    fontSize: '11px', 
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 1.5,
                    px: 2,
                    bgcolor: 'text.primary',
                    color: 'background.default',
                    '&:hover': { bgcolor: 'text.secondary' },
                    '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
                  }}
                >
                  {uploadLoading ? <CircularProgress size={16} /> : 'Subir Fotos'}
                </Button>
              </label>
            </>
          )}
        </Box>
      </Box>

      {/* CONTENT SECTION */}
      <Box sx={{ p: 2 }}>
        {!selectedProduct ? (
          <Box sx={{ 
            height: 300, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', 
            color: 'text.disabled', opacity: 0.6 
          }}>
            <CollectionsIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography sx={{ fontSize: '13px' }}>
              Selecciona un producto para gestionar sus imágenes
            </Typography>
          </Box>
        ) : loading ? (
          <Box display="flex" justifyContent="center" p={8}>
            <CircularProgress size={24} />
          </Box>
        ) : images.length === 0 ? (
          <Box sx={{ 
            height: 200, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', 
            color: 'text.disabled', opacity: 0.6 
          }}>
            <Typography sx={{ fontSize: '13px' }}>
              No hay imágenes para este producto. Sube algunas fotos.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {images?.map((image: ProductImage) => (
              <Grid item xs={6} sm={4} md={2.4} key={image.id}>
                <Box sx={{ 
                  p: 0.8, 
                  borderRadius: 2, 
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: 'text.disabled', transform: 'translateY(-2px)' }
                }}>
                  <Box sx={{ position: 'relative', mb: 1, aspectRatio: '1/1', overflow: 'hidden', borderRadius: 1.2 }}>
                    <img
                      src={image.image}
                      alt={image.alt_text || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Tooltip title="Eliminar Imagen">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(image.id)}
                        sx={{ 
                          position: 'absolute', top: 6, right: 6,
                          bgcolor: alpha(theme.palette.error.main, 0.8),
                          color: 'white',
                          width: 24, height: 24,
                          '&:hover': { bgcolor: theme.palette.error.main }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <TextField
                    select
                    size="small"
                    value={image.variant || ''}
                    onChange={(e) => {
                      const variantId = Number(e.target.value) || null
                      productService.updateImage(image.id, { variant: variantId }).then(() => {
                        queryClient.invalidateQueries({ queryKey: ['product-images', selectedProduct] })
                      }).catch(err => console.error('Error updating image:', err))
                    }}
                    sx={{ 
                      width: '100%',
                      '& .MuiInputBase-root': { fontSize: '10px', height: 28 },
                      '& .MuiSelect-select': { py: 0 }
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (value) => {
                        if (value === '') return <Box sx={{ color: 'text.disabled', fontSize: '10px' }}>Sin variant</Box>
                        const v = variants.find(variant => variant.id === Number(value))
                        return v ? `${v.size} - ${v.color || '...'} - ${v.gender === 'male' ? 'M' : v.gender === 'female' ? 'F' : 'U'}` : 'Variant'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: '11px' }}><em>Ninguna</em></MenuItem>
                    {variants.filter(v => v.product === selectedProduct).map((v) => (
                      <MenuItem key={v.id} value={v.id} sx={{ fontSize: '11px' }}>
                        {`${v.size} - ${v.color || 'S/C'} - ${v.gender === 'male' ? 'H' : v.gender === 'female' ? 'M' : 'U'}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  )
}

export default ImagesManagement
