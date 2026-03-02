import { PaletteMode } from '@mui/material'
import Swal, { SweetAlertIcon } from 'sweetalert2'

interface AcrylicConfirmOptions {
  mode: PaletteMode
  title: string
  text: string
  icon?: SweetAlertIcon
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
}

export const showAcrylicConfirm = async ({
  mode,
  title,
  text,
  icon = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonColor,
  cancelButtonColor,
}: AcrylicConfirmOptions): Promise<boolean> => {
  const isDark = mode === 'dark'

  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: confirmButtonColor || (isDark ? '#60a5fa' : '#2563eb'),
    cancelButtonColor: cancelButtonColor || (isDark ? '#64748b' : '#94a3b8'),
    background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.9)',
    color: isDark ? '#e2e8f0' : '#0f172a',
    backdrop: isDark
      ? 'rgba(2, 6, 23, 0.68) blur(6px)'
      : 'rgba(15, 23, 42, 0.32) blur(6px)',
    scrollbarPadding: false,
    reverseButtons: true,
    allowEscapeKey: true,
    allowOutsideClick: true,
    customClass: {
      popup: 'swal2-acrylic-popup',
      confirmButton: 'swal2-acrylic-confirm',
      cancelButton: 'swal2-acrylic-cancel',
    },
  })

  return result.isConfirmed
}
