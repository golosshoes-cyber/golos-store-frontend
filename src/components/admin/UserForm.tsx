 import React, { useState } from 'react'
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Alert,
} from '@mui/material'
import { Group, Person } from '@mui/icons-material'
import type { 
  DjangoUser, 
  DjangoGroup, 
  UserCreateRequest, 
  UserUpdateRequest 
} from '../../types/auth'

interface UserFormProps {
  user?: DjangoUser
  availableGroups: DjangoGroup[]
  onSubmit: (userData: UserCreateRequest | UserUpdateRequest) => void
  loading?: boolean
  onCancel: () => void
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  availableGroups,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<UserCreateRequest & { password?: string }>({
    username: user?.username || '',
    email: user?.email || '',
    is_staff: user?.is_staff || false,
    password: '',
    groups: user?.groups?.map(g => g.id) || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleGroupChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      groups: event.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isEditing = !!user

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Información Básica */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre de Usuario"
            value={formData.username}
            onChange={(_e) => handleChange('username')}
            error={!!errors.username}
            helperText={errors.username}
            disabled={loading}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(_e) => handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
            required
          />
        </Grid>
        
        {!isEditing && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={(formData as UserCreateRequest).password || ''}
              onChange={(_e) => handleChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              required={!isEditing}
            />
          </Grid>
        )}
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_staff}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    is_staff: e.target.checked
                  }))}
                  disabled={loading}
                />
              }
              label="Es Staff"
            />
          </FormControl>
        </Grid>
        
        {/* Grupos */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Grupos</InputLabel>
            <Select
              multiple
              value={formData.groups || []}
              onChange={handleGroupChange}
              disabled={loading}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value: number) => {
                    const group = availableGroups.find(g => g.id === value)
                    return (
                      <Chip
                        key={value}
                        label={group?.name || value}
                        icon={<Group />}
                        size="small"
                      />
                    )
                  })}
                </Box>
              )}
            >
              {availableGroups.map(group => (
                <MenuItem key={group.id} value={group.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Group fontSize="small" />
                    <Typography variant="body2">{group.name}</Typography>
                    <Chip 
                      size="small" 
                      label={`${group.permissions?.length || 0} permisos`} 
                      color="primary" 
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Errores generales */}
        {Object.keys(errors).length > 0 && (
          <Grid item xs={12}>
            <Alert severity="error">
              Por favor corrige los errores antes de continuar
            </Alert>
          </Grid>
        )}
        
        {/* Botones de acción */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              onClick={onCancel}
              disabled={loading}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={isEditing ? <Person /> : <Group />}
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserForm
