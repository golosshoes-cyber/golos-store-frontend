import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PaletteMode } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { createAppTheme } from '../theme'

interface ThemeModeContextValue {
  mode: PaletteMode
  toggleColorMode: () => void
}

const THEME_STORAGE_KEY = 'golos-theme-mode'

const getInitialMode = (): PaletteMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (savedMode === 'light' || savedMode === 'dark') {
    return savedMode
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined)

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode)

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
  }, [mode])

  const toggleColorMode = useCallback(() => {
    setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }, [])

  const theme = useMemo(() => createAppTheme(mode), [mode])

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode, toggleColorMode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode debe usarse dentro de ThemeModeProvider')
  }

  return context
}
