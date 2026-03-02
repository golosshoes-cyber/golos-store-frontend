import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

interface GlobalSectionHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  bottomContent?: React.ReactNode
}

const GlobalSectionHeader: React.FC<GlobalSectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  bottomContent,
}) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2.2, md: 3 },
        mb: 3,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 140%)`,
        color: 'white',
        border: `1px solid ${alpha('#ffffff', 0.24)}`,
        boxShadow:
          theme.palette.mode === 'light'
            ? `0 14px 28px ${alpha(theme.palette.primary.dark, 0.24)}`
            : `0 14px 32px ${alpha('#000000', 0.52)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -70,
          right: -55,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: alpha('#ffffff', 0.18),
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', lg: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 1.2, sm: 1.6, lg: 2 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', lg: 'flex-start' },
              gap: 1.2,
              mb: 0.7,
              minWidth: 0,
            }}
          >
            {icon}
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.45rem', lg: '1.9rem' },
                lineHeight: 1.15,
                textAlign: { xs: 'center', lg: 'left' },
                overflowWrap: 'anywhere',
                '@media (max-width:360px)': {
                  fontSize: '1rem',
                },
              }}
            >
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography
              variant="body1"
              sx={{
                opacity: 0.92,
                textAlign: { xs: 'center', lg: 'left' },
                fontSize: { xs: '0.78rem', sm: '0.9rem', lg: '1rem' },
                overflowWrap: 'anywhere',
                '@media (max-width:360px)': {
                  fontSize: '0.72rem',
                },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'stretch', lg: 'flex-end' },
              width: { xs: '100%', lg: 'auto' },
              '& > *': {
                width: { xs: '100%', sm: 'auto' },
              },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>

      {bottomContent && (
        <Box sx={{ mt: { xs: 1.2, sm: 1.6 } }}>
          {bottomContent}
        </Box>
      )}
    </Paper>
  )
}

export default GlobalSectionHeader
