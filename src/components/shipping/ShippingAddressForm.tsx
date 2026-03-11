import { useEffect, useState } from 'react'
import { CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useLocations } from '../../hooks/useLocations'
import type { StoreShippingAddress } from '../../types/store'

interface ShippingAddressFormProps {
  initialAddress: StoreShippingAddress
  onChange: (address: StoreShippingAddress) => void
}

export default function ShippingAddressForm({ initialAddress, onChange }: ShippingAddressFormProps) {
  const { departments, cities, loading, loadDepartments, loadCities } = useLocations()
  const [address, setAddress] = useState<StoreShippingAddress>(initialAddress)

  useEffect(() => {
    void loadDepartments()
  }, [loadDepartments])

  useEffect(() => {
    if (address.department) {
      void loadCities(address.department)
    }
  }, [address.department, loadCities])

  const handleChange = (field: keyof StoreShippingAddress, value: string) => {
    const newAddress = { ...address, [field]: value }
    if (field === 'department') {
      newAddress.city = '' // Reset city when department changes
    }
    setAddress(newAddress)
    onChange(newAddress)
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">Dirección de envío</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          select
          label="Departamento"
          size="small"
          value={address.department}
          onChange={(event) => handleChange('department', event.target.value)}
          fullWidth
          required
          disabled={loading}
          helperText={loading ? <CircularProgress size={14} /> : ''}
        >
          {departments.map((dep) => (
            <MenuItem key={dep.code} value={dep.code}>
              {dep.name}
            </MenuItem>
          ))}
          {departments.length === 0 && <MenuItem value={address.department}>{address.department || 'Selecciona...'}</MenuItem>}
        </TextField>
        <TextField
          select
          label="Ciudad"
          size="small"
          value={address.city}
          onChange={(event) => handleChange('city', event.target.value)}
          fullWidth
          required
          disabled={loading || !address.department}
        >
          {cities.map((city) => (
            <MenuItem key={city.code} value={city.code}>
              {city.name}
            </MenuItem>
          ))}
          {cities.length === 0 && <MenuItem value={address.city}>{address.city || 'Selecciona...'}</MenuItem>}
        </TextField>
      </Stack>
      <TextField
        label="Dirección principal"
        size="small"
        placeholder="Ej. Calle 123 #45-67"
        value={address.address_line1}
        onChange={(event) => handleChange('address_line1', event.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Complemento (opcional)"
        size="small"
        placeholder="Apto, Torre, Conjunto..."
        value={address.address_line2 || ''}
        onChange={(event) => handleChange('address_line2', event.target.value)}
        fullWidth
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          label="Nombre del receptor"
          size="small"
          value={address.recipient_name}
          onChange={(event) => handleChange('recipient_name', event.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Teléfono del receptor"
          size="small"
          type="tel"
          value={address.recipient_phone}
          onChange={(event) => handleChange('recipient_phone', event.target.value)}
          fullWidth
          required
          error={!!address.recipient_phone && !/^\d{7,15}$/.test(address.recipient_phone.trim())}
          helperText={!!address.recipient_phone && !/^\d{7,15}$/.test(address.recipient_phone.trim()) ? 'Número inválido' : ''}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          label="Referencia (opcional)"
          size="small"
          placeholder="Cerca a..."
          value={address.reference || ''}
          onChange={(event) => handleChange('reference', event.target.value)}
          fullWidth
        />
        <TextField
          label="Código postal (opcional)"
          size="small"
          value={address.postal_code || ''}
          onChange={(event) => handleChange('postal_code', event.target.value)}
          fullWidth
        />
      </Stack>
    </Stack>
  )
}
