import { useEffect, useState } from 'react'
import { Autocomplete, CircularProgress, Stack, TextField, Typography } from '@mui/material'
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
    if (address.department_code) {
      void loadCities(address.department_code)
    }
  }, [address.department, loadCities])

  const handleDepartmentChange = (selection: { code: string, name: string } | null) => {
    const newAddress = {
      ...address,
      department: selection?.name || '',
      department_code: selection?.code || '',
      city: '',
      city_code: ''
    }
    setAddress(newAddress)
    onChange(newAddress)
  }

  const handleCityChange = (selection: { code: string, name: string } | null) => {
    const newAddress = {
      ...address,
      city: selection?.name || '',
      city_code: selection?.code || ''
    }
    setAddress(newAddress)
    onChange(newAddress)
  }

  const handleChange = (field: keyof StoreShippingAddress, value: string) => {
    const newAddress = { ...address, [field]: value }
    setAddress(newAddress)
    onChange(newAddress)
  }

  const selectedDepartment = departments.find(d => d.name === address.department || d.code === address.department_code) || null
  const selectedCity = cities.find(c => c.name === address.city || c.code === address.city_code) || null

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>Dirección de envío</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Autocomplete
          fullWidth
          size="small"
          loading={loading}
          options={departments}
          getOptionLabel={(option) => option.name}
          value={selectedDepartment}
          onChange={(_, newValue) => handleDepartmentChange(newValue)}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Departamento *"
              placeholder="Busca..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Autocomplete
          fullWidth
          size="small"
          loading={loading}
          disabled={!address.department}
          options={cities}
          getOptionLabel={(option) => option.name}
          value={selectedCity}
          onChange={(_, newValue) => handleCityChange(newValue)}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ciudad *"
              placeholder={address.department ? "Busca tu ciudad..." : "Primero elige departamento"}
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
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
