import React, { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material'
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { useTheme, useMediaQuery, alpha } from '@mui/material'
import { useProductWizard } from '../../hooks/products/useProductWizard'
import DialogShell from '../common/DialogShell'

interface ProductWizardDialogProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

const stepLabels = ['Producto base', 'Variantes', 'Imágenes']

const ProductWizardDialog: React.FC<ProductWizardDialogProps> = ({ open, onClose, onComplete }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    step,
    createdProduct,
    addedVariants,
    error,
    setError,
    imageUploadLoading,
    handleProductSubmit,
    handleVariantSubmit,
    handleImageUpload,
    handleNextStep,
    handleFinish,
    resetWizardState,
    isCreatingProduct,
    isCreatingVariant
  } = useProductWizard(onComplete)

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    brand: '',
    product_type: 'sneakers',
    active: true,
  })

  const [variantData, setVariantData] = useState({
    size: '',
    gender: 'unisex',
    color: '',
    price: '' as number | string,
    cost: '' as number | string,
    active: true,
  })

  const [selectedVariantForImage, setSelectedVariantForImage] = useState<number | ''>('')

  useEffect(() => {
    if (open) {
      setProductData({
        name: '',
        description: '',
        brand: '',
        product_type: 'sneakers',
        active: true,
      })
      setVariantData({
        size: '',
        gender: 'unisex',
        color: '',
        price: '',
        cost: '',
        active: true,
      })
      setSelectedVariantForImage('')
    }
  }, [open])

  const productTypeOptions = [
    { value: 'sneakers', label: 'Tenis' },
    { value: 'heels', label: 'Tacones' },
    { value: 'classics', label: 'Clásicos' },
    { value: 'boots', label: 'Botas' },
    { value: 'sandals', label: 'Sandalias' },
    { value: 'flats', label: 'Planas' },
    { value: 'loafers', label: 'Mocasines' },
    { value: 'other', label: 'Otro' },
  ]

  const onDialogClose = () => {
    resetWizardState()
    onClose()
  }

  const isLoading = isCreatingProduct || isCreatingVariant || imageUploadLoading

  return (
    <DialogShell
      open={open}
      onClose={!isLoading ? onDialogClose : undefined}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      dialogTitle="Nuevo Producto"
      subtitle="Agrega un nuevo producto al catálogo"
      actionsSx={{ justifyContent: 'space-between' }}
      actions={
        <>
          <Button
            onClick={onDialogClose}
            disabled={isLoading}
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
            Cancelar
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {step === 0 && (
              <Button
                type="submit"
                form="wizard-product-form"
                disabled={isCreatingProduct}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  fontSize: '12px',
                  textTransform: 'none',
                  px: 2,
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  '&:hover': { bgcolor: 'text.secondary' },
                  '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                }}
              >
                {isCreatingProduct ? <CircularProgress size={16} color="inherit" /> : 'Siguiente →'}
              </Button>
            )}
            {step === 1 && (
              <>
                <Button
                  onClick={handleNextStep}
                  disabled={isCreatingVariant}
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
                  Omitir
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={isCreatingVariant || addedVariants.length === 0}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    fontSize: '12px',
                    textTransform: 'none',
                    px: 2,
                    bgcolor: 'text.primary',
                    color: 'background.default',
                    '&:hover': { bgcolor: 'text.secondary' },
                    '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                  }}
                >
                  Siguiente →
                </Button>
              </>
            )}
            {step === 2 && (
              <Button
                onClick={handleFinish}
                disabled={imageUploadLoading}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  fontSize: '12px',
                  textTransform: 'none',
                  px: 2,
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  '&:hover': { bgcolor: 'text.secondary' },
                  '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                }}
              >
                Finalizar Creación
              </Button>
            )}
          </Box>
        </>
      }
    >
      {/* STEPPER - Matches mockup dots style */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, mb: 2 }}>
        {stepLabels.map((label, index) => (
          <React.Fragment key={label}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8, flex: 1, position: 'relative' }}>
              <Box sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                position: 'relative',
                zIndex: 1,
                ...(step === index ? {
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  border: 'none',
                } : step > index ? {
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  border: 'none',
                } : {
                  bgcolor: 'background.paper',
                  color: 'text.disabled',
                  border: `1px solid ${theme.palette.divider}`,
                }),
              }}>
                {index + 1}
              </Box>
              <Typography sx={{
                fontSize: '10px',
                fontWeight: step === index ? 600 : 500,
                color: step === index ? 'text.primary' : 'text.disabled',
                textAlign: 'center',
              }}>
                {label}
              </Typography>
            </Box>
            {index < stepLabels.length - 1 && (
              <Box sx={{
                flex: 1,
                height: 1,
                bgcolor: step > index ? 'text.primary' : theme.palette.divider,
                mt: -2,
              }} />
            )}
          </React.Fragment>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* STEP 0: PRODUCT */}
      {step === 0 && (
        <form id="wizard-product-form" onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          handleProductSubmit(productData)
        }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
            <TextField
              name="name"
              autoFocus
              size="small"
              label="Nombre / Modelo"
              placeholder="Ej: YEEZY 700 V2"
              fullWidth
              required
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              disabled={isCreatingProduct}
              InputLabelProps={{ sx: { fontSize: '12px' } }}
              InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
            />
            <TextField
              name="brand"
              size="small"
              label="Marca"
              placeholder="Ej: Adidas"
              fullWidth
              required
              value={productData.brand}
              onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
              disabled={isCreatingProduct}
              InputLabelProps={{ sx: { fontSize: '12px' } }}
              InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
            />
          </Box>
          <TextField
            name="description"
            size="small"
            label="Descripción"
            placeholder="Describe el producto..."
            fullWidth
            multiline
            rows={3}
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            disabled={isCreatingProduct}
            sx={{ mb: 1.5 }}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
          <TextField
            name="product_type"
            size="small"
            label="Tipo de producto"
            fullWidth
            select
            value={productData.product_type}
            onChange={(e) => setProductData({ ...productData, product_type: e.target.value })}
            disabled={isCreatingProduct}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          >
            {productTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </form>
      )}

      {/* STEP 1: VARIANTS */}
      {step === 1 && (
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <Box flex={1}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1.5 }}>
              Añadir Variantes a: {createdProduct?.name}
            </Typography>
            <form id="wizard-variant-form" onSubmit={(e: React.FormEvent) => {
              e.preventDefault()
              const priceVal = parseFloat(variantData.price.toString()) || 0;
              const costVal = parseFloat(variantData.cost.toString()) || 0;
              handleVariantSubmit({
                ...variantData,
                price: priceVal,
                cost: costVal
              }, () => {
                setVariantData(prev => ({ ...prev, size: '', color: '', price: '', cost: '' }))
              })
            }}>
              <Box display="flex" gap={1.5} mb={1.5}>
                <TextField name="size" size="small" label="Talla" fullWidth required value={variantData.size} onChange={(e) => setVariantData({ ...variantData, size: e.target.value })} disabled={isCreatingVariant} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }} />
                <TextField name="color" size="small" label="Color" fullWidth value={variantData.color} onChange={(e) => setVariantData({ ...variantData, color: e.target.value })} disabled={isCreatingVariant} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }} />
              </Box>
              <TextField name="gender" size="small" label="Género" select fullWidth required value={variantData.gender} onChange={(e) => setVariantData({ ...variantData, gender: e.target.value })} disabled={isCreatingVariant} sx={{ mb: 1.5 }} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}>
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Femenino</MenuItem>
                <MenuItem value="unisex">Unisex</MenuItem>
              </TextField>
              <Box display="flex" gap={1.5} mb={1.5}>
                <TextField name="price" size="small" label="Precio" fullWidth type="number" required value={variantData.price} onChange={(e) => setVariantData({ ...variantData, price: e.target.value })} disabled={isCreatingVariant} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }} />
                <TextField name="cost" size="small" label="Costo" fullWidth type="number" required value={variantData.cost} onChange={(e) => setVariantData({ ...variantData, cost: e.target.value })} disabled={isCreatingVariant} InputLabelProps={{ sx: { fontSize: '12px' } }} InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }} />
              </Box>
              <Button
                type="submit"
                fullWidth
                disabled={isCreatingVariant}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  fontSize: '12px',
                  textTransform: 'none',
                  py: 1,
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  '&:hover': { bgcolor: 'text.secondary' },
                }}
              >
                {isCreatingVariant ? <CircularProgress size={16} color="inherit" /> : 'Añadir Variante'}
              </Button>
            </form>
          </Box>

          <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />

          <Box flex={1}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 1 }}>
              Variantes Añadidas ({addedVariants.length})
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: alpha(theme.palette.text.primary, 0.02), borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
              {addedVariants.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontSize: '12px', textAlign: 'center' }}>
                  Aún no se han añadido variantes.
                </Typography>
              ) : (
                addedVariants.map((v, i) => (
                  <ListItem key={i} divider sx={{ py: 1 }}>
                    <ListItemText
                      primary={`Talla: ${v.size} ${v.color ? `| Color: ${v.color}` : ''}`}
                      secondary={`Precio: $${v.price}`}
                      primaryTypographyProps={{ fontSize: '12px', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '11px' }}
                    />
                    <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Box>
      )}

      {/* STEP 2: IMAGES */}
      {step === 2 && (
        <Box display="flex" flexDirection="column" alignItems="center" py={3}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 0.5 }}>
            Sube fotos para {createdProduct?.name}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 3, textAlign: 'center' }}>
            Puedes seleccionar múltiples imágenes a la vez.<br />
            Estas se asociarán automáticamente al producto creado.
          </Typography>

          {addedVariants.length > 0 && (
            <TextField
              name="variant_assign"
              size="small"
              label="Asignar imágenes a..."
              select
              value={selectedVariantForImage}
              onChange={(e) => setSelectedVariantForImage(e.target.value as number | '')}
              sx={{ mb: 2, width: { xs: '100%', sm: 300 } }}
              InputLabelProps={{ sx: { fontSize: '12px' } }}
              InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
            >
              <MenuItem value="">Producto General (Sin variante)</MenuItem>
              {addedVariants.map((v) => (
                <MenuItem key={v.id!} value={v.id!}>
                  Talla: {v.size} {v.color ? `- ${v.color}` : ''}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button
            component="label"
            size="small"
            startIcon={imageUploadLoading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon sx={{ fontSize: 16 }} />}
            disabled={imageUploadLoading}
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 3,
              py: 1,
              bgcolor: 'text.primary',
              color: 'background.default',
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            {imageUploadLoading ? 'Subiendo...' : 'Seleccionar Imágenes'}
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleImageUpload(e.target.files, selectedVariantForImage || undefined)
                e.target.value = ''
              }}
            />
          </Button>

          {addedVariants.length > 0 && (
            <Alert severity="success" sx={{ mt: 3, fontSize: '12px' }}>
              Producto creado con {addedVariants.length} variante(s). ¡Ya casi terminas!
            </Alert>
          )}
        </Box>
      )}
    </DialogShell>
  )
}

export default ProductWizardDialog
