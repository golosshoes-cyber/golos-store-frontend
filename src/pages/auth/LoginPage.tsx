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
  IconButton,
  InputAdornment,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LoginCredentials } from '../../types'
import { extractApiErrorMessage } from '../../utils/apiError'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  })
  const [otpCode, setOtpCode] = useState('')
  const [isOtpRequired, setIsOtpRequired] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
    if (error) setError('')
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(e.target.value)
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!isOtpRequired) {
        const response = await login(credentials)
        if (response.otp_required) {
          setIsOtpRequired(true)
          setOtpMessage(response.message || 'Se ha enviado un código a tu correo.')
        }
      } else {
        await verifyOtp(credentials.username, otpCode)
      }
    } catch (err: any) {
      setError(extractApiErrorMessage(err, 'Error al iniciar sesión. Verifica tus credenciales.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setIsOtpRequired(false)
    setOtpCode('')
    setError('')
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
          <Box sx={{ mb: 6, display: { xs: 'block', md: 'none' } }}>
            <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: '-0.02em' }}>
              Golos Store
            </Typography>
          </Box>

          <Typography component="h1" variant="h3" sx={{ mb: 1, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {isOtpRequired ? 'Verificación' : 'Bienvenido'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
            {isOtpRequired 
              ? 'Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.' 
              : 'Ingresa tus credenciales para acceder al panel de gestión.'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {isOtpRequired && otpMessage && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              {otpMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {!isOtpRequired ? (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Usuario
                  </Typography>
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    placeholder="Tu nombre de usuario"
                    value={credentials.username}
                    onChange={handleChange}
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

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Contraseña
                    </Typography>
                    <Typography 
                      variant="caption" 
                      component="button"
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      sx={{ 
                        color: theme.palette.primary.main, 
                        fontWeight: 600, 
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((show) => !show)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
              </Stack>
            ) : (
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block' }}>
                  Código de 6 dígitos
                </Typography>
                <TextField
                  fullWidth
                  id="otpCode"
                  name="otpCode"
                  placeholder="000000"
                  autoFocus
                  value={otpCode}
                  onChange={handleOtpChange}
                  disabled={isLoading}
                  variant="outlined"
                  inputProps={{ 
                    maxLength: 6, 
                    style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' } 
                  }}
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
            )}

            <Stack spacing={2} sx={{ mt: 4 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || (!isOtpRequired && (!credentials.username || !credentials.password)) || (isOtpRequired && otpCode.length < 6)}
                sx={{
                  py: 1.5,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : (isOtpRequired ? 'Verificar Código' : 'Iniciar Sesión')}
              </Button>

              {isOtpRequired && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleBack}
                  disabled={isLoading}
                  sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                  Volver y usar otra cuenta
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
