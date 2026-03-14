import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  const css = isDark ? {
    border: '#2a2a2a', textMuted: '#a0a0a0', textFaint: '#555555',
  } : {
    border: '#e5e5e5', textMuted: '#6b6b6b', textFaint: '#a8a8a8',
  }

  const storeName = branding?.store_name || 'Golos Store'

  return (
    <footer style={{
      borderTop: `1px solid ${css.border}`, padding: '40px 32px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 60,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 13, color: css.textFaint }}>
        © {new Date().getFullYear()} {storeName} · Información legal y de privacidad
      </div>
      
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Términos', to: '/store/terms' },
          { label: 'Privacidad', to: '/store/privacy' },
          { label: 'Créditos', to: '/store/attributions' },
          { label: 'SIC', to: 'https://www.sic.gov.co', external: true },
        ].map((link) => (
          link.external
            ? <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: css.textMuted, cursor: 'pointer', textDecoration: 'none', fontWeight: 500 }}>{link.label}</a>
            : <RouterLink key={link.label} to={link.to} style={{ fontSize: 13, color: css.textMuted, cursor: 'pointer', textDecoration: 'none', fontWeight: 500 }}>{link.label}</RouterLink>
        ))}
      </div>
    </footer>
  )
}
