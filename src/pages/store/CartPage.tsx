import { useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, CardMedia, Container, Divider, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { storeService } from '../../services/storeService'
import type { StoreCartValidationItem } from '../../types/store'
import {
  getStoreCartItems,
  removeStoreCartItem,
  updateStoreCartItemQuantity,
  type StoreCartItem,
} from '../../utils/storeCart'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='320' height='240' viewBox='0 0 320 240'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#e5e7eb'/>
        <stop offset='100%' stop-color='#cbd5e1'/>
      </linearGradient>
    </defs>
    <rect width='320' height='240' fill='url(#g)'/>
    <circle cx='160' cy='98' r='24' fill='#64748b' opacity='0.45'/>
    <rect x='98' y='142' width='124' height='12' rx='6' fill='#64748b' opacity='0.5'/>
  </svg>
`)}`

const money = (value: string) => currencyFormatter.format(Number(value))

export default function CartPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [items, setItems] = useState<StoreCartItem[]>([])
  const [validatedItems, setValidatedItems] = useState<StoreCartValidationItem[]>([])
  const [total, setTotal] = useState('0')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [returnToStoreFly, setReturnToStoreFly] = useState<{
    id: number
    startX: number
    startY: number
    deltaX: number
    deltaY: number
    imageUrl: string
    active: boolean
  } | null>(null)
  const storeLinkRef = useRef<HTMLAnchorElement | null>(null)

  const loadAndValidate = async () => {
    const current = getStoreCartItems()
    setItems(current)

    if (current.length === 0) {
      setValidatedItems([])
      setTotal('0')
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await storeService.validateCart(current)
      setValidatedItems(response.items)
      setTotal(response.total)
    } catch {
      setErrorMessage('No se pudo validar el carrito. Revisa stock y cantidades.')
      setValidatedItems([])
      setTotal('0')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAndValidate()
  }, [])

  const handleQuantityChange = (variantId: number, quantity: number) => {
    const updated = updateStoreCartItemQuantity(variantId, quantity)
    setItems(updated)
  }

  const triggerReturnToStoreAnimation = (sourceElement?: HTMLElement | null, imageUrl?: string) => {
    if (!sourceElement || !storeLinkRef.current) return
    const sourceRect = sourceElement.getBoundingClientRect()
    const targetRect = storeLinkRef.current.getBoundingClientRect()
    const startX = sourceRect.left + sourceRect.width / 2 - 18
    const startY = sourceRect.top + sourceRect.height / 2 - 18
    const endX = targetRect.left + targetRect.width / 2 - 18
    const endY = targetRect.top + targetRect.height / 2 - 18
    const id = Date.now()
    setReturnToStoreFly({
      id,
      startX,
      startY,
      deltaX: endX - startX,
      deltaY: endY - startY,
      imageUrl: imageUrl || FALLBACK_IMAGE,
      active: false,
    })
    requestAnimationFrame(() => {
      setReturnToStoreFly((previous) => {
        if (!previous || previous.id !== id) return previous
        return { ...previous, active: true }
      })
    })
    window.setTimeout(() => {
      setReturnToStoreFly((previous) => (previous && previous.id === id ? null : previous))
    }, 650)
  }

  const handleRemove = async (variantId: number, sourceElement?: HTMLElement | null) => {
    const detail = validatedItems.find((line) => line.variant_id === variantId)
    triggerReturnToStoreAnimation(sourceElement, detail?.image_url || FALLBACK_IMAGE)
    const updated = removeStoreCartItem(variantId)
    setItems(updated)
    await loadAndValidate()
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Typography variant="h4" fontWeight={700}>Carrito</Typography>
          <Button
            component={RouterLink}
            to="/store"
            ref={storeLinkRef}
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ fontWeight: 700, transition: 'all 180ms ease', '&:hover': { transform: 'translateY(-1px)' }, width: { xs: '100%', sm: 'auto' } }}
          >
            {isMobile ? 'Seguir' : 'Seguir comprando'}
          </Button>
        </Box>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {items.length === 0 ? (
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">Tu carrito esta vacio.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Items ({items.length})</Typography>
                  <Button onClick={() => void loadAndValidate()} disabled={loading}>
                    Revalidar
                  </Button>
                </Stack>

                <Stack spacing={2}>
                  {items.map((item) => {
                    const detail = validatedItems.find((line) => line.variant_id === item.variant_id)
                    return (
                      <Box key={item.variant_id}>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                          alignItems={{ sm: 'center' }}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'background.default',
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={detail?.image_url || FALLBACK_IMAGE}
                            alt={detail?.product_name || `Variante ${item.variant_id}`}
                            sx={{ width: { xs: '100%', sm: 92 }, height: { xs: 160, sm: 92 }, borderRadius: 2, objectFit: 'cover' }}
                            onError={(event) => {
                              if (event.currentTarget.src !== FALLBACK_IMAGE) {
                                event.currentTarget.src = FALLBACK_IMAGE
                              }
                            }}
                          />
                          <Box flex={1} minWidth={0}>
                            <Typography fontWeight={700}>{detail?.product_name || `Variante #${item.variant_id}`}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {detail?.variant_info || 'Pendiente de validacion'}
                            </Typography>
                            {detail && (
                              <Typography variant="body2" color="text.secondary">
                                Precio unitario: {money(detail.unit_price)}
                              </Typography>
                            )}
                          </Box>

                          <TextField
                            label="Cantidad"
                            type="number"
                            size="small"
                            value={item.quantity}
                            inputProps={{ min: 1 }}
                            onChange={(event) => handleQuantityChange(item.variant_id, Number(event.target.value || 1))}
                            sx={{ width: 110 }}
                          />

                          <Button
                            color="error"
                            onClick={(event) => void handleRemove(item.variant_id, event.currentTarget)}
                            startIcon={<DeleteOutlineRoundedIcon />}
                            sx={{ transition: 'transform 160ms ease', '&:hover': { transform: 'translateY(-1px)' } }}
                          >
                            {isMobile ? 'Quitar' : 'Eliminar'}
                          </Button>
                        </Stack>
                        <Divider sx={{ mt: 2 }} />
                      </Box>
                    )
                  })}
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Total estimado</Typography>
                  <Typography variant="h6" color="primary.main">{money(total)}</Typography>
                </Stack>

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    disabled={loading || validatedItems.length === 0}
                    onClick={() => navigate('/store/checkout')}
                    startIcon={<ShoppingCartCheckoutRoundedIcon />}
                    sx={{
                      fontWeight: 700,
                      px: 2.2,
                      width: { xs: '100%', sm: 'auto' },
                      transition: 'all 180ms ease',
                      '&:hover': { transform: 'translateY(-1px)' },
                    }}
                  >
                    {isMobile ? 'Finalizar' : 'Ir a finalizar compra'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Stack>
      {returnToStoreFly && (
        <Box
          sx={{
            position: 'fixed',
            left: `${returnToStoreFly.startX}px`,
            top: `${returnToStoreFly.startY}px`,
            width: 36,
            height: 36,
            borderRadius: 1.5,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 12px 24px rgba(0,0,0,0.18)`,
            zIndex: 1400,
            pointerEvents: 'none',
            bgcolor: theme.palette.background.paper,
            transform: returnToStoreFly.active
              ? `translate(${returnToStoreFly.deltaX}px, ${returnToStoreFly.deltaY}px) scale(0.45) rotate(-10deg)`
              : 'translate(0px, 0px) scale(1) rotate(0deg)',
            opacity: returnToStoreFly.active ? 0.05 : 1,
            transition: 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms ease',
          }}
        >
          <Box
            component="img"
            src={returnToStoreFly.imageUrl}
            alt="Producto regresando a tienda"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}
    </Container>
  )
}
