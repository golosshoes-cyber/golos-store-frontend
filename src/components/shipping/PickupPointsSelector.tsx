import { useEffect, useState } from 'react'
import { Card, CardActionArea, CardContent, CircularProgress, Stack, Typography, Box } from '@mui/material'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import { api } from '../../services/api'

interface PickupPoint {
  id: string
  name: string
  address: string
  schedule: string
  services: string[]
}

interface PickupPointsSelectorProps {
  destinationCode: string
  departmentCode: string
  onPickupPointSelected: (point: PickupPoint | null) => void
}

export default function PickupPointsSelector({
  destinationCode,
  departmentCode,
  onPickupPointSelected,
}: PickupPointsSelectorProps) {
  const [points, setPoints] = useState<PickupPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!destinationCode || !departmentCode) return

    const loadPoints = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/api/store/pickup-points/?city=${destinationCode}&department=${departmentCode}`)
        setPoints(response.data.points || [])
      } catch (err) {
        console.error('Error loading pickup points', err)
        // Fallback or empty state
        setPoints([])
      } finally {
        setLoading(false)
      }
    }
    void loadPoints()
  }, [destinationCode, departmentCode])

  const handleSelect = (point: PickupPoint) => {
    if (selectedId === point.id) {
      setSelectedId(null)
      onPickupPointSelected(null)
    } else {
      setSelectedId(point.id)
      onPickupPointSelected(point)
    }
  }

  if (!destinationCode) return null

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">Buscando puntos de recogida cercanos...</Typography>
      </Box>
    )
  }

  if (points.length === 0) {
    return null // Ocultar componente si no hay puntos y dejarlos seguir con envio estandar
  }

  return (
    <Stack spacing={1.5} mt={2}>
      <Typography variant="subtitle2">Puntos de recogida en tu zona (Opcional)</Typography>
      <Stack spacing={1}>
        {points.map((point) => {
          const isSelected = selectedId === point.id
          return (
            <Card
              key={point.id}
              variant="outlined"
              sx={{
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'primary.50' : 'background.paper',
              }}
            >
              <CardActionArea onClick={() => handleSelect(point)}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box display="flex" alignItems="flex-start" gap={1.5}>
                    <PlaceRoundedIcon color={isSelected ? 'primary' : 'action'} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{point.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {point.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Horario: {point.schedule}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        })}
      </Stack>
    </Stack>
  )
}
