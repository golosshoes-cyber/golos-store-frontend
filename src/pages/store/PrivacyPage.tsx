import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { storeService } from '../../services/storeService'
import type { StoreBranding } from '../../types/store'

export default function PrivacyPage() {
  const navigate = useNavigate()
  const [branding, setBranding] = useState<StoreBranding | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await storeService.getBranding()
        setBranding(response.branding)
      } catch {
        setError('No se pudieron cargar los datos de contacto de la tienda.')
      }
    }
    void loadBranding()
  }, [])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/store')
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2.5}>
        <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1.25} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PolicyRoundedIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>Politica de Tratamiento de Datos</Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button component={RouterLink} to="/store/terms" variant="text" sx={{ fontWeight: 700, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
              Terminos
            </Button>
            <Button
              onClick={handleBack}
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{ fontWeight: 700, transition: 'all 180ms ease', '&:hover': { transform: 'translateY(-1px)' }, justifyContent: { xs: 'flex-start', sm: 'center' } }}
            >
              Volver
            </Button>
          </Stack>
        </Box>

        {error && <Alert severity="warning">{error}</Alert>}

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                Ultima actualizacion: 27/02/2026
              </Typography>
              <Typography variant="body2">
                {branding?.store_name || 'Golos Store'} realiza tratamiento de datos personales para: registro de cuenta, gestion de pedidos,
                procesamiento de pagos, coordinacion de envios, atencion de PQR y cumplimiento de obligaciones legales.
              </Typography>
              <Typography variant="body2">
                Se tratan datos de identificacion y contacto, datos de compra, direccion de entrega y datos necesarios para verificacion de transacciones.
              </Typography>
              <Typography variant="body2">
                No comercializamos bases de datos personales. El acceso a la informacion se limita al personal y proveedores que requieren esos datos
                para prestar el servicio (pasarela de pago y transportadora), bajo deberes de confidencialidad y seguridad.
              </Typography>
              <Typography variant="body2">
                Como titular, puedes ejercer tus derechos de conocer, actualizar, rectificar y suprimir datos, asi como revocar autorizaciones
                cuando proceda, por los canales oficiales de contacto del comercio.
              </Typography>
              <Typography variant="body2">
                Contacto para asuntos de datos personales:
              </Typography>
              <Typography variant="body2">
                Correo: {branding?.legal_contact_email || 'No informado'}
              </Typography>
              <Typography variant="body2">
                Telefono: {branding?.legal_contact_phone || 'No informado'}
              </Typography>
              <Typography variant="body2">
                Direccion: {[branding?.legal_contact_address, branding?.legal_contact_city, branding?.legal_contact_department].filter(Boolean).join(', ') || 'No informada'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Referencia normativa: Ley 1581 de 2012 y Decretos reglamentarios sobre proteccion de datos personales en Colombia.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
