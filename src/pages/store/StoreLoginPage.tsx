import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { extractApiErrorMessage } from '../../utils/apiError'
import type { LoginCredentials } from '../../types'

export default function StoreLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const { login } = useAuth()

  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      await login(credentials)
      const nextPath = searchParams.get('next') || '/store/account'
      navigate(nextPath.startsWith('/') ? nextPath : '/store/account', { replace: true })
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'No se pudo iniciar sesion.'))
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
          <Stack spacing={2.25}>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={900}>Bienvenido de vuelta</Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresa para ver tus pedidos y comprar mas rapido.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip size="small" icon={<ShieldRoundedIcon />} label="Sesion segura" />
              <Chip size="small" icon={<BoltRoundedIcon />} label="Acceso rapido" />
              <Chip size="small" icon={<LocalMallRoundedIcon />} label="Seguimiento de pedidos" />
            </Stack>

            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={1.5}>
                <TextField
                  required
                  label="Usuario"
                  value={credentials.username}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
                />
                <TextField
                  required
                  type="password"
                  label="Contrasena"
                  value={credentials.password}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<LoginRoundedIcon />}
                    disabled={loading}
                    sx={{
                      minWidth: 150,
                      fontWeight: 800,
                      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    }}
                  >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                  </Button>
                  <Button
                    component={RouterLink}
                    to={`/store/register${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next') || '')}` : ''}`}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  >
                    Crear cuenta
                  </Button>
                </Stack>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                  <Button 
                    component={RouterLink} 
                    to="/store/forgot-password" 
                    variant="text" 
                    size="small"
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                  <Button component={RouterLink} to="/store" variant="text" size="small">
                    Volver a la tienda
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
      </Box>
    </Box>
  )
}
