import React, { useMemo, useState } from 'react'
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
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { Group, Person } from '@mui/icons-material'
import type { DjangoUser, DjangoGroup, UserCreateRequest, UserUpdateRequest } from '../../types/auth'

interface UserFormSimpleProps {
  user?: DjangoUser
  availableGroups: DjangoGroup[]
  onSubmit: (userData: UserCreateRequest | UserUpdateRequest) => void
  loading?: boolean
  onCancel: () => void
}

type UserFormState = {
  username: string
  email: string
  is_staff: boolean
  password: string
  groups: number[]
}

const UserFormSimple: React.FC<UserFormSimpleProps> = ({
  user,
  availableGroups,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const isEditing = !!user

  const initialState = useMemo<UserFormState>(
    () => ({
      username: user?.username || '',
      email: user?.email || '',
      is_staff: user?.is_staff || false,
      password: '',
      groups: user?.groups?.map((g) => g.id) || [],
    }),
    [user],
  )

  const [formData, setFormData] = useState<UserFormState>(initialState)
  React.useEffect(() => {
    setFormData(initialState)
  }, [initialState])

  const handleInputChange =
    (field: 'username' | 'email' | 'password') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleStaffChange = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_staff: checked,
    }))
  }

  const handleGroupChange = (event: SelectChangeEvent<number[]>) => {
    const rawValue = event.target.value
    const groups = Array.isArray(rawValue)
      ? rawValue.map((id) => Number(id))
      : String(rawValue)
          .split(',')
          .map((id) => Number(id.trim()))
          .filter((id) => Number.isFinite(id))

    const uniqueGroups = Array.from(new Set(groups.filter((id) => Number.isFinite(id))))

    setFormData((prev) => ({
      ...prev,
      groups: uniqueGroups,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isEditing) {
      const payload: UserUpdateRequest = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        is_staff: formData.is_staff,
        groups: formData.groups,
      }
      onSubmit(payload)
      return
    }

    const payload: UserCreateRequest = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      is_staff: formData.is_staff,
      password: formData.password,
      groups: formData.groups,
    }
    onSubmit(payload)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre de Usuario"
            value={formData.username}
            onChange={handleInputChange('username')}
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
            onChange={handleInputChange('email')}
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
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={loading}
              required
              inputProps={{ minLength: 8 }}
              helperText="Mínimo 8 caracteres"
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <FormControlLabel
              control={<Switch checked={formData.is_staff} onChange={handleStaffChange} disabled={loading} />}
              label="Es Staff"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Grupos</InputLabel>
            <Select
              multiple
              value={formData.groups}
              onChange={handleGroupChange}
              disabled={loading}
              label="Grupos"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).filter((value) => Number.isFinite(value)).map((value) => {
                    const group = availableGroups.find((g) => g.id === value)
                    return <Chip key={`group-${value}`} label={group?.name || String(value)} icon={<Group />} size="small" />
                  })}
                </Box>
              )}
            >
              {availableGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Group fontSize="small" />
                    <Typography variant="body2">{group.name}</Typography>
                    <Chip size="small" label={`${group.permissions?.length || 0} permisos`} color="primary" />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={onCancel} disabled={loading} variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading} startIcon={isEditing ? <Person /> : <Group />}>
              {loading ? 'Guardando...' : isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserFormSimple



