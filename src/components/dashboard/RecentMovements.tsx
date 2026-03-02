import React from 'react'
import {
  Grid,
  Paper,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Chip,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
} from '@mui/icons-material'
import type { RecentMovementsProps } from '../../types/dashboard'

const RecentMovements: React.FC<RecentMovementsProps> = ({ movements, loading }) => {
  const theme = useTheme()

  return (
    <Grid item xs={12} lg={6}>
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          height: { xs: 320, sm: 300 },
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.18 : 0.28)}`,
          background:
            theme.palette.mode === 'light'
              ? alpha('#ffffff', 0.96)
              : alpha('#0b1220', 0.86),
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 8px 22px ${alpha('#0f172a', 0.08)}`
              : `0 14px 26px ${alpha('#000000', 0.46)}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Movimientos Recientes</Typography>
          <SwapHoriz color="action" />
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              pr: 0.5,
              scrollbarWidth: 'thin',
              scrollbarColor: 'transparent transparent',
              '&::-webkit-scrollbar': { width: 5, height: 5 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'transparent',
                borderRadius: 8,
              },
              '&:hover': {
                scrollbarColor:
                  theme.palette.mode === 'light'
                    ? alpha('#0f172a', 0.24) + ' transparent'
                    : alpha('#e2e8f0', 0.26) + ' transparent',
              },
              '&:hover::-webkit-scrollbar-thumb': {
                background:
                  theme.palette.mode === 'light'
                    ? alpha('#0f172a', 0.2)
                    : alpha('#e2e8f0', 0.24),
              },
            }}
          >
            {movements?.map((movement, index: number) => (
              <React.Fragment key={movement.id}>
                <ListItem
                  sx={{
                    px: 0,
                    transition: 'all 0.2s ease',
                    '@media (hover: hover) and (pointer: fine)': {
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        borderRadius: 2,
                        px: 1,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {movement.type === 'purchase' || movement.type_display?.includes('compra') ? (
                      <TrendingUp color="success" />
                    ) : movement.type_display?.includes('venta') || movement.type_display?.includes('salida') ? (
                      <TrendingDown color="error" />
                    ) : (
                      <SwapHoriz color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        gap={0.8}
                        sx={{ minWidth: 0 }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '0.84rem', sm: '0.9rem' },
                          }}
                        >
                          {movement.product_name}
                        </Typography>
                        <Chip
                          label={movement.type_display}
                          color={
                            movement.type === 'purchase' || movement.type_display?.includes('compra') ? 'success' :
                            movement.type_display?.includes('venta') || movement.type_display?.includes('salida') ? 'error' : 'info'
                          }
                          size="small"
                          sx={{
                            maxWidth: '100%',
                            '& .MuiChip-label': {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            },
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          fontSize: { xs: '0.72rem', sm: '0.75rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {movement.variant_info} • Cantidad: {Math.abs(movement.quantity)} • {new Date(movement.created_at).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < (movements?.length || 0) - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
            {(!movements || movements.length === 0) && (
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="No hay movimientos recientes"
                  secondary="Los movimientos de inventario aparecerán aquí"
                />
              </ListItem>
            )}
          </List>
        )}
      </Paper>
    </Grid>
  )
}

export default RecentMovements



