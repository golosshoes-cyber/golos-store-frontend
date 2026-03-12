import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material'
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { useTheme, useMediaQuery } from '@mui/material'
import { useProductWizard } from '../../hooks/products/useProductWizard'
import ProductFormHeader from '../common/ProductFormHeader'

interface ProductWizardDialogProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

const steps = ['Producto Base', 'Añadir Variantes', 'Subir Imágenes']

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

  // Step 0 State
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    brand: '',
    product_type: 'sneakers',
    active: true,
  })

  // Step 1 State
  const [variantData, setVariantData] = useState({
    size: '',
    gender: 'unisex',
    color: '',
    price: '' as number | string,
    cost: '' as number | string,
    active: true,
  })

  // Step 2 State
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

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick' && !isCreatingProduct && !isCreatingVariant && !imageUploadLoading) {
          onDialogClose()
        }
      }}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
    >
      <Box sx={{ p: 2, background: theme.palette.background.paper }}>
        <ProductFormHeader isEditing={false} />
      </Box>

      <Box sx={{ width: '100%', pt: 3, pb: 1, px: { xs: 2, sm: 4 } }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* PASO 0: PRODUCTO */}
        {step === 0 && (
          <form id="wizard-product-form" onSubmit={(e: React.FormEvent) => {
            e.preventDefault()
            handleProductSubmit(productData)
          }}>
            <TextField
              name="name"
              autoFocus
              margin="dense"
              label="Nombre/Modelo"
              fullWidth
              required
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              disabled={isCreatingProduct}
            />
            <TextField
              name="brand"
              margin="dense"
              label="Marca"
              fullWidth
              required
              value={productData.brand}
              onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
              disabled={isCreatingProduct}
            />
            <TextField
              name="description"
              margin="dense"
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              disabled={isCreatingProduct}
            />
            <TextField
              name="product_type"
              margin="dense"
              label="Tipo de Producto"
              fullWidth
              select
              value={productData.product_type}
              onChange={(e) => setProductData({ ...productData, product_type: e.target.value })}
              disabled={isCreatingProduct}
            >
              {productTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </form>
        )}

        {/* PASO 1: VARIANTES */}
        {step === 1 && (
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
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
                <Box display="flex" gap={2}>
                  <TextField
                    name="size"
                    margin="dense"
                    label="Talla"
                    fullWidth
                    required
                    value={variantData.size}
                    onChange={(e) => setVariantData({ ...variantData, size: e.target.value })}
                    disabled={isCreatingVariant}
                  />
                  <TextField
                    name="color"
                    margin="dense"
                    label="Color"
                    fullWidth
                    value={variantData.color}
                    onChange={(e) => setVariantData({ ...variantData, color: e.target.value })}
                    disabled={isCreatingVariant}
                  />
                </Box>
                <TextField
                  name="gender"
                  margin="dense"
                  label="Género"
                  select
                  fullWidth
                  required
                  value={variantData.gender}
                  onChange={(e) => setVariantData({ ...variantData, gender: e.target.value })}
                  disabled={isCreatingVariant}
                >
                  <MenuItem value="male">Masculino</MenuItem>
                  <MenuItem value="female">Femenino</MenuItem>
                  <MenuItem value="unisex">Unisex</MenuItem>
                </TextField>
                <Box display="flex" gap={2}>
                  <TextField
                    name="price"
                    margin="dense"
                    label="Precio"
                    fullWidth
                    type="number"
                    required
                    value={variantData.price}
                    onChange={(e) => setVariantData({ ...variantData, price: e.target.value })}
                    disabled={isCreatingVariant}
                  />
                  <TextField
                    name="cost"
                    margin="dense"
                    label="Costo"
                    fullWidth
                    type="number"
                    required
                    value={variantData.cost}
                    onChange={(e) => setVariantData({ ...variantData, cost: e.target.value })}
                    disabled={isCreatingVariant}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={isCreatingVariant}
                >
                  {isCreatingVariant ? <CircularProgress size={24} /> : 'Añadir Variante'}
                </Button>
              </form>
            </Box>

            <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />

            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                Variantes Añadidas ({addedVariants.length})
              </Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: 'background.paper' }}>
                {addedVariants.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    Aún no se han añadido variantes.
                  </Typography>
                ) : (
                  addedVariants.map((v, i) => (
                    <ListItem key={i} divider>
                      <ListItemText
                        primary={`Talla: ${v.size} ${v.color ? `| Color: ${v.color}` : ''}`}
                        secondary={`Precio: $${v.price}`}
                      />
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          </Box>
        )}

        {/* PASO 2: IMAGENES */}
        {step === 2 && (
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <Typography variant="h6" gutterBottom>
              Sube fotos para {createdProduct?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4} textAlign="center">
              Puedes seleccionar múltiples imágenes a la vez. <br />
              Estas se asociarán automáticamente al producto creado.
            </Typography>

            {addedVariants.length > 0 && (
              <TextField
                name="variant_assign"
                margin="normal"
                label="Asignar imágenes a..."
                select
                value={selectedVariantForImage}
                onChange={(e) => setSelectedVariantForImage(e.target.value as number | '')}
                sx={{ mb: 3, width: { xs: '100%', sm: 300 } }}
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
              variant="contained"
              size="large"
              startIcon={imageUploadLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              disabled={imageUploadLoading}
              sx={{ py: 1.5, px: 4 }}
            >
              {imageUploadLoading ? 'Subiendo...' : 'Seleccionar Imágenes'}
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleImageUpload(e.target.files, selectedVariantForImage || undefined)
                  e.target.value = '' // reset
                }}
              />
            </Button>

            {addedVariants.length > 0 && (
              <Alert severity="success" sx={{ mt: 4 }}>
                Producto creado con {addedVariants.length} variante(s). ¡Ya casi terminas!
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button onClick={onDialogClose} color="inherit" disabled={isCreatingProduct || isCreatingVariant || imageUploadLoading}>
          {step === 0 ? 'Cancelar' : 'Salir sin finalizar'}
        </Button>
        <Box>
          {step === 0 && (
            <Button
              type="submit"
              form="wizard-product-form"
              variant="contained"
              disabled={isCreatingProduct}
            >
              {isCreatingProduct ? <CircularProgress size={24} color="inherit" /> : 'Siguiente'}
            </Button>
          )}
          {step === 1 && (
            <>
              <Button onClick={handleNextStep} disabled={isCreatingVariant} sx={{ mr: 1 }}>
                Omitir
              </Button>
              <Button onClick={handleNextStep} variant="contained" disabled={isCreatingVariant || addedVariants.length === 0}>
                Siguiente
              </Button>
            </>
          )}
          {step === 2 && (
            <Button onClick={handleFinish} variant="contained" color="success" disabled={imageUploadLoading}>
              Finalizar Creación
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default ProductWizardDialog
