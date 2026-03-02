import React from 'react'
import {
  Typography,
  Button,
  Box,
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
      onClose={!loading ? onCancel : undefined}
      maxWidth="sm"
      header={
        <Box display="flex" alignItems="center" gap={2}>
          {getIcon()}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      }
      actions={
        <>
          <Button
            onClick={onCancel}
            disabled={loading}
            size="large"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color={getConfirmButtonColor()}
            disabled={loading}
            size="large"
            autoFocus
          >
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </>
      }
    >
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
    </DialogShell>
  )
}

export default ConfirmDialog
