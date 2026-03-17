const STORAGE_KEY = 'store_wishlist_ids'

export const getWishlistIds = (): number[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'number') : []
  } catch {
    return []
  }
}

export const toggleWishlistItem = (productId: number): number[] => {
  const current = getWishlistIds()
  const exists = current.includes(productId)
  const updated = exists 
    ? current.filter(id => id !== productId)
    : [...current, productId]
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  
  // Custom event to notify other components (like Header)
  window.dispatchEvent(new CustomEvent('wishlist-updated'))
  
  return updated
}

export const isInWishlist = (productId: number): boolean => {
  return getWishlistIds().includes(productId)
}

export const getWishlistCount = (): number => {
  return getWishlistIds().length
}
