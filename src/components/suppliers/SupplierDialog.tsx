import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
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
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullScreen={isMobile}
      scroll="paper"
      dialogTitle={supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      subtitle={supplier ? 'Modifica los datos del proveedor' : 'Agrega un nuevo proveedor'}
      actions={
        <>
          <Button
            onClick={onClose}
            disabled={loading}
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 2,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              '&:hover': { borderColor: 'text.disabled', color: 'text.primary' },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="supplier-dialog-form"
            disabled={loading || !formData.name?.trim()}
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
            {loading ? <CircularProgress size={16} color="inherit" /> : (supplier ? 'Actualizar' : 'Crear proveedor')}
          </Button>
        </>
      }
    >
      <form id="supplier-dialog-form" onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          size="small"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          fullWidth
          autoFocus
          disabled={loading}
          sx={{ mb: 1.5 }}
          InputLabelProps={{ sx: { fontSize: '12px' } }}
          InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
          <TextField
            label="Teléfono"
            size="small"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            fullWidth
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
          <TextField
            label="NIT"
            size="small"
            value={formData.nit}
            onChange={(e) => handleChange('nit', e.target.value)}
            fullWidth
            disabled={loading}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
        </Box>
        <TextField
          label="Dirección"
          size="small"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          multiline
          rows={2}
          fullWidth
          disabled={loading}
          sx={{ mb: 1.5 }}
          InputLabelProps={{ sx: { fontSize: '12px' } }}
          InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, alignItems: 'center' }}>
          <TextField
            label="Precio Promedio"
            size="small"
            type="number"
            value={formData.average_price || ''}
            onChange={(e) => handleChange('average_price', e.target.value ? parseFloat(e.target.value) : undefined)}
            fullWidth
            disabled={loading}
            inputProps={{ step: 0.01 }}
            InputLabelProps={{ sx: { fontSize: '12px' } }}
            InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                size="small"
              />
            }
            label={<Box component="span" sx={{ fontSize: '12px' }}>Activo</Box>}
          />
        </Box>
      </form>
    </DialogShell>
  )
}

export default SupplierDialog
