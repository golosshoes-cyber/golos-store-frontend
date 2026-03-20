import { useState } from 'react'
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
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { extractApiErrorMessage } from '../../utils/apiError'

export default function StoreForgotPasswordPage() {
  const theme = useTheme()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      await authService.requestPasswordReset(email)
      setIsSuccess(true)
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'No se pudo procesar la solicitud.'))
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
                <Typography variant="h4" fontWeight={900}>Recuperar Contraseña</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresa tu correo electrónico registrado y te enviaremos un enlace para que puedas elegir una nueva contraseña.
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
                    <MailOutlineRoundedIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="body1" textAlign="center">
                    Hemos enviado un enlace de recuperación a <b>{email}</b>. Por favor revisa tu bandeja de entrada o la carpeta de spam.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate('/store/login')} 
                    sx={{ fontWeight: 700 }}
                  >
                    Volver al inicio de sesión
                  </Button>
                </Stack>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField
                      required
                      type="email"
                      label="Correo Electrónico"
                      fullWidth
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />

                    <Stack spacing={1.5}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                          py: 1.2,
                          fontWeight: 800,
                          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        }}
                      >
                        {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                      </Button>
                      <Button component={RouterLink} to="/store/login" variant="text" sx={{ color: 'text.secondary' }}>
                        Cancelar y volver
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
