import { useEffect, useState } from 'react'
import { Box, Paper, Step, StepContent, StepLabel, Stepper, Typography, CircularProgress } from '@mui/material'
import { api } from '../../services/api'
import { getStatusLabel } from '../../utils/shippingHelpers'

interface TrackEvent {
  status: string
  date: string
  description?: string
}

interface ShipmentTrackerProps {
  trackingNumber: string
}

export default function ShipmentTracker({ trackingNumber }: ShipmentTrackerProps) {
  const [events, setEvents] = useState<TrackEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    const fetchTracking = async () => {
      try {
        const response = await api.get(`/api/store/shipping/track/${trackingNumber}/`)
        // Asume estructura { timeline: [...] }
        setEvents(response.data.timeline || [])
        setError(null)
      } catch (err: any) {
        if (!events.length) setError('No se pudo cargar el historial de rastreo.')
      } finally {
        setLoading(false)
      }
    }

    if (trackingNumber) {
      setLoading(true)
      void fetchTracking()
      interval = setInterval(fetchTracking, 30000) // Polling cada 30 segundos
    }

    return () => clearInterval(interval)
  }, [trackingNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!trackingNumber) return null

  if (loading && events.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    )
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Historial de Seguimiento
      </Typography>
      <Stepper orientation="vertical" activeStep={events.length - 1}>
        {events.map((event, index) => (
          <Step key={index} expanded>
            <StepLabel>
              <Typography variant="body2" fontWeight={600}>
                {getStatusLabel(event.status)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(event.date).toLocaleString()}
              </Typography>
            </StepLabel>
            <StepContent>
              {event.description && (
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
              )}
            </StepContent>
          </Step>
        ))}
        {events.length === 0 && (
          <Typography variant="body2" color="text.secondary" p={2}>
            Aún no hay eventos registrados para esta guía.
          </Typography>
        )}
      </Stepper>
    </Paper>
  )
}
