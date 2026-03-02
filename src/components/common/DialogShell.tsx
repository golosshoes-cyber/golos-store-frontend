import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'

let dialogLockCount = 0
let previousHtmlOverflow = ''
let previousBodyOverflow = ''
let previousRootOverflow = ''

const lockAppScroll = () => {
  if (typeof document === 'undefined') return
  const root = document.getElementById('root')
  if (dialogLockCount === 0) {
    previousHtmlOverflow = document.documentElement.style.overflow
    previousBodyOverflow = document.body.style.overflow
    previousRootOverflow = root?.style.overflow || ''
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    if (root) root.style.overflow = 'hidden'
  }
  dialogLockCount += 1
}

const blurActiveElement = () => {
  if (typeof document === 'undefined') return
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement) {
    activeElement.blur()
  }
}

const unlockAppScroll = () => {
  if (typeof document === 'undefined') return
  dialogLockCount = Math.max(0, dialogLockCount - 1)
  if (dialogLockCount === 0) {
    const root = document.getElementById('root')
    document.documentElement.style.overflow = previousHtmlOverflow
    document.body.style.overflow = previousBodyOverflow
    if (root) root.style.overflow = previousRootOverflow
  }
}

interface DialogShellProps extends Omit<DialogProps, 'children'> {
  dialogTitle?: React.ReactNode
  header?: React.ReactNode
  headerInTitle?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
  contentSx?: SxProps<Theme>
  titleSx?: SxProps<Theme>
  actionsSx?: SxProps<Theme>
}

const DialogShell: React.FC<DialogShellProps> = ({
  dialogTitle,
  header,
  headerInTitle = true,
  children,
  actions,
  contentSx,
  titleSx,
  actionsSx,
  ...dialogProps
}) => {
  const handleDialogClose: DialogProps['onClose'] = (event, reason) => {
    blurActiveElement()
    dialogProps.onClose?.(event, reason)
  }

  React.useEffect(() => {
    if (!dialogProps.open) return
    blurActiveElement()
    lockAppScroll()
    return () => unlockAppScroll()
  }, [dialogProps.open])

  return (
    <Dialog
      {...dialogProps}
      onClose={handleDialogClose}
      disableRestoreFocus
      TransitionProps={{
        ...dialogProps.TransitionProps,
        onExited: (node) => {
          blurActiveElement()
          dialogProps.TransitionProps?.onExited?.(node)
        },
      }}
    >
      {header
        ? headerInTitle
          ? <DialogTitle sx={titleSx}>{header}</DialogTitle>
          : header
        : dialogTitle
          ? <DialogTitle sx={titleSx}>{dialogTitle}</DialogTitle>
          : null}
      <DialogContent sx={contentSx}>{children}</DialogContent>
      {actions ? <DialogActions sx={actionsSx}>{actions}</DialogActions> : null}
    </Dialog>
  )
}

export default DialogShell
