import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Paper,
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
} from '@mui/material'
import type { PurchaseItem, VariantOption } from '../../types/purchases'
import type { ProductVariant, Supplier, Product } from '../../types'
import PurchaseHeader from './PurchaseHeader'
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
  onClearAll,
  onAddItem,
  onItemChange,
  onVariantChange,
  onRemoveItem,
  onSubmit,
}) => {
  const handleDialogEnter = () => {
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) {
      activeElement.blur()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      TransitionProps={{ onEnter: handleDialogEnter }}
    >
      <DialogContent>
        <PurchaseHeader
          itemCount={purchaseItems.length}
          onClearAll={onClearAll}
          onAddItem={onAddItem}
          isMobile={isMobile}
        />

        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Items de la Compra
          </Typography>

          {purchaseItems.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No hay items agregados. Haz clic en "Agregar Item" para comenzar.
            </Typography>
          ) : (
            <>
              {/* Vista Desktop - Tabla */}
              {!isMobile && (
                <TableContainer>
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
                                  onChange={(e) => onItemChange(index, 'newProductId', e.target.value)}
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
                                  onChange={(e) => onItemChange(index, 'newSize', e.target.value)}
                                  size="small"
                                />
                                <TextField
                                  label="Color"
                                  value={item.newColor}
                                  onChange={(e) => onItemChange(index, 'newColor', e.target.value)}
                                  size="small"
                                />
                                <TextField
                                  select
                                  label="Género"
                                  value={item.newGender}
                                  onChange={(e) => onItemChange(index, 'newGender', e.target.value)}
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
                              onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
                              size="small"
                              inputProps={{ min: 1 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => onItemChange(index, 'unitCost', e.target.value)}
                              size="small"
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              select
                              value={item.supplierId}
                              onChange={(e) => onItemChange(index, 'supplierId', e.target.value)}
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
                      onVariantChange={(index, variantId) => onVariantChange(index, variantId, variants)}
                      onRemove={onRemoveItem}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
          
          {purchaseItems.length > 0 && (
            <Box mt={3} display="flex" justifyContent="flex-end">
              <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                style={{
                  padding: '8px 32px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? 'Procesando...' : 'Crear Compra'}
              </button>
            </Box>
          )}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreatePurchaseDialog
