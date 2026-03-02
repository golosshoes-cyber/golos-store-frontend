import { useEffect, useState } from 'react'
import { Alert, Box, Card, CardContent, Container, Stack, Typography, Button, Link } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import GavelRoundedIcon from '@mui/icons-material/GavelRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { storeService } from '../../services/storeService'
import type { StoreBranding } from '../../types/store'

export default function TermsPage() {
  const navigate = useNavigate()
  const [branding, setBranding] = useState<StoreBranding | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await storeService.getBranding()
        setBranding(response.branding)
      } catch {
        setError('No se pudieron cargar los datos legales de la tienda.')
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
            <GavelRoundedIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>Terminos y Condiciones</Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              component={RouterLink}
              to="/store/privacy"
              variant="text"
              sx={{ fontWeight: 700, justifyContent: { xs: 'flex-start', sm: 'center' } }}
            >
              Politica de datos
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
            <Stack spacing={1.75}>
              <Typography variant="body2" color="text.secondary">
                Ultima actualizacion: 27/02/2026
              </Typography>

              <Typography variant="h6">1. Identidad del proveedor y objeto</Typography>
              <Typography variant="body2">
                Este sitio web corresponde a una plataforma de comercio electronico para la oferta y venta de productos al consumidor final en Colombia.
                Al navegar y comprar, aceptas estos Terminos y Condiciones, la Politica de Tratamiento de Datos Personales y las politicas de cambios, devoluciones y garantia.
              </Typography>
              <Typography variant="body2">
                Proveedor: {branding?.store_name || 'Golos Store'}
              </Typography>
              {branding?.legal_representative_name && (
                <Typography variant="body2">Responsable: {branding.legal_representative_name}</Typography>
              )}
              {(branding?.legal_id_type || branding?.legal_id_number) && (
                <Typography variant="body2">
                  {branding?.legal_id_type || 'Identificacion'}: {branding?.legal_id_number || 'No informado'}
                </Typography>
              )}
              {(branding?.legal_contact_address || branding?.legal_contact_city || branding?.legal_contact_department) && (
                <Typography variant="body2">
                  Direccion comercial: {[branding?.legal_contact_address, branding?.legal_contact_city, branding?.legal_contact_department].filter(Boolean).join(', ')}
                </Typography>
              )}
              {branding?.legal_contact_phone && (
                <Typography variant="body2">Telefono: {branding.legal_contact_phone}</Typography>
              )}
              {branding?.legal_contact_email && (
                <Typography variant="body2">Correo: {branding.legal_contact_email}</Typography>
              )}

              <Typography variant="h6" sx={{ mt: 1 }}>2. Precio, disponibilidad y cobertura</Typography>
              <Typography variant="body2">
                Los precios publicados se expresan en pesos colombianos (COP) e incluyen los impuestos aplicables cuando corresponda.
                Los valores de envio, comisiones y costos asociados se informan antes de finalizar la compra.
              </Typography>
              <Typography variant="body2">
                La disponibilidad de inventario y cobertura de entrega puede variar por ciudad, transportadora y validaciones operativas.
                Las imagenes y descripciones son de referencia comercial y pueden tener variaciones no esenciales.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>3. Pagos y validacion de transacciones</Typography>
              <Typography variant="body2">
                Los pagos online son procesados por Wompi. La aprobacion o rechazo depende del emisor, el metodo elegido y validaciones antifraude.
              </Typography>
              <Typography variant="body2">
                En caso de rechazo, error o demora de confirmacion, el pedido puede permanecer en estado pendiente hasta sincronizarse correctamente.
              </Typography>
              <Typography variant="body2">
                Por seguridad y cumplimiento normativo, el comercio puede abstenerse de confirmar pedidos con alertas de fraude, inconsistencias de identidad
                o incumplimiento de requisitos del medio de pago.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>4. Despachos y entregas</Typography>
              <Typography variant="body2">
                El costo y tiempo de envio pueden variar segun ciudad, peso, cobertura de transportadora y novedades externas.
              </Typography>
              <Typography variant="body2">
                Cuando aplique, el pedido contara con numero de guia para seguimiento.
              </Typography>
              <Typography variant="body2">
                El cliente debe suministrar datos de entrega completos y correctos. Retrasos o sobrecostos generados por datos incompletos, ausencia
                del destinatario o imposibilidad de entrega atribuible al cliente podran generar reintentos o cancelacion segun el caso.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>5. Derecho de retracto (ventas a distancia)</Typography>
              <Typography variant="body2">
                En compras realizadas por canales no presenciales, el consumidor puede ejercer el derecho de retracto dentro de los cinco (5) dias habiles
                siguientes a la entrega del producto, conforme al articulo 47 de la Ley 1480 de 2011, salvo las excepciones legales aplicables.
              </Typography>
              <Typography variant="body2">
                Para ejercerlo, debes informar por un canal verificable y devolver el producto en condiciones aptas, sin uso que impida su comercializacion,
                salvo deterioro por revision normal.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>6. Reversion del pago (medios electronicos)</Typography>
              <Typography variant="body2">
                Cuando aplique, podras solicitar reversion del pago por fraude, operacion no solicitada, producto no recibido, producto defectuoso
                o producto que no corresponda a lo solicitado, conforme al articulo 51 de la Ley 1480 de 2011 y su reglamentacion.
              </Typography>
              <Typography variant="body2">
                Segun el procedimiento reglamentario, la reclamacion debe presentarse dentro de cinco (5) dias habiles desde que conociste el hecho,
                y una vez radicada correctamente, los participantes del proceso de pago cuentan con hasta quince (15) dias habiles para tramitarla.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>7. Garantia legal, cambios y devoluciones</Typography>
              <Typography variant="body2">
                La garantia legal se atiende en los terminos del Estatuto del Consumidor. En caso de falla de calidad, idoneidad o seguridad,
                puedes presentar solicitud de efectividad de garantia por nuestros canales de atencion.
              </Typography>
              <Typography variant="body2">
                Los cambios por talla o color estaran sujetos a disponibilidad de inventario y condiciones del producto.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>8. Proteccion de datos personales (Habeas Data)</Typography>
              <Typography variant="body2">
                El tratamiento de datos personales se realiza para gestionar pedidos, pagos, despachos, servicio al cliente y cumplimiento legal,
                de acuerdo con la Ley 1581 de 2012 y normativa complementaria.
              </Typography>
              <Typography variant="body2">
                El titular podra ejercer derechos de conocer, actualizar, rectificar y suprimir sus datos, asi como revocar autorizaciones, por
                los canales de contacto aqui informados.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>9. PQR y atencion al consumidor</Typography>
              <Typography variant="body2">
                Para peticiones, quejas, reclamos, retractos, garantias y solicitudes de reversion, usa los canales oficiales del comercio:
                correo y telefono publicados en esta pagina.
              </Typography>
              <Typography variant="body2">
                Se recomienda conservar soportes de pago, numero de pedido, comunicaciones y evidencia de entrega para agilizar la atencion.
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>10. Enlace visible a la autoridad de proteccion al consumidor</Typography>
              <Typography variant="body2">
                En cumplimiento de la normativa aplicable en comercio electronico, ponemos a disposicion un enlace visible a la Superintendencia
                de Industria y Comercio (SIC), autoridad nacional en proteccion al consumidor.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consulta oficial:
                {' '}
                <Link href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" underline="hover">
                  Superintendencia de Industria y Comercio (SIC)
                </Link>
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>11. Marco normativo de referencia (Colombia)</Typography>
              <Typography variant="body2">
                Estos terminos toman como base, entre otras, las siguientes normas: Ley 1480 de 2011 (Estatuto del Consumidor), Ley 527 de 1999
                (comercio electronico y mensajes de datos), Ley 1581 de 2012 (proteccion de datos personales), y reglas de reversion de pagos
                para comercio electronico.
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Este texto es una guia contractual-operativa para la tienda y debe revisarse periodicamente conforme a cambios regulatorios o de negocio.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
