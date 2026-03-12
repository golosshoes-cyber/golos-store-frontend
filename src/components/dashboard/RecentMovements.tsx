import React from 'react'
import {
  Grid,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
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
      <Box
        sx={{
          p: 2.5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: 'none',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Movimientos Recientes
          </Typography>
          <SwapHoriz sx={{ fontSize: 18, color: 'text.secondary' }} />
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
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {movement.type === 'purchase' || movement.type_display?.includes('compra') ? (
                      <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                    ) : movement.type_display?.includes('venta') || movement.type_display?.includes('salida') ? (
                      <TrendingDown sx={{ fontSize: 18, color: 'error.main' }} />
                    ) : (
                      <SwapHoriz sx={{ fontSize: 18, color: 'info.main' }} />
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
                        <Box sx={{ 
                          display: 'inline-flex', 
                          px: 1, 
                          py: 0.25, 
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: 600,
                          bgcolor: (movement.type === 'purchase' || movement.type_display?.includes('compra')) 
                            ? alpha(theme.palette.success.main, 0.08) 
                            : (movement.type_display?.includes('venta') || movement.type_display?.includes('salida'))
                              ? alpha(theme.palette.error.main, 0.08)
                              : alpha(theme.palette.info.main, 0.08),
                          color: (movement.type === 'purchase' || movement.type_display?.includes('compra')) 
                            ? theme.palette.success.main 
                            : (movement.type_display?.includes('venta') || movement.type_display?.includes('salida'))
                              ? theme.palette.error.main
                              : theme.palette.info.main,
                          border: `1px solid ${(movement.type === 'purchase' || movement.type_display?.includes('compra')) 
                            ? alpha(theme.palette.success.main, 0.2) 
                            : (movement.type_display?.includes('venta') || movement.type_display?.includes('salida'))
                              ? alpha(theme.palette.error.main, 0.2)
                              : alpha(theme.palette.info.main, 0.2)}`
                        }}>
                          {movement.type_display}
                        </Box>
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
      </Box>
    </Grid>
  )
}

export default RecentMovements



