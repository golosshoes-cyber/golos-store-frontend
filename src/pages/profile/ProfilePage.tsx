import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Person as PersonIcon } from '@mui/icons-material'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/authService'
import { extractApiErrorMessage } from '../../utils/apiError'

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [profileForm, setProfileForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    setProfileForm({
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    })
  }, [user])

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true)
      setMessage(null)
      await authService.updateCurrentUser(profileForm)
      await refreshUser()
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: extractApiErrorMessage(error, 'No se pudo actualizar el perfil.'),
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setMessage({ type: 'error', text: 'La nueva contraseña y la confirmación no coinciden.' })
      return
    }
    try {
      setSavingPassword(true)
      setMessage(null)
      await authService.changeMyPassword(passwordForm.old_password, passwordForm.new_password)
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
      })
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: extractApiErrorMessage(error, 'No se pudo cambiar la contraseña.'),
      })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Mi Perfil"
        subtitle="Gestiona tu información personal y credenciales"
        icon={<PersonIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      />

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Datos personales
          </Typography>
          <Stack spacing={2}>
            <TextField label="Usuario" value={user?.username || ''} disabled fullWidth />
            <TextField
              label="Email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
              fullWidth
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nombres"
                value={profileForm.first_name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, first_name: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Apellidos"
                value={profileForm.last_name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, last_name: e.target.value }))}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleSaveProfile} variant="contained" disabled={savingProfile}>
                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Cambiar contraseña
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Contraseña actual"
              type="password"
              value={passwordForm.old_password}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, old_password: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Nueva contraseña"
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, new_password: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Confirmar nueva contraseña"
              type="password"
              value={passwordForm.confirm_new_password}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm_new_password: e.target.value }))}
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleChangePassword} variant="contained" disabled={savingPassword}>
                {savingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </PageShell>
  )
}

export default ProfilePage
