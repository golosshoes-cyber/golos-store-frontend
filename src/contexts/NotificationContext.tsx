import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { AlertProps } from '@mui/material'
import NotificationSnackbar from '../components/common/NotificationSnackbar'

type NotificationSeverity = NonNullable<AlertProps['severity']>

interface NotificationState {
  open: boolean
  message: string
  severity: NotificationSeverity
}

interface NotificationContextType {
  notification: NotificationState
  showNotification: (message: string, severity?: NotificationSeverity) => void
  hideNotification: () => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  })

  const showNotification = useCallback(
    (message: string, severity: NotificationSeverity = 'info') => {
      setNotification({
        open: true,
        message,
        severity,
      })
    },
    [],
  )

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }))
  }, [])

  const value = useMemo<NotificationContextType>(
    () => ({
      notification,
      showNotification,
      hideNotification,
      showSuccess: (message: string) => showNotification(message, 'success'),
      showError: (message: string) => showNotification(message, 'error'),
      showWarning: (message: string) => showNotification(message, 'warning'),
      showInfo: (message: string) => showNotification(message, 'info'),
    }),
    [notification, showNotification, hideNotification],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
