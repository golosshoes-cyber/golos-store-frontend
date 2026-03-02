import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Supplier } from '../../types'
import DialogShell from '../common/DialogShell'

interface SupplierDialogProps {
  open: boolean
  supplier: Supplier | null
  onClose: () => void
  onSubmit: (supplier: Partial<Supplier>) => void
  loading?: boolean
}

const SupplierDialog: React.FC<SupplierDialogProps> = ({
  open,
  supplier,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    phone: '',
    address: '',
    nit: '',
    average_price: undefined,
    is_active: true,
  })

  // Cargar datos del proveedor si se está editando
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        phone: supplier.phone || '',
        address: supplier.address || '',
        nit: supplier.nit || '',
        average_price: supplier.average_price,
        is_active: supplier.is_active,
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        nit: '',
        average_price: undefined,
        is_active: true,
      })
    }
  }, [supplier])

  const handleChange = (field: keyof Supplier, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullScreen={isMobile}
      scroll="paper"
      dialogTitle={supplier ? 'Editar Proveedor' : 'Crear Proveedor'}
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.name?.trim()}
            form="supplier-dialog-form"
          >
            {loading ? 'Guardando...' : (supplier ? 'Actualizar' : 'Crear')}
          </Button>
        </>
      }
    >
      <form id="supplier-dialog-form" onSubmit={handleSubmit}>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                fullWidth
              />
              <TextField
                label="NIT"
                value={formData.nit}
                onChange={(e) => handleChange('nit', e.target.value)}
                fullWidth
              />
            </Box>
            <TextField
              label="Dirección"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Precio Promedio"
              type="number"
              value={formData.average_price || ''}
              onChange={(e) => handleChange('average_price', e.target.value ? parseFloat(e.target.value) : undefined)}
              fullWidth
              inputProps={{ step: 0.01 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
              }
              label="Activo"
            />
          </Box>
      </form>
    </DialogShell>
  )
}

export default SupplierDialog
