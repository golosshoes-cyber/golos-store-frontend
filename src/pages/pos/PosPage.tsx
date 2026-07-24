import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../hooks/useNotification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { salesService } from '../../services/salesService'
import { receivableService } from '../../services/receivableService'
import type { CustomerEntity, ProductVariant } from '../../types'
import PosCustomerSection from '../../components/pos/PosCustomerSection'
import PosProductSelector from '../../components/pos/PosProductSelector'
import PosCartItem, { CartItem } from '../../components/pos/PosCartItem'
import PosCheckoutPanel, { CheckoutData } from '../../components/pos/PosCheckoutPanel'

const PosPage: React.FC = () => {
  const { user } = useAuth()
  const { showSuccess, showError } = useNotification()
  const queryClient = useQueryClient()

  const [customer, setCustomer] = useState<CustomerEntity | null>(() => {
    const saved = localStorage.getItem('pos_customer')
    return saved ? JSON.parse(saved) : null
  })
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pos_cart')
    return saved ? JSON.parse(saved) : []
  })

  // Persistence
  React.useEffect(() => {
    if (customer) localStorage.setItem('pos_customer', JSON.stringify(customer))
    else localStorage.removeItem('pos_customer')
  }, [customer])

  React.useEffect(() => {
    if (cart.length > 0) localStorage.setItem('pos_cart', JSON.stringify(cart))
    else localStorage.removeItem('pos_cart')
  }, [cart])

  const total = cart.reduce((acc, item) => acc + (Number(item.variant.price) * item.quantity), 0)

  // Handlers
  const handleAddToCart = (variant: ProductVariant, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.variant.id === variant.id)

      if (existing) {
        return prev.map(item => 
          item.variant.id === variant.id 
            ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) }
            : item
        )
      }
      return [{ variant, quantity }, ...prev]
    })
  }

  const handleUpdateQuantity = (variantId: number, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.variant.id === variantId ? { ...item, quantity } : item
    ))
  }

  const handleRemoveItem = (variantId: number) => {
    setCart(prev => prev.filter(item => item.variant.id !== variantId))
  }

  // Mutations
  const createSaleMutation = useMutation({
    mutationFn: async (checkoutData: CheckoutData) => {
      if (!customer && checkoutData.isCredit) {
        throw new Error("Debe seleccionar un cliente para ventas a crédito.")
      }

      // 1. Create Sale
      const sale = await salesService.createSale({
        customer: customer ? customer.name : 'Cliente General',
        customer_entity: customer ? customer.id : undefined,
        is_order: false,
        payment_method: checkoutData.paymentMethod,
        payment_reference: checkoutData.paymentReference || undefined,
        invoicing_method: 'NONE',
        created_by: user?.username || 'system',
      })

      // 2. Add details
      for (const item of cart) {
        await salesService.createSaleDetail({
          sale: sale.id,
          variant: item.variant.id,
          quantity: item.quantity,
          price: Number(item.variant.price),
        })
      }

      // 3. Confirm sale so inventory is discounted
      await salesService.confirmSale(sale.id, { invoicing_method: 'NONE' })

      // 4. If credit, create AccountReceivable
      if (checkoutData.isCredit && customer) {
        await receivableService.createReceivable({
          sale_id: sale.id,
          customer_id: customer.id,
          notes: 'Generado desde Punto de Venta (Fiado)'
        })
      }

      return sale
    },
    onSuccess: () => {
      showSuccess('Venta registrada exitosamente')
      // Reset POS state
      setCart([])
      setCustomer(null)
      localStorage.removeItem('pos_cart')
      localStorage.removeItem('pos_customer')
      
      // Refresh relevant queries
      queryClient.invalidateQueries({ queryKey: ['pos-products'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: (error: any) => {
      showError(error.message || 'Error al procesar la venta. Por favor intenta de nuevo.')
    }
  })

  const handleCheckout = (data: CheckoutData) => {
    if (cart.length === 0) {
      showError("El carrito está vacío")
      return
    }
    if (data.isCredit && !customer) {
      showError("Debe seleccionar o crear un cliente para dar crédito / fiado")
      return
    }
    createSaleMutation.mutate(data)
  }

  return (
    <Container maxWidth={false} sx={{ py: 2, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">Punto de Venta</Typography>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Left Column: Build Cart */}
        <Grid item xs={12} md={7} lg={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <PosCustomerSection 
              selectedCustomer={customer}
              onCustomerSelect={setCustomer}
            />
          </Paper>

          <PosProductSelector onAddToCart={handleAddToCart} />

          {/* Cart Items List */}
          <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflowY: 'auto' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: 1 }}>
              Productos en la orden ({cart.length})
            </Typography>

            {cart.length === 0 ? (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.5 }}>
                <Typography variant="h6" color="text.secondary">Carrito Vacío</Typography>
                <Typography variant="body2" color="text.secondary">Busca un producto y agrégalo a la orden</Typography>
              </Box>
            ) : (
              <Box>
                {cart.map((item) => (
                  <PosCartItem 
                    key={item.variant.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column: Checkout Panel */}
        <Grid item xs={12} md={5} lg={4} sx={{ height: '100%' }}>
          <PosCheckoutPanel 
            total={total}
            onCheckout={handleCheckout}
            disabled={cart.length === 0}
            loading={createSaleMutation.isPending}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default PosPage
