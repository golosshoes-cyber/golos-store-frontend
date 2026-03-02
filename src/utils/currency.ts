/**
 * Formatea un valor numérico como moneda COP (Pesos Colombianos) sin decimales
 * @param value - Valor numérico o string a formatear
 * @returns - String formateado como moneda COP
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : (value || 0)
  return `$${numValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

/**
 * Formatea un valor numérico como moneda COP (Pesos Colombianos) con 2 decimales
 * @param value - Valor numérico o string a formatear
 * @returns - String formateado como moneda COP con .00
 */
export const formatCurrencyWithDecimals = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
  return `$${numValue.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Formatea un valor numérico simple (sin símbolo de moneda)
 * @param value - Valor numérico o string a formatear
 * @returns - String formateado con separadores de miles
 */
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
  return numValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
