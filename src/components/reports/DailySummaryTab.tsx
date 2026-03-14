import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import type { DailySummaryItem } from '../../types/reports'

interface DailySummaryTabProps {
  dailyStartDate: string
  dailyEndDate: string
  dailySummary?: DailySummaryItem[]
  isDailySummaryLoading: boolean
  dailySummaryError?: { message: string }
  onDailyStartDateChange: (value: string) => void
  onDailyEndDateChange: (value: string) => void
  onRefetchDailySummary: () => void
}

const DailySummaryTab: React.FC<DailySummaryTabProps> = ({
  dailyStartDate,
  dailyEndDate,
  dailySummary,
  isDailySummaryLoading,
  dailySummaryError,
  onDailyStartDateChange,
  onDailyEndDateChange,
  onRefetchDailySummary,
}) => {
  const theme = useTheme()
  const mode = theme.palette.mode
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box>
      {/* TOOLBAR INTEGRATED */}
      <Box sx={{
        p: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: mode === 'light' ? alpha('#fff', 0.5) : alpha('#000', 0.2)
      }}>
        <TextField
          label="Fecha Inicio"
          type="date"
          value={dailyStartDate}
          onChange={(e) => onDailyStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{
            width: { xs: '100%', sm: 160 },
            '& .MuiInputBase-root': { 
              height: 36, 
              fontSize: '12px', 
              borderRadius: 1.5, 
              bgcolor: 'background.paper',
              '& input': { py: 0 }
            },
            '& .MuiInputLabel-root': { 
              fontSize: '12px',
              bgcolor: 'background.paper',
              px: 0.5,
              borderRadius: 0.5,
              transform: 'translate(14px, -9px) scale(0.9)', // Explicitly move label up
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.8)',
            }
          }}
        />
        <TextField
          label="Fecha Fin"
          type="date"
          value={dailyEndDate}
          onChange={(e) => onDailyEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{
            width: { xs: '100%', sm: 160 },
            '& .MuiInputBase-root': { 
              height: 36, 
              fontSize: '12px', 
              borderRadius: 1.5, 
              bgcolor: 'background.paper',
              '& input': { py: 0 }
            },
            '& .MuiInputLabel-root': { 
              fontSize: '12px',
              bgcolor: 'background.paper',
              px: 0.5,
              borderRadius: 0.5,
              transform: 'translate(14px, -9px) scale(0.9)', // Explicitly move label up
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.8)',
            }
          }}
        />
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            console.log('Refetching Daily Summary...')
            onRefetchDailySummary()
          }}
          disabled={isDailySummaryLoading}
          sx={{
            height: 36,
            px: 3,
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: 1.5,
            bgcolor: 'text.primary',
            color: 'background.paper',
            textTransform: 'none',
            '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.8) }
          }}
        >
          {isDailySummaryLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={14} color="inherit" />
              <span>Cargando...</span>
            </Box>
          ) : 'Actualizar Reporte'}
        </Button>
      </Box>

      {dailySummaryError && (
        <Alert severity="error" sx={{ m: 2, borderRadius: 1.5, py: 0.5 }}>
          <Typography variant="caption">{dailySummaryError.message}</Typography>
        </Alert>
      )}

      {dailySummary && (
        isMobile ? (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {dailySummary.map((item: DailySummaryItem, index: number) => (
                <Grid item xs={12} key={item.day || `item-${index}`}>
                  <Card sx={{ borderRadius: 1.5, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                        {new Date(item.day).toLocaleDateString('es-ES', { dateStyle: 'long' })}
                      </Typography>
                      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
                        <Box>
                          <Typography sx={{ fontSize: '10px', color: 'text.disabled', textTransform: 'uppercase' }}>Entradas</Typography>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'success.main' }}>+{item.total_in}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '10px', color: 'text.disabled', textTransform: 'uppercase' }}>Salidas</Typography>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'error.main' }}>{item.total_out}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontSize: '10px', color: 'text.disabled', textTransform: 'uppercase' }}>Balance</Typography>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{item.balance}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <TableContainer sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Entradas</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Salidas</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.2, fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dailySummary.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">No hay datos para este rango</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  dailySummary.map((item: DailySummaryItem, index: number) => (
                    <TableRow
                      key={item.day || `item-${index}`}
                      hover
                      sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) } }}
                    >
                      <TableCell sx={{ py: 1.2 }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                          {new Date(item.day).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '12px', color: 'success.main', fontWeight: 700 }}>
                          {item.total_in > 0 ? `+${item.total_in}` : (item.total_in || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '12px', color: item.total_out < 0 ? 'error.main' : 'text.secondary', fontWeight: 700 }}>
                          {item.total_out || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: (item.balance || 0) >= 0 ? 'text.primary' : 'error.main' }}>
                          {item.balance || 0}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Box>
  )
}

export default DailySummaryTab
