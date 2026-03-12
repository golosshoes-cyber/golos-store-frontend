import React from 'react'
import {
  Typography,
  Button,
  Box,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
} from '@mui/icons-material'
import DialogShell from './DialogShell'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  severity?: 'warning' | 'error' | 'info'
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'warning',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const theme = useTheme()
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <DeleteIcon color="error" sx={{ fontSize: 48 }} />
      case 'warning':
        return <WarningIcon color="warning" sx={{ fontSize: 48 }} />
      case 'info':
        return <BlockIcon color="info" sx={{ fontSize: 48 }} />
      default:
        return <WarningIcon color="warning" sx={{ fontSize: 48 }} />
    }
  }

  const getConfirmButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'primary'
      default:
        return 'primary'
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={!loading ? onCancel : () => {}}
      maxWidth="sm"
      dialogTitle={title}
      subtitle={severity === 'error' ? 'Esta acción no se puede deshacer' : 'Por favor confirma para continuar'}
      actions={
        <>
          <Button
            onClick={onCancel}
            disabled={loading}
            variant="text"
            sx={{ color: 'text.secondary' }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color={getConfirmButtonColor()}
            disabled={loading}
            autoFocus
            sx={{
              bgcolor: severity === 'error' ? 'error.main' : 'text.primary',
              color: 'background.default',
              '&:hover': {
                bgcolor: severity === 'error' ? 'error.dark' : 'text.secondary',
              }
            }}
          >
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </>
      }
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: severity === 'error' ? alpha(theme.palette.error.main, 0.05) : alpha(theme.palette.warning.main, 0.05),
            border: `1px solid ${alpha(severity === 'error' ? theme.palette.error.main : theme.palette.warning.main, 0.1)}`,
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start'
          }}
        >
          {getIcon()}
          <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
            {message}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.disabled', px: 0.5 }}>
          {severity === 'error' 
            ? 'Si solo quieres ocultarlo, considera marcarlo como inactivo en su lugar.' 
            : 'Asegúrate de haber revisado los detalles antes de confirmar.'}
        </Typography>
      </Box>
    </DialogShell>
  )
}

export default ConfirmDialog
