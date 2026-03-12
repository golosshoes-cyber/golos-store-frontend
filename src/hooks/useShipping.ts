import { useState, useCallback } from 'react'
import { api } from '../services/api'

export interface ShippingQuoteService {
  name: string
  cost: string
  eta_hours: number
  available: boolean
}

export interface ShippingQuoteResponse {
  services: ShippingQuoteService[]
}

export const useShippingQuote = () => {
  const [quote, setQuote] = useState<ShippingQuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getQuote = useCallback(async (destination: { city: string, department: string }, weight: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/api/store/shipping/quote/', {
        destination,
        weight_grams: weight
      })
      setQuote(response.data)
    } catch (err: any) {
      console.error('Error getting shipping quote (using mock as fallback):', err)
      setError('No se pudo obtener cotización real, usando estimado local.')
      // Importante: El fallback requiere uso dinamico de las constantes o simple inyeccion
      import('../constants/shippingConstants').then(
        ({ MOCK_SHIPPING_QUOTE }) => setQuote(MOCK_SHIPPING_QUOTE)
      )
    } finally {
      setLoading(false)
    }
  }, [])

  return { quote, loading, error, getQuote }
}
