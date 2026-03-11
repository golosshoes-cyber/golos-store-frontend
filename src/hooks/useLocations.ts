import { useState, useCallback } from 'react'
import { api } from '../services/api'

export interface LocationDepartment {
  code: string
  name: string
}

export interface LocationCity {
  code: string
  name: string
}

export const useLocations = () => {
  const [departments, setDepartments] = useState<LocationDepartment[]>([])
  const [cities, setCities] = useState<LocationCity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDepartments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/api/store/locations/departments/')
      if (response.data?.departments) {
        setDepartments(response.data.departments)
      } else if (Array.isArray(response.data)) {
        setDepartments(response.data)
      }
    } catch (err: any) {
      console.error('Error loading departments:', err)
      setError('No se pudieron cargar los departamentos.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCities = useCallback(async (departmentCode: string) => {
    if (!departmentCode) {
      setCities([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/api/store/locations/departments/${departmentCode}/cities/`)
      if (response.data?.cities) {
        setCities(response.data.cities)
      } else if (Array.isArray(response.data)) {
        setCities(response.data)
      }
    } catch (err: any) {
      console.error('Error loading cities:', err)
      setError('No se pudieron cargar las ciudades.')
      setCities([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { departments, cities, loading, error, loadDepartments, loadCities }
}
