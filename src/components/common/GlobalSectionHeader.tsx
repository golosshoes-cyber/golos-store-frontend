import React from 'react'
import { Box, Typography, Divider } from '@mui/material'

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

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: bottomContent ? 2 : 0
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 0.5,
            }}
          >
            {icon && (
              <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: 24 } })}
              </Box>
            )}
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
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
              alignItems: 'center',
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>

      {bottomContent && (
        <Box sx={{ mt: 2 }}>
          {bottomContent}
        </Box>
      )}
      
      {!bottomContent && <Divider sx={{ mt: 3, opacity: 0.5 }} />}
    </Box>
  )
}

export default GlobalSectionHeader
