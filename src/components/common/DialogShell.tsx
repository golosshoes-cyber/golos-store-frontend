import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Box,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
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
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isLight 
            ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' 
            : '0 8px 32px rgba(0,0,0,0.5)',
          backgroundImage: 'none',
          ...((dialogProps.PaperProps?.sx as any) || {}),
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          p: 2.5, 
          pb: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          ...titleSx 
        }}
      >
        <Box sx={{ flex: 1 }}>
          {header ? (
            headerInTitle ? header : null
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.3, letterSpacing: '-0.3px' }}>
                {dialogTitle}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontSize: '12px', fontWeight: 400 }}>
                  {subtitle}
                </Typography>
              )}
            </>
          )}
        </Box>
        {onClose && (
          <IconButton 
            size="small" 
            onClick={onClose}
            sx={{ 
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'text.secondary',
                color: 'text.primary',
              },
              width: 28,
              height: 28,
              ml: 2,
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </DialogTitle>
      {!headerInTitle && header}

      <DialogContent sx={{ p: 2.5, ...contentSx }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions 
          sx={{ 
            p: 1.5, 
            px: 2.5, 
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
