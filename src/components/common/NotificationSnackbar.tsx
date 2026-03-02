import React from 'react'
import {
  Snackbar,
  Alert,
  AlertProps,
  useTheme,
  useMediaQuery,
} from '@mui/material'

interface NotificationSnackbarProps {
  open: boolean
  message: string
  severity?: AlertProps['severity']
  onClose?: () => void
  autoHideDuration?: number
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 10000, // Aumentado de 6000ms a 10000ms
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{
        vertical: isMobile ? 'top' : 'bottom',
        horizontal: 'center'
      }}
      sx={{
        // En móvil, asegurar que esté por encima de todo
        ...(isMobile && {
          top: theme.spacing(2),
          zIndex: theme.zIndex.modal + 1,
        })
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ 
          width: { xs: '90%', sm: 'auto', md: '100%' },
          maxWidth: { xs: '300px', sm: '400px' }
        }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationSnackbar
