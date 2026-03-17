export const extractApiErrorMessage = (error: any, fallback: string): string => {
  const normalizeMessage = (message: string) => {
    const trimmed = String(message || '').trim()
    if (!trimmed) return fallback

    // Detect HTML Server Errors
    if (trimmed.toLowerCase().includes('<!doctype html') || trimmed.toLowerCase().includes('<html')) {
      return 'Error interno del servidor (500). Por favor, contacta al administrador.'
    }

    // Detect technical database constraint messages
    if (trimmed.includes('referenced through protected foreign keys') || trimmed.includes('Cannot delete some instances of model')) {
      return 'No se puede eliminar porque tiene elementos asociados (variantes o imágenes). Borra esos elementos primero.'
    }

    // Handle python-list-like strings: "['msg']" or '["msg"]'
    if (
      (trimmed.startsWith("['") && trimmed.endsWith("']")) ||
      (trimmed.startsWith('["') && trimmed.endsWith('"]'))
    ) {
      return trimmed
        .slice(2, -2)
        .replace(/\\'/g, "'")
        .replace(/'\s*,\s*'/g, ', ')
        .replace(/"\s*,\s*"/g, ', ')
    }
    return trimmed
  }

  const data = error?.response?.data

  if (Array.isArray(data) && data.length > 0) {
    return normalizeMessage(data.map((item) => String(item)).join(' '))
  }

  if (typeof data === 'string') {
    return normalizeMessage(data)
  }

  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return normalizeMessage(data.errors.map((item: unknown) => String(item)).join(' '))
  }

  if (data?.error) {
    if (Array.isArray(data.error) && data.error.length > 0) {
      return normalizeMessage(data.error.map((item: unknown) => String(item)).join(' '))
    }
    if (typeof data.error === 'string') {
      return normalizeMessage(data.error)
    }
  }

  if (data?.detail) {
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      return normalizeMessage(data.detail.map((item: unknown) => String(item)).join(' '))
    }
    if (typeof data.detail === 'string') {
      return normalizeMessage(data.detail)
    }
  }

  if (data && typeof data === 'object') {
    for (const value of Object.values(data)) {
      if (Array.isArray(value) && value.length > 0) {
        return normalizeMessage(value.map((item) => String(item)).join(' '))
      }
      if (typeof value === 'string') {
        return normalizeMessage(value)
      }
    }
  }

  if (typeof error?.message === 'string' && !error.message.includes('status code')) {
    return normalizeMessage(error.message)
  }

  return fallback
}
