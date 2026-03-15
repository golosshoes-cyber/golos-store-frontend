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
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import { extractApiErrorMessage } from '../../utils/apiError'
import StoreHeader from '../../components/store/StoreHeader'
import StoreFooter from '../../components/store/StoreFooter'

export default function StoreRegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const { refreshUser } = useAuth()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await storeService.registerCustomer(form)
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      await refreshUser()
      const nextPath = searchParams.get('next') || '/store/account'
      navigate(nextPath.startsWith('/') ? nextPath : '/store/account', { replace: true })
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'No se pudo registrar la cuenta.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <StoreHeader showCart={false} />
      <Box
        sx={{
          flex: 1,
          py: { xs: 4, md: 7 },
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(150deg, #ecfeff 0%, #f8fafc 45%, #eef2ff 100%)'
              : 'linear-gradient(150deg, #0f172a 0%, #111827 45%, #0b1220 100%)',
        }}
      >
      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.info.main, 0.22),
            top: -50,
            left: -20,
            filter: 'blur(20px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
            bottom: -20,
            right: -20,
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
            borderColor: alpha(theme.palette.info.main, 0.24),
            boxShadow: `0 18px 42px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        >
          <Stack spacing={2.25}>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={900}>Crea tu cuenta</Typography>
              <Typography variant="body2" color="text.secondary">
                Registrate en menos de un minuto y haz seguimiento de cada pedido.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip size="small" icon={<VerifiedUserRoundedIcon />} label="Cuenta segura" />
              <Chip size="small" icon={<TrackChangesRoundedIcon />} label="Tracking en tiempo real" />
              <Chip size="small" icon={<AutoAwesomeRoundedIcon />} label="Experiencia premium" />
            </Stack>

            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={1.5}>
                <TextField
                  required
                  label="Usuario"
                  value={form.username}
                  onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                />
                <TextField
                  required
                  type="email"
                  label="Email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={form.first_name}
                    onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                  />
                  <TextField
                    fullWidth
                    label="Apellido"
                    value={form.last_name}
                    onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                  />
                </Stack>
                <TextField
                  required
                  type="password"
                  label="Contrasena"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<PersonAddAltRoundedIcon />}
                    disabled={loading}
                    sx={{
                      minWidth: 170,
                      fontWeight: 800,
                      backgroundImage: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                    }}
                  >
                    {loading ? 'Creando...' : 'Crear cuenta'}
                  </Button>
                  <Button
                    component={RouterLink}
                    to={`/store/login${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next') || '')}` : ''}`}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  >
                    Ya tengo cuenta
                  </Button>
                  <Button component={RouterLink} to="/store" variant="text">
                    Volver
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
      </Box>
      <StoreFooter />
    </Box>
  )
}
