import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Typography, Button, Container, Stack, alpha, useTheme } from '@mui/material'
import hero1 from '../../assets/images/hero/hero1.png'
import hero2 from '../../assets/images/hero/hero2.png'
import hero3 from '../../assets/images/hero/hero3.png'

const SLIDES = [
  {
    id: 1,
    image: hero1,
    eyebrow: 'Nueva Colección 2026',
    title: 'Eleva tu Estilo Urbano',
    subtitle: 'Diseños que combinan comodidad excepcional con una estética de vanguardia. Encuentra tu par hoy.',
    cta: 'Ver Catálogo',
    link: '#store-catalog',
    color: '#ffffff'
  },
  {
    id: 2,
    image: hero2,
    eyebrow: 'Calidad Premium',
    title: 'Texturas que Inspiran',
    subtitle: 'Materiales seleccionados meticulosamente para durar y destacar en cada paso que das.',
    cta: 'Explorar Detalles',
    link: '#store-featured',
    color: '#ffffff'
  },
  {
    id: 3,
    image: hero3,
    eyebrow: 'Envío Gratis',
    title: 'Rápido. Seguro. Golos.',
    subtitle: 'Comprar tus favoritos nunca fue tan fácil. Recibe en la puerta de tu casa en tiempo récord.',
    cta: 'Saber Más',
    link: '#store-catalog',
    color: '#ffffff'
  }
]

export default function StoreHeroCarousel() {
  const theme = useTheme()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: { xs: 500, md: 600 }, 
      overflow: 'hidden',
      borderRadius: { xs: 0, sm: 4 },
      mb: 5,
      bgcolor: 'background.paper',
      border: `1px solid ${theme.palette.divider}`
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${SLIDES[current].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay Gradient */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to right, ${alpha('#000000', 0.8)} 0%, ${alpha('#000000', 0.2)} 100%)`,
          }} />

          <Container sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <Stack spacing={3} sx={{ maxWidth: 540 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography variant="overline" sx={{ 
                  color: 'primary.main', 
                  fontWeight: 700, 
                  letterSpacing: '0.2em',
                  fontSize: '0.75rem'
                }}>
                  {SLIDES[current].eyebrow}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Typography variant="h1" sx={{ 
                  color: '#ffffff', 
                  fontWeight: 800, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                  {SLIDES[current].title}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Typography sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  lineHeight: 1.6,
                  maxWidth: 480
                }}>
                  {SLIDES[current].subtitle}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => document.getElementById(SLIDES[current].link.slice(1))?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{ 
                      bgcolor: '#ffffff', 
                      color: '#000000',
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      borderRadius: 2,
                      '&:hover': { bgcolor: alpha('#ffffff', 0.9) }
                    }}
                  >
                    {SLIDES[current].cta}
                  </Button>
                </Stack>
              </motion.div>
            </Stack>
          </Container>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <Stack 
        direction="row" 
        spacing={1.5} 
        sx={{ 
          position: 'absolute', 
          bottom: 40, 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 2
        }}
      >
        {SLIDES.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setCurrent(idx)}
            sx={{
              width: current === idx ? 32 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: current === idx ? 'primary.main' : alpha('#ffffff', 0.3),
              cursor: 'pointer',
              transition: 'all 0.4s ease'
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}
