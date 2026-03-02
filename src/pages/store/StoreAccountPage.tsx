import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { storeService } from '../../services/storeService'
import type { StoreOrder } from '../../types/store'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const statusColor = (status: string): 'default' | 'warning' | 'success' | 'error' => {
  const normalized = status.toLowerCase()
  if (['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(normalized)) return 'success'
  if (normalized === 'pending') return 'warning'
  if (normalized === 'canceled') return 'error'
  return 'default'
}

export default function StoreAccountPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/store/login', { replace: true })
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setErrorMessage(null)
        const response = await storeService.getMyOrders()
        setOrders(response.orders)
      } catch {
        setErrorMessage('No se pudo cargar tu historial de pedidos.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/store', { replace: true })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccountCircleRoundedIcon color="primary" />
            <Box>
              <Typography variant="h5" fontWeight={800}>Mi cuenta</Typography>
              <Typography variant="body2" color="text.secondary">{user?.username || 'Cliente'}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/store" variant="outlined">Tienda</Button>
            <Button onClick={handleLogout} variant="text" startIcon={<LogoutRoundedIcon />}>Salir</Button>
          </Stack>
        </Box>

        {errorMessage && <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>}

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={1}>Mis pedidos</Typography>
            {loading ? (
              <Typography color="text.secondary">Cargando pedidos...</Typography>
            ) : orders.length === 0 ? (
              <Typography color="text.secondary">Aun no tienes pedidos registrados.</Typography>
            ) : (
              <Stack spacing={1.25} divider={<Divider flexItem />}>
                {orders.map((order) => (
                  <Stack key={order.sale_id} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
                    <Box>
                      <Typography fontWeight={700}>Pedido #{order.sale_id}</Typography>
                      <Typography variant="body2" color="text.secondary">Total: {currencyFormatter.format(Number(order.total || '0'))}</Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Chip label={order.status_detail.label} size="small" color={statusColor(order.status)} />
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/store/order-status?sale_id=${order.sale_id}`}
                        variant="outlined"
                      >
                        Ver estado
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
