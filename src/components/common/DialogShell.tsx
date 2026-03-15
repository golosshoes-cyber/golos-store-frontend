import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@mui/material'
import { alpha, SxProps, Theme, useTheme } from '@mui/material/styles'

const blurActiveElement = () => {
  if (typeof document === 'undefined') return
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement) {
    activeElement.blur()
  }
}

interface DialogShellProps extends Omit<DialogProps, 'children'> {
  dialogTitle?: string
  subtitle?: string
  header?: React.ReactNode
  headerInTitle?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
  contentSx?: SxProps<Theme>
  titleSx?: SxProps<Theme>
  actionsSx?: SxProps<Theme>
  onClose?: () => void
  dense?: boolean
}

const DialogShell: React.FC<DialogShellProps> = ({
  dialogTitle,
  subtitle,
  header,
  headerInTitle = true,
  children,
  actions,
  contentSx,
  titleSx,
  actionsSx,
  onClose,
  dense = false,
  ...dialogProps
}) => {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  const handleDialogClose: DialogProps['onClose'] = () => {
    blurActiveElement()
    onClose?.()
  }

  React.useEffect(() => {
    if (!dialogProps.open) return
    blurActiveElement()
  }, [dialogProps.open])

  return (
    <Dialog
      {...dialogProps}
      onClose={handleDialogClose}
      disableRestoreFocus
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(2px)' },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isLight 
            ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' 
            : '0 8px 32px rgba(0,0,0,0.5)',
          backgroundImage: 'none',
          /* Premium MenuItem hover */
          '& .MuiMenuItem-root': {
            fontSize: '13px',
            borderRadius: 1,
            mx: 0.5,
            transition: 'all 0.15s ease',
            '&:hover': {
              background: isLight
                ? 'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.015) 100%)'
                : 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              transform: 'translateX(2px)',
            },
            '&.Mui-selected': {
              background: isLight
                ? 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 100%)'
                : 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
              fontWeight: 600,
            },
          },
          ...((dialogProps.PaperProps?.sx as any) || {}),
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          p: 2.5, 
          pb: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          ...titleSx 
        }}
      >
        {header ? (
          headerInTitle ? header : null
        ) : (
          <>
            <Typography sx={{ fontWeight: 600, fontSize: dense ? '14px' : '15px', lineHeight: 1.3, letterSpacing: '-0.3px' }}>
              {dialogTitle}
            </Typography>
            {subtitle && (
              <Typography sx={{ color: 'text.secondary', display: 'block', mt: dense ? 0.2 : 0.5, fontSize: dense ? '11px' : '12px', fontWeight: 400, lineHeight: 1.4 }}>
                {subtitle}
              </Typography>
            )}
          </>
        )}
      </DialogTitle>
      {!headerInTitle && header}

      <DialogContent sx={{ p: dense ? 2 : 2.5, pt: dense ? '16px !important' : '24px !important', ...contentSx }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions 
          sx={{ 
            p: dense ? 1 : 1.5, 
            px: dense ? 2 : 2.5, 
            bgcolor: alpha(theme.palette.text.primary, 0.02),
            borderTop: `1px solid ${theme.palette.divider}`,
            ...actionsSx 
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  )
}

export default DialogShell
