import React, { useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { extractApiErrorMessage } from '../../utils/apiError'
import { ArrowBack } from '@mui/icons-material'

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await authService.requestPasswordReset(email)
      setSuccess(true)
    } catch (err: any) {
      setError(extractApiErrorMessage(err, 'No se pudo procesar la solicitud. Verifica tu conexión.'))
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
          <Button
            startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/login')}
            sx={{ mb: 4, color: 'text.secondary', '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
            variant="text"
          >
            Volver al inicio de sesión
          </Button>

          <Typography component="h1" variant="h3" sx={{ mb: 1, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Recuperar contraseña
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Correo electrónico
                  </Typography>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@golosshoes.com"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    disabled={isLoading}
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
                  disabled={isLoading || !email}
                  sx={{
                    py: 1.5,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar enlace'}
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ForgotPasswordPage
