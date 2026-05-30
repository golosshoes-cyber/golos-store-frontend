import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  useTheme,
  alpha,
} from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../../services/authService'
import { extractApiErrorMessage } from '../../utils/apiError'
import { CheckCircleOutline } from '@mui/icons-material'

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const theme = useTheme()

  const uid = searchParams.get('uid')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!uid || !token) {
      setError('El enlace de recuperación es inválido o está incompleto.')
    }
  }, [uid, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      setIsLoading(false)
      return
    }

    try {
      await authService.confirmPasswordReset({
        uidb64: uid as string,
        token: token as string,
        new_password: password,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(extractApiErrorMessage(err, 'No se pudo restablecer la contraseña. El enlace puede haber expirado.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Lado izquierdo con la imagen y logo */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          width: '50%',
          bgcolor: 'black',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://res.cloudinary.com/dqcycaweg/image/upload/v1750998142/My%20Brand/Golos_seynbw.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
          },
        }}
      >
        <Box sx={{ p: 4, position: 'relative', zIndex: 1, color: 'white' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: '-0.02em' }}>
            Golos Store
          </Typography>
        </Box>
      </Box>

      {/* Lado derecho con el formulario */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6, md: 8 },
          position: 'relative',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography component="h1" variant="h3" sx={{ mb: 1, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Crear nueva contraseña
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
            Ingresa tu nueva contraseña para tu cuenta.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, color: 'success.main' }}>
                <CheckCircleOutline sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                ¡Contraseña actualizada!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
              >
                Ir a Iniciar Sesión
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Nueva contraseña
                  </Typography>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    autoFocus
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError('')
                    }}
                    disabled={isLoading || !uid || !token}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        '& fieldset': { borderColor: theme.palette.divider },
                        '&:hover fieldset': { borderColor: theme.palette.text.disabled },
                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Confirmar nueva contraseña
                  </Typography>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (error) setError('')
                    }}
                    disabled={isLoading || !uid || !token}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        '& fieldset': { borderColor: theme.palette.divider },
                        '&:hover fieldset': { borderColor: theme.palette.text.disabled },
                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                      }
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || !uid || !token || !password || !confirmPassword}
                  sx={{
                    py: 1.5,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    mt: 2
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Guardar contraseña'}
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ResetPasswordPage
