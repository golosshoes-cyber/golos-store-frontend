import { useState, useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../../services/authService'
import { extractApiErrorMessage } from '../../utils/apiError'

export default function StoreResetPasswordPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [uid, setUid] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const urlUid = searchParams.get('uid')
    const urlToken = searchParams.get('token')
    
    if (urlUid && urlToken) {
      setUid(urlUid)
      setToken(urlToken)
    } else {
      setErrorMessage('Enlace no válido. Por favor solicita un nuevo restablecimiento de contraseña.')
    }
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)

    if (!uid || !token) {
        setErrorMessage('El enlace de restablecimiento está incompleto.')
        return
    }

    if (newPassword !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.')
        return
    }

    if (newPassword.length < 8) {
        setErrorMessage('La contraseña debe tener al menos 8 caracteres.')
        return
    }

    setLoading(true)
    try {
      await authService.confirmPasswordReset({
          uidb64: uid,
          token: token,
          new_password: newPassword
      })
      setIsSuccess(true)
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'El enlace ha expirado o es inválido. Solicita uno nuevo.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          py: { xs: 4, md: 7 },
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(150deg, #eef2ff 0%, #f8fafc 45%, #ecfeff 100%)'
              : 'linear-gradient(150deg, #0b1220 0%, #111827 45%, #0f172a 100%)',
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.22),
              top: -50,
              right: -30,
              filter: 'blur(20px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.info.main, 0.18),
              bottom: -20,
              left: -20,
              filter: 'blur(16px)',
            }}
          />

          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              position: 'relative',
              backdropFilter: 'blur(12px) saturate(130%)',
              backgroundColor: alpha(theme.palette.background.paper, 0.72),
              borderColor: alpha(theme.palette.primary.main, 0.24),
              boxShadow: `0 18px 42px ${alpha(theme.palette.common.black, 0.2)}`,
            }}
          >
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h4" fontWeight={900}>Nueva Contraseña</Typography>
                <Typography variant="body2" color="text.secondary">
                  Por favor, ingresa tu nueva contraseña segura para recuperar el acceso a tu cuenta.
                </Typography>
              </Stack>

              {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>}

              {isSuccess ? (
                <Stack spacing={3} alignItems="center" sx={{ py: 2 }}>
                  <Box 
                    sx={{ 
                      width: 64, height: 64, borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main 
                    }}
                  >
                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="body1" textAlign="center">
                    Tu contraseña ha sido restablecida exitosamente.
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/store/login')} 
                    sx={{ fontWeight: 700, py: 1.2 }}
                  >
                    Iniciar Sesión Ahora
                  </Button>
                </Stack>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField
                      required
                      type="password"
                      label="Nueva Contraseña"
                      fullWidth
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      helperText="Mínimo 8 caracteres."
                    />
                    <TextField
                      required
                      type="password"
                      label="Confirmar Nueva Contraseña"
                      fullWidth
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />

                    <Stack spacing={1.5} sx={{ pt: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading || !uid || !token}
                        startIcon={<VpnKeyRoundedIcon />}
                        sx={{
                          py: 1.2,
                          fontWeight: 800,
                          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        }}
                      >
                        {loading ? 'Guardando...' : 'Restablecer Contraseña'}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
