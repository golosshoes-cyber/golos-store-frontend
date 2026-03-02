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
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material'
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumen Diario de Inventario
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
        <TextField
          label="Fecha Inicio"
          type="date"
          value={dailyStartDate}
          onChange={(e) => onDailyStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          fullWidth={isMobile}
        />
        <TextField
          label="Fecha Fin"
          type="date"
          value={dailyEndDate}
          onChange={(e) => onDailyEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          fullWidth={isMobile}
        />
      </Box>
      <Button
        variant="contained"
        onClick={onRefetchDailySummary}
        disabled={isDailySummaryLoading}
        sx={{
          mb: 3,
          width: { xs: '100%', sm: 'auto' },
          borderRadius: 2,
          fontWeight: 'medium',
        }}
      >
        {isDailySummaryLoading ? <CircularProgress size={20} /> : 'Cargar Resumen'}
      </Button>

      {dailySummaryError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Error al cargar el resumen: {dailySummaryError.message}
        </Alert>
      )}

      {dailySummary && (
        isMobile ? (
          <Grid container spacing={2}>
            {dailySummary.map((item: DailySummaryItem, index: number) => (
              <Grid item xs={12} key={item.day || `item-${index}`}>
                <Card sx={{
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }
                }}>
                  <CardContent sx={{ p: 2 }}>
                    {/* Header con fecha */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          lineHeight: 1.2,
                        }}>
                          {new Date(item.day).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Información de resumen diario */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
                        gap: 1.5,
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          textAlign: 'center',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #e8f5e8 0%, #4caf50 100%)',
                          border: '1px solid #4caf50'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                          Entradas
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          fontSize: { xs: '1rem', sm: '1.2rem' },
                          color: '#2e7d32'
                        }}>
                          +{item.total_in || 0}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          textAlign: 'center',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #ffebee 0%, #f44336 100%)',
                          border: '1px solid #f44336'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                          Salidas
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          fontSize: { xs: '1rem', sm: '1.2rem' },
                          color: '#d32f2f'
                        }}>
                          {item.total_out || 0}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          textAlign: 'center',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #f3e5f5 0%, #ba68c8 100%)',
                          border: '1px solid #ba68c8'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                          Balance
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          fontSize: { xs: '1rem', sm: '1.2rem' },
                          color: item.balance >= 0 ? '#7b1fa2' : '#d32f2f'
                        }}>
                          {item.balance || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Total Entradas</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Total Salidas</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dailySummary.map((item: DailySummaryItem, index: number) => (
                  <TableRow key={item.day || `item-${index}`} hover>
                    <TableCell>{new Date(item.day).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>{item.total_in}</TableCell>
                    <TableCell>{item.total_out}</TableCell>
                    <TableCell>{item.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Box>
  )
}

export default DailySummaryTab
