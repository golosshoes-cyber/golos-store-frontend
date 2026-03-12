import { PaletteMode } from '@mui/material'
import { alpha, createTheme } from '@mui/material/styles'
import { SaaSColors } from './constants/saas_colors'

export const createAppTheme = (mode: PaletteMode) => {
  const isLight = mode === 'light'
  const colors = isLight ? SaaSColors.light : SaaSColors.dark

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.accent,
        contrastText: colors.accentFg,
      },
      secondary: {
        main: colors.blue,
      },
      error: {
        main: colors.red,
      },
      warning: {
        main: colors.amber,
      },
      success: {
        main: colors.green,
      },
      background: {
        default: colors.bg,
        paper: colors.bgCard,
      },
      divider: colors.border,
      text: {
        primary: colors.text,
        secondary: colors.textMuted,
      },
    },
    typography: {
      fontFamily: '"Geist", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1.1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.9375rem',
      },
      body2: {
        fontSize: '0.8125rem',
      },
      caption: {
        fontSize: '0.75rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            maxWidth: '100%',
            overflowX: 'hidden',
          },
          body: {
            maxWidth: '100%',
            overflowX: 'hidden',
            backgroundColor: colors.bg,
            color: colors.text,
            '& #root': {
              maxWidth: '100%',
              overflowX: 'hidden',
            },
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 4,
              height: 4,
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              background: colors.borderStrong,
              borderRadius: 2,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${colors.border}`,
            boxShadow: isLight ? SaaSColors.shadow : SaaSColors.shadowDark,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            boxShadow: isLight ? SaaSColors.shadow : SaaSColors.shadowDark,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            '& .MuiBackdrop-root': {
              backgroundColor: isLight ? alpha('#000', 0.1) : alpha('#000', 0.5),
              backdropFilter: 'blur(4px)',
            },
          },
          paper: {
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            boxShadow: isLight ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' : SaaSColors.shadowDark,
            background: colors.bgCard,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            border: `1px solid ${colors.border}`,
            '&:hover': {
              borderColor: colors.borderStrong,
              backgroundColor: colors.bgHover,
            },
          },
          contained: {
            backgroundColor: colors.accent,
            color: colors.accentFg,
            borderColor: colors.accent,
            '&:hover': {
              backgroundColor: isLight ? '#222' : '#eee',
              borderColor: isLight ? '#222' : '#eee',
              opacity: 0.9,
            },
          },
          outlined: {
            borderColor: colors.border,
            color: colors.textMuted,
          },
          text: {
            border: 'none',
            '&:hover': {
              border: 'none',
              backgroundColor: colors.bgHover,
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.bgCard,
            boxShadow: 'none',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: colors.bgSubtle,
            '& .MuiTableCell-root': {
              fontWeight: 600,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: colors.textFaint,
              borderBottom: `1px solid ${colors.border}`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.border}`,
            padding: '12px 16px',
            fontSize: '13px',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: colors.bgHover,
            },
            '&:last-child td, &:last-child th': {
              border: 0,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
              fontSize: '13px',
              backgroundColor: colors.bgSubtle,
              '& fieldset': {
                borderColor: colors.border,
                transition: 'border-color 0.1s',
              },
              '&:hover fieldset': {
                borderColor: colors.borderStrong,
              },
              '&.Mui-focused fieldset': {
                borderWidth: 1,
                borderColor: colors.borderStrong,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            fontWeight: 500,
            fontSize: '11px',
            height: '24px',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.bg,
            borderRight: `1px solid ${colors.border}`,
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.bg,
            color: colors.text,
            boxShadow: 'none',
            borderBottom: `1px solid ${colors.border}`,
          },
        },
      },
    },
  })
}






