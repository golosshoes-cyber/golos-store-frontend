import { motion } from 'framer-motion'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import type { StoreBranding } from '../../types/store'

interface MaintenancePageProps {
  branding?: StoreBranding
}

export default function MaintenancePage({ branding }: MaintenancePageProps) {
  const { mode } = useThemeMode()
  const isDark = mode === 'dark'

  const css = isDark ? {
    bg: '#0f0f0f',
    text: '#ffffff',
    textMuted: '#a0a0a0',
    accent: '#ffffff',
    border: '#2a2a2a'
  } : {
    bg: '#ffffff',
    text: '#111111',
    textMuted: '#6b6b6b',
    accent: '#111111',
    border: '#e5e5e5'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: css.bg,
      color: css.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        width: '100%'
      }}>
        <div style={{
          maxWidth: 600,
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Logo Section */}
            <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
              {branding?.logo_url ? (
                <img
                  src={branding.logo_url}
                  alt={branding.store_name}
                  style={{ maxHeight: 60, width: 'auto', filter: isDark ? 'invert(1) brightness(2)' : 'none' }}
                />
              ) : (
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em' }}>
                  {branding?.store_name || "Golos Store"}
                </div>
              )}
            </div>

            <div style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: css.textMuted,
              marginBottom: 16
            }}>
              Mantenimiento
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 32,
              letterSpacing: '-0.02em'
            }}>
              Estamos trabajando <br />
              <span style={{ color: css.textMuted }}>en el sitio.</span>
            </h1>

            <p style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: css.textMuted,
              marginBottom: 48,
              maxWidth: 480,
              marginInline: 'auto'
            }}>
              {branding?.maintenance_message || "Estamos mejorando nuestra tienda para brindarte una mejor experiencia. Volveremos muy pronto con novedades increibles."}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              paddingTop: 32,
              borderTop: `1px solid ${css.border}`
            }}>
              <a href="#" style={{ color: css.text, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>Instagram</a>
              <a href="#" style={{ color: css.text, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>WhatsApp</a>
              <a href="#" style={{ color: css.text, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>Facebook</a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
