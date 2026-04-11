import React, { useMemo, useRef, useState, useCallback } from 'react'
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
  Chip,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Collections as CollectionsIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CloudUpload as CloudUploadIcon,
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
  const theme = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [settingPrimaryId, setSettingPrimaryId] = useState<number | null>(null)

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

  // --- Drag-and-drop ---
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
    if (!selectedProduct) return
    const files = e.dataTransfer.files
    if (!files.length) return
    // Reusar el handler existente simulando un input change event
    const syntheticEvent = { target: { files, value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>
    onUpload(syntheticEvent)
  }, [selectedProduct, onUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (selectedProduct) setIsDraggingOver(true)
  }, [selectedProduct])

  const handleDragLeave = useCallback(() => setIsDraggingOver(false), [])

  // --- Set as primary ---
  const handleSetPrimary = useCallback(async (image: ProductImage) => {
    if (image.is_primary) return
    setSettingPrimaryId(image.id)
    try {
      await productService.updateImage(image.id, { is_primary: true })
      queryClient.invalidateQueries({ queryKey: ['product-images', selectedProduct] })
    } catch (err) {
      console.error('Error setting primary image:', err)
    } finally {
      setSettingPrimaryId(null)
    }
  }, [queryClient, selectedProduct])

  const productVariants = useMemo(
    () => variants.filter(v => v.product === selectedProduct),
    [variants, selectedProduct]
  )

  const isDark = theme.palette.mode === 'dark'

  return (
    <Box
      sx={{ p: 0 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* HEADER */}
      <Box sx={{
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.palette.primary.main,
          }}>
            <CollectionsIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>
              Gestión de Imágenes
            </Typography>
            <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
              {selectedProduct
                ? `${images.length} imagen${images.length !== 1 ? 'es' : ''} · arrastra fotos aquí o usa el botón`
                : 'Selecciona un producto para gestionar sus imágenes'}
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
                ref={fileInputRef}
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
                  startIcon={uploadLoading ? undefined : <AddIcon sx={{ fontSize: 16 }} />}
                  disabled={uploadLoading}
                  size="small"
                  sx={{
                    height: 32, fontSize: '11px', fontWeight: 600,
                    textTransform: 'none', borderRadius: 1.5, px: 2,
                    bgcolor: 'text.primary', color: 'background.default',
                    '&:hover': { bgcolor: 'text.secondary' },
                    '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                  }}
                >
                  {uploadLoading ? <CircularProgress size={14} /> : 'Subir Fotos'}
                </Button>
              </label>
            </>
          )}
        </Box>
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 2 }}>
        {!selectedProduct ? (
          /* Empty: no product selected */
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, py: 6,
          }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CollectionsIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                Selecciona un producto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Elige un producto en el selector de arriba para ver y gestionar sus imágenes
              </Typography>
            </Box>
          </Box>

        ) : loading ? (
          <Box display="flex" justifyContent="center" p={8}>
            <CircularProgress size={24} />
          </Box>

        ) : images.length === 0 ? (
          /* Empty: product selected but no images → big drop zone */
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${isDraggingOver
                ? theme.palette.primary.main
                : theme.palette.divider}`,
              borderRadius: 3,
              py: 8, px: 4,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 2,
              cursor: 'pointer',
              bgcolor: isDraggingOver
                ? alpha(theme.palette.primary.main, 0.04)
                : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.03),
              },
            }}
          >
            <CloudUploadIcon sx={{
              fontSize: 48,
              color: isDraggingOver ? 'primary.main' : 'text.disabled',
              transition: 'color 0.2s',
            }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                {isDraggingOver ? 'Suelta las fotos aquí' : 'Arrastra fotos o haz clic'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PNG, JPG, WEBP · Puedes subir varias a la vez
              </Typography>
            </Box>
          </Box>

        ) : (
          /* Images grid */
          <>
            {/* Drop zone strip when images exist */}
            {isDraggingOver && (
              <Box sx={{
                mb: 2, py: 3, borderRadius: 2,
                border: `2px dashed ${theme.palette.primary.main}`,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              }}>
                <CloudUploadIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '13px' }}>
                  Suelta las fotos para subirlas
                </Typography>
              </Box>
            )}

            <Grid container spacing={1.5}>
              {images.map((image: ProductImage) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={image.id}>
                  <ImageCard
                    image={image}
                    variants={productVariants}
                    selectedProduct={selectedProduct}
                    onDelete={onDelete}
                    onSetPrimary={handleSetPrimary}
                    settingPrimaryId={settingPrimaryId}
                    queryClient={queryClient}
                    theme={theme}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  )
}

// --- Extracted image card to prevent unnecessary re-renders ---
interface ImageCardProps {
  image: ProductImage
  variants: ProductVariant[]
  selectedProduct: number | null
  onDelete: (id: number) => void
  onSetPrimary: (image: ProductImage) => void
  settingPrimaryId: number | null
  queryClient: ReturnType<typeof useQueryClient>
  theme: ReturnType<typeof useTheme>
}

const ImageCard: React.FC<ImageCardProps> = ({
  image, variants, selectedProduct, onDelete, onSetPrimary, settingPrimaryId, queryClient, theme,
}) => {
  const [hovered, setHovered] = useState(false)
  const isPrimary = image.is_primary
  const isSettingPrimary = settingPrimaryId === image.id

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: 2,
        border: `1.5px solid ${isPrimary
          ? theme.palette.warning.main
          : theme.palette.divider}`,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? theme.shadows[4] : 'none',
      }}
    >
      {/* Image area */}
      <Box sx={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', bgcolor: 'action.hover' }}>
        <img
          src={image.image}
          alt={image.alt_text || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Primary badge */}
        {isPrimary && (
          <Box sx={{
            position: 'absolute', top: 6, left: 6,
            bgcolor: 'warning.main', borderRadius: 1,
            px: 0.75, py: 0.25,
            display: 'flex', alignItems: 'center', gap: 0.4,
          }}>
            <StarIcon sx={{ fontSize: 10, color: '#fff' }} />
            <Typography sx={{ fontSize: '9px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              PRINCIPAL
            </Typography>
          </Box>
        )}

        {/* Actions overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          bgcolor: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.18s ease',
        }}>
          {!isPrimary && (
            <Tooltip title="Establecer como principal">
              <IconButton
                size="small"
                onClick={() => onSetPrimary(image)}
                disabled={isSettingPrimary}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', width: 32, height: 32,
                  '&:hover': { bgcolor: 'warning.main' },
                }}
              >
                {isSettingPrimary
                  ? <CircularProgress size={14} sx={{ color: '#fff' }} />
                  : <StarBorderIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Eliminar imagen">
            <IconButton
              size="small"
              onClick={() => onDelete(image.id)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', width: 32, height: 32,
                '&:hover': { bgcolor: 'error.main' },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Variant selector */}
      <Box sx={{ p: 0.75 }}>
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
            '& .MuiInputBase-root': { fontSize: '10px', height: 26 },
            '& .MuiSelect-select': { py: 0 },
          }}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => {
              if (value === '') return (
                <Box sx={{ color: 'text.disabled', fontSize: '10px' }}>Sin variante</Box>
              )
              const v = variants.find(variant => variant.id === Number(value))
              if (!v) return 'Variante'
              const gLabel = v.gender === 'male' ? 'H' : v.gender === 'female' ? 'M' : 'U'
              return `${v.size} · ${v.color || 'S/C'} · ${gLabel}`
            }
          }}
        >
          <MenuItem value="" sx={{ fontSize: '11px' }}><em>Sin variante</em></MenuItem>
          {variants.map((v) => (
            <MenuItem key={v.id} value={v.id} sx={{ fontSize: '11px' }}>
              {`T${v.size} · ${v.color || 'S/C'} · ${v.gender === 'male' ? 'Hombre' : v.gender === 'female' ? 'Mujer' : 'Unisex'}`}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  )
}

export default ImagesManagement
