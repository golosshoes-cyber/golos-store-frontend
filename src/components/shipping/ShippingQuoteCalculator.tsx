import { useEffect } from 'react'
import { Box, Card, CardActionArea, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { LocalShippingRounded as LocalShippingIcon } from '@mui/icons-material'
import { useShippingQuote, type ShippingQuoteService } from '../../hooks/useShipping'

interface ShippingQuoteCalculatorProps {
  destinationCity: string
  destinationDepartment: string
  weightGrams: number
  selectedService: ShippingQuoteService | null
  onSelectService: (service: ShippingQuoteService) => void
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export default function ShippingQuoteCalculator({
  destinationCity,
  destinationDepartment,
  weightGrams,
  selectedService,
  onSelectService,
}: ShippingQuoteCalculatorProps) {
  const { quote, loading, error, getQuote } = useShippingQuote()

  useEffect(() => {
    if (destinationCity && destinationDepartment && weightGrams > 0) {
      void getQuote({ city: destinationCity, department: destinationDepartment }, weightGrams)
    }
  }, [destinationCity, destinationDepartment, weightGrams, getQuote])

  if (!destinationCity || !destinationDepartment) {
    return (
      <Typography variant="body2" color="text.secondary">
        Ingresa un destino completo para calcular opciones de envío.
      </Typography>
    )
  }

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">Calculando envíos...</Typography>
      </Box>
    )
  }

  if (error) {
    return <Typography variant="body2" color="error">{error}</Typography>
  }

  if (!quote || quote.services.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay opciones de envío disponibles para este destino.
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">Opciones de Envío</Typography>
      <Stack spacing={1}>
        {quote.services.map((service, index) => {
          const isSelected = selectedService?.name === service.name
          return (
            <Card
              key={index}
              variant="outlined"
              sx={{
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'primary.50' : 'background.paper',
                transition: 'all 0.2s ease',
              }}
            >
              <CardActionArea onClick={() => onSelectService(service)} disabled={!service.available}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <LocalShippingIcon color={isSelected ? 'primary' : 'disabled'} />
                      <Box>
                        <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                          {service.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Entrega estimada: {service.eta_hours} hrs
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color={isSelected ? 'primary.main' : 'inherit'}>
                      {currencyFormatter.format(Number(service.cost))}
                    </Typography>
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
