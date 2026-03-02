export interface StoreCartItem {
  variant_id: number
  quantity: number
}

const STORAGE_KEY = 'store_cart_items'

export const getStoreCartItems = (): StoreCartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoreCartItem[]
    return Array.isArray(parsed)
      ? parsed.filter((item) => Number.isInteger(item.variant_id) && item.variant_id > 0 && Number.isInteger(item.quantity) && item.quantity > 0)
      : []
  } catch {
    return []
  }
}

export const saveStoreCartItems = (items: StoreCartItem[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const addItemToStoreCart = (variantId: number, quantity = 1): StoreCartItem[] => {
  const current = getStoreCartItems()
  const existing = current.find((item) => item.variant_id === variantId)

  if (existing) {
    existing.quantity += quantity
  } else {
    current.push({ variant_id: variantId, quantity })
  }

  saveStoreCartItems(current)
  return current
}

export const updateStoreCartItemQuantity = (variantId: number, quantity: number): StoreCartItem[] => {
  const sanitized = Math.max(1, Math.floor(quantity))
  const updated = getStoreCartItems().map((item) =>
    item.variant_id === variantId ? { ...item, quantity: sanitized } : item
  )
  saveStoreCartItems(updated)
  return updated
}

export const removeStoreCartItem = (variantId: number): StoreCartItem[] => {
  const filtered = getStoreCartItems().filter((item) => item.variant_id !== variantId)
  saveStoreCartItems(filtered)
  return filtered
}

export const clearStoreCart = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getStoreCartItemsCount = (): number => {
  return getStoreCartItems().reduce((sum, item) => sum + item.quantity, 0)
}
