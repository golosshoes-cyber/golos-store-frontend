import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import DialogShell from '../common/DialogShell'
import type { DjangoGroup, DjangoPermission } from '../../types/auth'

interface GroupDialogProps {
  open: boolean
  group: DjangoGroup | null
  permissions: DjangoPermission[]
  loading?: boolean
  onClose: () => void
  onSubmit: (payload: { name: string; permissions: number[] }) => void
}

const GroupDialog: React.FC<GroupDialogProps> = ({
  open,
  group,
  permissions,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme()
  const [name, setName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

  useEffect(() => {
    if (!open) return
    setName(group?.name || '')
    setSelectedPermissions(group?.permissions?.map((p) => p.id) || [])
  }, [open, group])

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit({ name: trimmed, permissions: selectedPermissions })
  }

  return (
    <DialogShell
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      dialogTitle={group ? 'Editar Grupo' : 'Nuevo Grupo'}
      subtitle="Configura nombre y permisos del rol"
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
            onClick={handleSave}
            disabled={loading || !name.trim()}
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
            {loading ? <CircularProgress size={16} color="inherit" /> : (group ? 'Actualizar' : 'Crear grupo')}
          </Button>
        </>
      }
    >
      <TextField
        label="Nombre del Grupo"
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        autoFocus
        disabled={loading}
        sx={{ mb: 2 }}
        InputLabelProps={{ sx: { fontSize: '12px' } }}
        InputProps={{ sx: { fontSize: '13px', borderRadius: 1.5 } }}
      />

      {permissions.length > 0 ? (
        <Box sx={{
          bgcolor: alpha(theme.palette.text.primary, 0.02),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
        }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
            Permisos
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="permissions-label" sx={{ fontSize: '12px' }}>Seleccionar permisos</InputLabel>
            <Select
              labelId="permissions-label"
              multiple
              value={selectedPermissions}
              onChange={(e) => setSelectedPermissions(e.target.value as number[])}
              input={<OutlinedInput label="Seleccionar permisos" sx={{ borderRadius: 1.5, fontSize: '13px' }} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const permission = permissions.find((p) => p.id === id)
                    return (
                      <Chip 
                        key={id} 
                        size="small" 
                        label={permission?.codename || id} 
                        sx={{ 
                          height: 22, 
                          fontSize: '10px',
                          borderRadius: '4px',
                          bgcolor: alpha(theme.palette.text.primary, 0.05),
                          fontWeight: 600,
                          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        }} 
                      />
                    )
                  })}
                </Box>
              )}
            >
              {permissions.map((permission) => (
                <MenuItem key={permission.id} value={permission.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '12px' }}>{permission.name}</Typography>
                    <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>{permission.codename}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box sx={{
          bgcolor: alpha(theme.palette.text.primary, 0.02),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
        }}>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            Este backend no expone permisos por API. Puedes crear/editar nombres de grupos.
          </Typography>
        </Box>
      )}
    </DialogShell>
  )
}

export default GroupDialog
