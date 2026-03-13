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
    const iconSx = { fontSize: 20 }
    switch (severity) {
      case 'error':
        return <DeleteIcon color="error" sx={iconSx} />
      case 'warning':
        return <WarningIcon color="warning" sx={iconSx} />
      case 'info':
        return <BlockIcon color="info" sx={iconSx} />
      default:
        return <WarningIcon color="warning" sx={iconSx} />
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={!loading ? onCancel : () => {}}
      maxWidth="xs"
      dialogTitle={title}
      subtitle={severity === 'error' ? 'Esta acción no se puede deshacer' : 'Por favor confirma para continuar'}
      actions={
        <>
          <Button
            onClick={onCancel}
            disabled={loading}
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 2,
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              '&:hover': { borderColor: 'text.disabled', color: 'text.primary' },
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            autoFocus
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '12px',
              textTransform: 'none',
              px: 2,
              bgcolor: severity === 'error' ? 'error.main' : 'text.primary',
              color: severity === 'error' ? '#fff' : 'background.default',
              '&:hover': {
                bgcolor: severity === 'error' ? 'error.dark' : 'text.secondary',
              },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </>
      }
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: severity === 'error' ? alpha(theme.palette.error.main, 0.05) : alpha(theme.palette.warning.main, 0.05),
          border: `1px solid ${alpha(severity === 'error' ? theme.palette.error.main : theme.palette.warning.main, 0.1)}`,
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        {getIcon()}
        <Box>
          <Typography sx={{ fontSize: '13px', lineHeight: 1.6, color: 'text.primary' }}>
            {message}
          </Typography>
          <Typography sx={{ fontSize: '11px', color: 'text.disabled', mt: 1 }}>
            {severity === 'error'
              ? 'Si solo quieres ocultarlo, considera marcarlo como inactivo en su lugar.'
              : 'Asegúrate de haber revisado los detalles antes de confirmar.'}
          </Typography>
        </Box>
      </Box>
    </DialogShell>
  )
}

export default ConfirmDialog
