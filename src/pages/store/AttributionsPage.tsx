import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Container, Stack, Typography, Grid } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import FontDownloadRoundedIcon from '@mui/icons-material/FontDownloadRounded'
import { useNavigate } from 'react-router-dom'
import { storeService } from '../../services/storeService'
import type { StoreBranding } from '../../types/store'

export default function AttributionsPage() {
  const navigate = useNavigate()
  const [branding, setBranding] = useState<StoreBranding | null>(null)

  useEffect(() => {
    void storeService.getBranding().then(resp => setBranding(resp.branding))
  }, [])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/store')
  }

  const sections = [
    {
      title: 'Fotografía e Imágenes',
      icon: <CollectionsRoundedIcon color="primary" />,
      items: [
        { name: 'Unsplash', desc: 'Sneakers, lifestyle y fotografía urbana de alta calidad.', link: 'https://unsplash.com' },
        { name: 'Pexels', desc: 'Imágenes dinámicas para secciones adicionales.', link: 'https://www.pexels.com' },
      ]
    },
    {
      title: 'Iconografía y Diseño',
      icon: <AutoAwesomeRoundedIcon color="primary" />,
      items: [
        { name: 'Material UI Icons', desc: 'Iconos del sistema Google Material Design.', link: 'https://mui.com/material-ui/material-icons/' },
        { name: 'Lucide Icons', desc: 'Iconos vectoriales limpios y consistentes.', link: 'https://lucide.dev' },
      ]
    },
    {
      title: 'Tipografía',
      icon: <FontDownloadRoundedIcon color="primary" />,
      items: [
        { name: 'DM Sans', desc: 'Tipografía principal vía Google Fonts.', link: 'https://fonts.google.com/specimen/DM+Sans' },
      ]
    },
    {
      title: 'Tecnología',
      icon: <CodeRoundedIcon color="primary" />,
      items: [
        { name: 'React', desc: 'Librería principal para la interfaz de usuario.', link: 'https://reactjs.org' },
        { name: 'Material UI', desc: 'Framework de componentes y diseño.', link: 'https://mui.com' },
        { name: 'Vite', desc: 'Herramienta de desarrollo y construcción.', link: 'https://vitejs.dev' },
      ]
    }
  ]

  return (
    <Container maxWidth="md" sx={{ py: 4, fontFamily: "'DM Sans', sans-serif" }}>
      <Stack spacing={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AutoAwesomeRoundedIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>Créditos y Atribuciones</Typography>
              <Typography variant="body2" color="text.secondary">Los recursos y herramientas que hacen posible {branding?.store_name || 'Golos Store'}.</Typography>
            </Box>
          </Stack>
          <Button
            onClick={handleBack}
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}
          >
            Volver
          </Button>
        </Box>

        <Grid container spacing={3}>
          {sections.map((section) => (
            <Grid item xs={12} key={section.title}>
              <Card variant="outlined" sx={{ borderRadius: 3, borderStyle: 'dashed' }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    {section.icon}
                    <Typography variant="h6" fontWeight={700}>{section.title}</Typography>
                  </Stack>
                  <Stack spacing={2.5}>
                    {section.items.map((item) => (
                      <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                        </Box>
                        <Button 
                          component="a" 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          size="small" 
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Visitar sitio
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Este proyecto utiliza software de código abierto y recursos gratuitos. 
            Agradecemos a todos los creadores y desarrolladores.
          </Typography>
        </Box>
      </Stack>
    </Container>
  )
}
