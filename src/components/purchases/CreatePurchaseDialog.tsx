import React from 'react'
import {
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material'
import type { PurchaseItem, VariantOption } from '../../types/purchases'
import type { ProductVariant, Supplier, Product } from '../../types'
import DialogShell from '../common/DialogShell'
import PurchaseItemCard from './PurchaseItemCard'

interface CreatePurchaseDialogProps {
  open: boolean
  onClose: () => void
  purchaseItems: PurchaseItem[]
  variantOptions: VariantOption[]
  allProducts: Product[]
  suppliers: Supplier[]
  variants: ProductVariant[]
  isLoading: boolean
  isMobile: boolean
  onClearAll: () => void
  onAddItem: () => void
  onItemChange: (index: number, field: string, value: any) => void
  onVariantChange: (index: number, variantId: string, variants: ProductVariant[]) => void
  onRemoveItem: (index: number) => void
  onSubmit: () => void
  paymentMethod: string
  onPaymentMethodChange: (val: string) => void
}

const CreatePurchaseDialog: React.FC<CreatePurchaseDialogProps> = ({
  open,
  onClose,
  purchaseItems,
  variantOptions,
  allProducts,
  suppliers,
  variants,
  isLoading,
  isMobile,
  paymentMethod,
  onPaymentMethodChange,
  onClearAll,
  onAddItem,
  onItemChange,
  onVariantChange,
  onRemoveItem,
  onSubmit,
}) => {
  const theme = useTheme()

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      dialogTitle="Nueva Compra"
      subtitle="Registrar entrada de inventario (puedes agregar múltiples items)"
      actions={
        <>
          <Button onClick={onClose} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: '12px' }}>
            Cancelar
          </Button>
          {purchaseItems.length > 0 && (
            <Button
              onClick={onSubmit}
              variant="contained"
              size="small"
              disabled={isLoading}
              sx={{ 
                bgcolor: 'text.primary', 
                color: 'background.default',
                borderRadius: 1.5,
                fontSize: '12px',
                px: 3,
                '&:hover': { bgcolor: 'text.secondary' }
              }}
            >
              {isLoading ? 'Procesando...' : 'Crear Compra'}
            </Button>
          )}
        </>
      }
    >
      <Box sx={{ mb: 4, p: 2, bgcolor: alpha(theme.palette.text.primary, 0.02), borderRadius: 2, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        <Box sx={{ minWidth: 200, flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block', textTransform: 'uppercase', color: 'text.secondary' }}>
            Origen de los Fondos *
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <MenuItem value="cash">Efectivo (Caja Abierta)</MenuItem>
            <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
            <MenuItem value="credit">Crédito a Proveedor</MenuItem>
            <MenuItem value="none">Sin registrar pago (Solo Stock)</MenuItem>
          </TextField>
        </Box>
        
        <Box sx={{ flex: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          {purchaseItems.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={onClearAll}
              size="small"
              sx={{ borderRadius: 1.5, fontSize: '12px' }}
            >
              Limpiar Todo
            </Button>
          )}
          <Button
            variant="contained"
            onClick={onAddItem}
            size="small"
            sx={{ 
              bgcolor: 'text.primary', 
              color: 'background.default',
              borderRadius: 1.5, 
              fontSize: '12px',
              '&:hover': { bgcolor: 'text.secondary' }
            }}
          >
            + Agregar Item
          </Button>
        </Box>
      </Box>

      <Box 
        sx={{ 
          p: 0,
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="overline" 
          sx={{ 
            display: 'block', 
            mb: 2, 
            fontWeight: 600, 
            color: 'text.secondary',
            letterSpacing: '1px'
          }}
        >
          Detalle de Items
        </Typography>

        {purchaseItems.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8, fontSize: '14px', border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
            No hay items agregados. Haz clic en "Agregar Item" para comenzar.
          </Typography>
        ) : (
            <>
              {/* Vista Desktop - Tabla */}
              {!isMobile && (
                <TableContainer sx={{ boxShadow: 'none', border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nueva</TableCell>
                        <TableCell>Variante</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Costo Unitario</TableCell>
                        <TableCell>Proveedor</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchaseItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.isNew}
                                  onChange={(e) => onItemChange(index, 'isNew', e.target.checked)}
                                />
                              }
                              label="Nueva"
                            />
                          </TableCell>
                          <TableCell sx={{ minWidth: 250 }}>
                            {item.isNew ? (
                              <Box display="flex" flexDirection="column" gap={1}>
                                <TextField
                                  select
                                  label="Producto"
                                  value={item.newProductId}
                                  onChange={(e: any) => onItemChange(index, 'newProductId', e.target.value)}
                                  size="small"
                                  fullWidth
                                >
                                  {allProducts.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                      {product.name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField
                                  label="Talla"
                                  value={item.newSize}
                                  onChange={(e: any) => onItemChange(index, 'newSize', e.target.value)}
                                  size="small"
                                />
                                <TextField
                                  label="Color"
                                  value={item.newColor}
                                  onChange={(e: any) => onItemChange(index, 'newColor', e.target.value)}
                                  size="small"
                                />
                                <TextField
                                  select
                                  label="Género"
                                  value={item.newGender}
                                  onChange={(e: any) => onItemChange(index, 'newGender', e.target.value)}
                                  size="small"
                                >
                                  <MenuItem value="male">Masculino</MenuItem>
                                  <MenuItem value="female">Femenino</MenuItem>
                                  <MenuItem value="unisex">Unisex</MenuItem>
                                </TextField>
                              </Box>
                            ) : (
                              <Autocomplete
                                options={variantOptions}
                                getOptionLabel={(option) => option.label}
                                value={variantOptions.find(v => v.id === parseInt(item.variantId)) || null}
                                onChange={(_, newValue) => {
                                  onVariantChange(index, newValue ? newValue.id.toString() : '', variants)
                                }}
                                renderInput={(params) => <TextField {...params} size="small" />}
                                fullWidth
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e: any) => onItemChange(index, 'quantity', e.target.value)}
                              size="small"
                              inputProps={{ min: 1 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.unitCost}
                              onChange={(e: any) => onItemChange(index, 'unitCost', e.target.value)}
                              size="small"
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              select
                              value={item.supplierId}
                              onChange={(e: any) => onItemChange(index, 'supplierId', e.target.value)}
                              size="small"
                              sx={{ width: 120 }}
                            >
                              <MenuItem value="">
                                <em>Sin proveedor</em>
                              </MenuItem>
                              {suppliers.map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <Button onClick={() => onRemoveItem(index)} color="error">
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Vista Mobile - Cards */}
              {isMobile && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {purchaseItems.map((item, index) => (
                    <PurchaseItemCard
                      key={index}
                      item={item}
                      index={index}
                      variantOptions={variantOptions}
                      allProducts={allProducts}
                      suppliers={suppliers}
                      onItemChange={onItemChange}
                      onVariantChange={(index: number, variantId: string) => onVariantChange(index, variantId, variants)}
                      onRemove={onRemoveItem}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
      </Box>
    </DialogShell>
  )
}

export default CreatePurchaseDialog
