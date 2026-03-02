import { alpha, Theme } from '@mui/material/styles'

type Tone = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

const toneToColor = (theme: Theme, tone: Tone) => {
  switch (tone) {
    case 'success':
      return theme.palette.success.main
    case 'warning':
      return theme.palette.warning.main
    case 'error':
      return theme.palette.error.main
    case 'info':
      return theme.palette.info.main
    case 'neutral':
      return theme.palette.text.secondary
    default:
      return theme.palette.primary.main
  }
}

export const mobileCardSx = (theme: Theme) => ({
  mb: 2,
  borderRadius: 3,
  maxWidth: '100%',
  minWidth: 0,
  overflow: 'hidden',
  border: `1px solid ${
    theme.palette.mode === 'light' ? alpha('#1e293b', 0.08) : alpha('#cbd5e1', 0.16)
  }`,
  boxShadow:
    theme.palette.mode === 'light'
      ? `0 8px 18px ${alpha('#1e293b', 0.12)}`
      : `0 10px 24px ${alpha('#000000', 0.42)}`,
  transition: 'all 0.25s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow:
      theme.palette.mode === 'light'
        ? `0 12px 22px ${alpha('#1e293b', 0.16)}`
        : `0 14px 26px ${alpha('#000000', 0.52)}`,
  },
  '@media (max-width:360px)': {
    borderRadius: 2,
  },
})

export const mobileCardHeaderSx = (theme: Theme) => ({
  p: { xs: 1.2, sm: 2 },
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 140%)'
      : 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 140%)',
  color: 'white',
  position: 'relative',
})

export const mobileMetricSx = (theme: Theme, tone: Tone) => {
  const color = toneToColor(theme, tone)
  return {
    p: { xs: 0.9, sm: 1.4 },
    textAlign: 'center',
    borderRadius: 2,
    background:
      theme.palette.mode === 'light'
        ? alpha(color, 0.1)
        : alpha(color, 0.18),
    border: `1px solid ${alpha(color, theme.palette.mode === 'light' ? 0.35 : 0.55)}`,
  }
}

export const mobileCardDividerSx = (theme: Theme) => ({
  borderTop: `1px solid ${
    theme.palette.mode === 'light' ? alpha('#1e293b', 0.1) : alpha('#cbd5e1', 0.2)
  }`,
})
