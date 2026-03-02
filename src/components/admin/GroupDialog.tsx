import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { GroupWork as GroupWorkIcon } from '@mui/icons-material'
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
      maxWidth="md"
      header={
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
          }}
        >
          <GroupWorkIcon />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {group ? 'Editar Grupo' : 'Crear Grupo'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Configura nombre y permisos del rol
            </Typography>
          </Box>
        </Box>
      }
      headerInTitle={false}
      actions={
        <>
          <Button onClick={onClose} disabled={loading} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || !name.trim()} variant="contained">
            {loading ? 'Guardando...' : group ? 'Actualizar' : 'Crear'}
          </Button>
        </>
      }
    >
      <Stack spacing={2.2}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <TextField
            label="Nombre del Grupo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
            disabled={loading}
          />
        </Paper>

        <Divider />

        {permissions.length > 0 ? (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="permissions-label">Permisos</InputLabel>
              <Select
                labelId="permissions-label"
                multiple
                value={selectedPermissions}
                onChange={(e) => setSelectedPermissions(e.target.value as number[])}
                input={<OutlinedInput label="Permisos" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const permission = permissions.find((p) => p.id === id)
                      return <Chip key={id} size="small" label={permission?.codename || id} />
                    })}
                  </Box>
                )}
              >
                {permissions.map((permission) => (
                  <MenuItem key={permission.id} value={permission.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{permission.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {permission.codename}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Este backend no expone permisos por API. Puedes crear/editar nombres de grupos.
            </Typography>
          </Paper>
        )}
      </Stack>
    </DialogShell>
  )
}

export default GroupDialog
