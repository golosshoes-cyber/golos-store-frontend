import { PaletteMode } from '@mui/material'
import { alpha, createTheme } from '@mui/material/styles'

export const createAppTheme = (mode: PaletteMode) =>
  // Tokens base para mantener consistencia visual entre temas.
  // Evitamos tocar estilos especiales por componente (ej. botones gradiente).
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb',
        light: '#3b82f6',
        dark: '#1e40af',
      },
      secondary: {
        main: '#10b981',
      },
      error: {
        main: '#ef4444',
      },
      warning: {
        main: '#f59e0b',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
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
            scrollbarWidth: 'thin',
            scrollbarColor:
              mode === 'light'
                ? `${alpha('#0f172a', 0.26)} ${alpha('#0f172a', 0.04)}`
                : `${alpha('#e2e8f0', 0.28)} ${alpha('#ffffff', 0.03)}`, 
          },
          body: {
            maxWidth: '100%',
            overflowX: 'hidden',
            '& #root': {
              maxWidth: '100%',
              overflowX: 'hidden',
            },
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 6,
              height: 6,
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              background:
                mode === 'light'
                  ? alpha('#0f172a', 0.04)
                  : alpha('#ffffff', 0.03),
              borderRadius: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              background:
                mode === 'light'
                  ? alpha('#0f172a', 0.2)
                  : alpha('#e2e8f0', 0.22),
              borderRadius: 8,
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              background:
                mode === 'light'
                  ? alpha('#0f172a', 0.32)
                  : alpha('#e2e8f0', 0.34),
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              background: 'transparent',
            },
            '& .swal2-popup.swal2-acrylic-popup': {
              borderRadius: 16,
              border: `1px solid ${
                mode === 'light' ? alpha('#1e293b', 0.16) : alpha('#cbd5e1', 0.24)
              }`,
              boxShadow:
                mode === 'light'
                  ? `0 20px 44px ${alpha('#0f172a', 0.28)}`
                  : `0 24px 52px ${alpha('#000000', 0.56)}`,
              backdropFilter: 'blur(14px) saturate(130%)',
              WebkitBackdropFilter: 'blur(14px) saturate(130%)',
            },
            '& .swal2-title': {
              fontWeight: 700,
            },
            '& .swal2-html-container': {
              color: mode === 'light' ? alpha('#0f172a', 0.82) : alpha('#e2e8f0', 0.88),
            },
            '& .swal2-actions .swal2-styled': {
              borderRadius: 10,
              fontWeight: 600,
              padding: '0.55rem 1rem',
              border: 'none',
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            border: `1px solid ${
              mode === 'light' ? alpha('#1e293b', 0.08) : alpha('#cbd5e1', 0.14)
            }`,
            backgroundImage: 'none',
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          fullWidth: true,
          scroll: 'paper',
          keepMounted: false,
          disableScrollLock: false,
        },
        styleOverrides: {
          root: {
            '& .MuiBackdrop-root': {
              backgroundColor:
                mode === 'light'
                  ? alpha('#0f172a', 0.34)
                  : alpha('#020617', 0.62),
              backdropFilter: 'blur(2px)',
            },
          },
          paper: {
            borderRadius: 16,
            border: `1px solid ${
              mode === 'light' ? alpha('#1e293b', 0.14) : alpha('#cbd5e1', 0.2)
            }`,
            background:
              mode === 'light'
                ? `linear-gradient(180deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha('#f8fafc', 0.96)} 100%)`
                : `linear-gradient(180deg, ${alpha('#0f172a', 0.95)} 0%, ${alpha('#111827', 0.92)} 100%)`,
            boxShadow:
              mode === 'light'
                ? `0 16px 36px ${alpha('#0f172a', 0.2)}`
                : `0 18px 40px ${alpha('#000000', 0.55)}`,
            margin: 16,
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
            '@media (max-width:600px)': {
              borderRadius: 12,
              margin: 10,
              width: 'calc(100% - 20px)',
              maxHeight: 'calc(100% - 20px)',
            },
            '@media (max-width:360px)': {
              borderRadius: 10,
              margin: 8,
              width: 'calc(100% - 16px)',
              maxHeight: 'calc(100% - 16px)',
            },
          },
          paperFullScreen: {
            borderRadius: 0,
            margin: 0,
            maxHeight: '100%',
            width: '100%',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'transparent transparent',
            '&::-webkit-scrollbar': {
              width: 5,
              height: 5,
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'transparent',
              borderRadius: 8,
            },
            '&:hover': {
              scrollbarColor:
                mode === 'light'
                  ? alpha('#0f172a', 0.24) + ' transparent'
                  : alpha('#e2e8f0', 0.26) + ' transparent',
            },
            '&:hover::-webkit-scrollbar-thumb': {
              background:
                mode === 'light'
                  ? alpha('#0f172a', 0.2)
                  : alpha('#e2e8f0', 0.24),
            },
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: '18px 20px 10px',
            borderBottom: `1px solid ${
              mode === 'light' ? alpha('#1e293b', 0.08) : alpha('#cbd5e1', 0.14)
            }`,
            '@media (max-width:600px)': {
              padding: '14px 14px 8px',
            },
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: '16px 20px',
            '@media (max-width:600px)': {
              padding: '12px 14px',
            },
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: '12px 20px 16px',
            borderTop: `1px solid ${
              mode === 'light' ? alpha('#1e293b', 0.08) : alpha('#cbd5e1', 0.14)
            }`,
            '@media (max-width:600px)': {
              padding: '10px 14px 12px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            width: '100%',
            minWidth: 0,
            boxShadow:
              mode === 'light'
                ? '0 2px 8px rgba(0,0,0,0.1)'
                : `0 2px 10px ${alpha('#000000', 0.35)}`,
            borderRadius: 12,
            border: `1px solid ${
              mode === 'light' ? alpha('#1e293b', 0.08) : alpha('#cbd5e1', 0.16)
            }`,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            '@media (max-width:360px)': {
              padding: '12px !important',
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${
              mode === 'light' ? alpha('#1e293b', 0.1) : alpha('#cbd5e1', 0.2)
            }`,
            background:
              mode === 'light'
                ? `linear-gradient(180deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#f8fafc', 0.95)} 100%)`
                : `linear-gradient(180deg, ${alpha('#0f172a', 0.82)} 0%, ${alpha('#111827', 0.88)} 100%)`,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === 'light'
                ? alpha('#e2e8f0', 0.65)
                : alpha('#334155', 0.55),
            '& .MuiTableCell-root': {
              fontWeight: 700,
              letterSpacing: 0.2,
              color: mode === 'light' ? '#0f172a' : '#e2e8f0',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor:
              mode === 'light'
                ? alpha('#1e293b', 0.08)
                : alpha('#cbd5e1', 0.16),
            fontSize: '0.875rem',
            '@media (max-width:360px)': {
              fontSize: '0.72rem',
              padding: '8px 6px',
            },
          },
          head: {
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            '@media (max-width:360px)': {
              fontSize: '0.68rem',
              letterSpacing: 0.2,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 160ms ease',
            '&:not(.MuiTableRow-head):hover': {
              backgroundColor:
                mode === 'light'
                  ? alpha('#2563eb', 0.05)
                  : alpha('#60a5fa', 0.1),
            },
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            '@media (max-width:360px)': {
              minWidth: 28,
              height: 28,
              fontSize: '0.72rem',
              margin: '0 2px',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 10,
            fontWeight: 600,
            letterSpacing: 0.1,
            transition: 'all 180ms ease',
          },
          sizeSmall: {
            minHeight: 32,
            paddingInline: 10,
            paddingBlock: 4,
            borderRadius: 8,
            fontSize: '0.8rem',
          },
          sizeMedium: {
            minHeight: 38,
            paddingInline: 16,
            paddingBlock: 7,
          },
          sizeLarge: {
            minHeight: 44,
            paddingInline: 20,
            paddingBlock: 10,
            borderRadius: 12,
          },
          contained: {
            boxShadow:
              mode === 'light'
                ? `0 4px 14px ${alpha('#2563eb', 0.24)}`
                : `0 4px 14px ${alpha('#0b1220', 0.5)}`,
            '&:hover': {
              boxShadow:
                mode === 'light'
                  ? `0 8px 20px ${alpha('#2563eb', 0.3)}`
                  : `0 8px 22px ${alpha('#0b1220', 0.62)}`,
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedSizeSmall: {
            boxShadow:
              mode === 'light'
                ? `0 2px 10px ${alpha('#2563eb', 0.2)}`
                : `0 2px 10px ${alpha('#0b1220', 0.45)}`,
          },
          outlined: {
            borderWidth: 1.5,
            borderColor:
              mode === 'light'
                ? alpha('#2563eb', 0.35)
                : alpha('#93c5fd', 0.4),
            '&:hover': {
              borderWidth: 1.5,
              backgroundColor:
                mode === 'light'
                  ? alpha('#2563eb', 0.06)
                  : alpha('#93c5fd', 0.12),
              borderColor:
                mode === 'light'
                  ? alpha('#2563eb', 0.55)
                  : alpha('#93c5fd', 0.6),
            },
          },
          text: {
            '&:hover': {
              backgroundColor:
                mode === 'light'
                  ? alpha('#2563eb', 0.08)
                  : alpha('#93c5fd', 0.14),
            },
          },
          textSizeSmall: {
            paddingInline: 8,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'all 180ms ease',
            '&:hover': {
              backgroundColor:
                mode === 'light'
                  ? alpha('#2563eb', 0.1)
                  : alpha('#93c5fd', 0.14),
            },
          },
          sizeSmall: {
            width: 32,
            height: 32,
            padding: 6,
            border: `1px solid ${
              mode === 'light' ? alpha('#334155', 0.12) : alpha('#cbd5e1', 0.2)
            }`,
            '&.MuiIconButton-colorPrimary': {
              color: '#2563eb',
              backgroundColor: alpha('#2563eb', mode === 'light' ? 0.1 : 0.2),
            },
            '&.MuiIconButton-colorWarning': {
              color: '#f59e0b',
              backgroundColor: alpha('#f59e0b', mode === 'light' ? 0.12 : 0.22),
            },
            '&.MuiIconButton-colorError': {
              color: '#ef4444',
              backgroundColor: alpha('#ef4444', mode === 'light' ? 0.11 : 0.22),
            },
            '&.MuiIconButton-colorSuccess': {
              color: '#10b981',
              backgroundColor: alpha('#10b981', mode === 'light' ? 0.11 : 0.22),
            },
            '&.MuiIconButton-colorInfo': {
              color: '#0ea5e9',
              backgroundColor: alpha('#0ea5e9', mode === 'light' ? 0.11 : 0.22),
            },
          },
        },
      },
    },
  })





