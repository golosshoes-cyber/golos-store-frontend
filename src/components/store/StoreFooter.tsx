import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Grid, Typography, Stack, IconButton, Divider } from '@mui/material'
import { 
  EmailOutlined, 
  PhoneOutlined, 
  LocationOnOutlined, 
  Instagram, 
  Facebook 
} from '@mui/icons-material'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import { storeService } from '../../services/storeService'
import type { StoreBranding } from '../../types/store'

interface StoreFooterProps {
  branding?: StoreBranding
}

export default function StoreFooter({ branding: initialBranding }: StoreFooterProps) {
  const { mode } = useThemeMode()
  const [branding, setBranding] = useState<StoreBranding | null>(initialBranding || null)

  useEffect(() => {
    if (!initialBranding) {
      void storeService.getBranding().then(resp => setBranding(resp.branding))
    } else {
      setBranding(initialBranding)
    }
  }, [initialBranding])

  const isDark = mode === 'dark'
  const css = {
    bg: 'transparent',
    border: isDark ? '#2a2a2a' : '#e5e5e5', 
    textPrimary: isDark ? '#ffffff' : '#000000',
    textMuted: isDark ? '#a0a0a0' : '#6b6b6b', 
    textFaint: isDark ? '#555555' : '#a8a8a8',
    iconColor: isDark ? '#a0a0a0' : '#6b6b6b',
  }

  const storeName = branding?.store_name || 'Golos Store'
  const tagline = branding?.tagline || 'Calzado y estilo para cada paso'
  const email = branding?.legal_contact_email
  const phone = branding?.legal_contact_phone
  const address = branding?.legal_contact_address
  const city = branding?.legal_contact_city

  const fullAddress = [address, city].filter(Boolean).join(', ')

  return (
    <Box component="footer" sx={{ 
      borderTop: `1px solid ${css.border}`, 
      mt: { xs: 8, md: 10 }, 
      pt: { xs: 6, md: 8 },
      pb: { xs: 4, md: 6 },
      backgroundColor: css.bg
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 4 }}>
          {/* Columna 1: Marca y Contacto */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: css.textPrimary }}>
              {storeName}
            </Typography>
            {tagline && (
              <Typography variant="body2" sx={{ mb: 3, color: css.textMuted }}>
                {tagline}
              </Typography>
            )}
            <Stack spacing={2}>
              {email && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EmailOutlined sx={{ fontSize: 20, color: css.iconColor }} />
                  <Typography variant="body2" color={css.textMuted}>{email}</Typography>
                </Stack>
              )}
              {phone && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PhoneOutlined sx={{ fontSize: 20, color: css.iconColor }} />
                  <Typography variant="body2" color={css.textMuted}>{phone}</Typography>
                </Stack>
              )}
              {fullAddress && (
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <LocationOnOutlined sx={{ fontSize: 20, color: css.iconColor, mt: 0.2 }} />
                  <Typography variant="body2" color={css.textMuted}>{fullAddress}</Typography>
                </Stack>
              )}
            </Stack>
          </Grid>

          {/* Columna 2: Enlaces de Tienda */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5, color: css.textPrimary }}>
              Explorar
            </Typography>
            <Stack spacing={1.5}>
              <RouterLink to="/store" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Inicio</RouterLink>
              <RouterLink to="/store/products" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Ver Catálogo</RouterLink>
              <RouterLink to="/store/account" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Mi Cuenta</RouterLink>
              <RouterLink to="/store/account?tab=orders" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Mis Órdenes</RouterLink>
            </Stack>
          </Grid>

          {/* Columna 3: Soporte y Legal */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5, color: css.textPrimary }}>
              Soporte y Legal
            </Typography>
            <Stack spacing={1.5}>
              <RouterLink to="/store/privacy" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Política de Privacidad</RouterLink>
              <RouterLink to="/store/terms" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Términos y Condiciones</RouterLink>
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Superintendencia SIC</a>
              <RouterLink to="/store/attributions" style={{ textDecoration: 'none', color: css.textMuted, fontSize: '0.875rem' }}>Créditos y Atribuciones</RouterLink>
            </Stack>
          </Grid>

          {/* Columna 4: Redes Sociales y Confianza */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: { xs: 1, md: 2.5 }, color: css.textPrimary }}>
              Síguenos
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3, ml: -1 }}>
              <IconButton 
                component="a" 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram" 
                sx={{ color: css.iconColor, '&:hover': { color: '#E1306C' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook" 
                sx={{ color: css.iconColor, '&:hover': { color: '#1877F2' } }}
              >
                <Facebook />
              </IconButton>
            </Stack>

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: css.textPrimary }}>
              Pago Seguro
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box 
                sx={{ 
                  color: css.textMuted, 
                  border: `1px solid ${css.border}`, 
                  borderRadius: 1, 
                  px: 1, 
                  py: 0.5, 
                  fontSize: '0.65rem',
                  fontWeight: 700, 
                  letterSpacing: 0.5 
                }}
              >
                WOMPI
              </Box>
              <Box 
                sx={{ 
                  color: css.textMuted, 
                  border: `1px solid ${css.border}`, 
                  borderRadius: 1, 
                  px: 1, 
                  py: 0.5, 
                  fontSize: '0.65rem',
                  fontWeight: 700, 
                  letterSpacing: 0.5 
                }}
              >
                VISA
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 6, mb: 4, borderColor: css.border }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: css.textFaint }}>
            © {new Date().getFullYear()} {storeName}. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" sx={{ color: css.textFaint }}>
            Poder por Golos Inventory
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
