import React, { useState } from 'react'
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { LoginCredentials } from '../../types'
import { extractApiErrorMessage } from '../../utils/apiError'

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
  const { login, verifyOtp } = useAuth()

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
        // Paso 1: Validar usuario y contraseña
        const response = await login(credentials)
        if (response.otp_required) {
          setIsOtpRequired(true)
          setOtpMessage(response.message || 'Se ha enviado un código a tu correo.')
        }
      } else {
        // Paso 2: Validar código OTP
        await verifyOtp(credentials.username, otpCode)
        // redirección automática por el AuthContext
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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 420,
            borderRadius: 3,
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Golos Store
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isOtpRequired ? 'Verificación de Seguridad' : 'Acceso al panel de gestión'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {isOtpRequired && otpMessage && (
            <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
              {otpMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
          >
            {!isOtpRequired ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Usuario"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={credentials.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </>
            ) : (
              <TextField
                margin="normal"
                required
                fullWidth
                id="otpCode"
                label="Código de 6 dígitos"
                name="otpCode"
                placeholder="000000"
                autoFocus
                value={otpCode}
                onChange={handleOtpChange}
                disabled={isLoading}
                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '24px', letterSpacing: '4px' } }}
              />
            )}

            <Stack spacing={1.25} sx={{ mt: 2.5 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : (isOtpRequired ? 'Verificar Código' : 'Iniciar Sesión')}
              </Button>

              {isOtpRequired && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleBack}
                  disabled={isLoading}
                  sx={{ fontSize: '0.8rem' }}
                >
                  Volver a poner contraseña
                </Button>
              )}
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage
