import React from 'react'
import { Box } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

interface PageShellProps {
  children: React.ReactNode
}

const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'relative',
        isolation: 'isolate',
        borderRadius: 4,
        p: { xs: 1, sm: 1.5, md: 2 },
        overflow: 'hidden',
        '@keyframes shellFloat': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 300,
          height: 300,
          top: -150,
          right: -120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.22)} 0%, transparent 70%)`,
          animation: 'shellFloat 9s ease-in-out infinite',
          zIndex: -1,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 260,
          height: 260,
          bottom: -130,
          left: -110,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.16)} 0%, transparent 70%)`,
          animation: 'shellFloat 11s ease-in-out infinite',
          zIndex: -1,
          pointerEvents: 'none',
        },
        '& > *': {
          animation: 'shellFade 320ms ease both',
        },
        '@keyframes shellFade': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {children}
    </Box>
  )
}

export default PageShell
