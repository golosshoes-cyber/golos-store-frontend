import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material'
import type { ProductVariant } from '../../types'
import { formatCurrency } from '../../utils/currency'

export interface CartItem {
  variant: ProductVariant
  quantity: number
}

interface PosCartItemProps {
  item: CartItem
  onUpdateQuantity: (variantId: number, newQuantity: number) => void
  onRemove: (variantId: number) => void
}

const PosCartItem: React.FC<PosCartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { variant, quantity } = item

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(variant.id, quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (quantity < variant.stock) {
      onUpdateQuantity(variant.id, quantity + 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val > 0 && val <= variant.stock) {
      onUpdateQuantity(variant.id, val)
    }
  }

  return (
    <Card elevation={0} sx={{ mb: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
      <Box 
        sx={{ 
          width: 60, 
          height: 60, 
          bgcolor: 'action.hover', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        {variant.image_url ? (
          <Box component="img" src={variant.image_url} alt={variant.sku} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>Sin imagen</Typography>
        )}
      </Box>

      <CardContent sx={{ flex: 1, py: 1, px: 1.5, '&:last-child': { pb: 1 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 1 }}>
        <Box sx={{ flex: '1 1 auto', minWidth: 100 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {variant.product_name || `Producto #${variant.product}`}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Talla: {variant.size} {variant.color ? `| ${variant.color}` : ''}
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            {formatCurrency(variant.price)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', justifyContent: 'flex-end', width: { xs: '100%', sm: 'auto' } }}>
          {/* Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 2, p: 0.5 }}>
            <IconButton size="small" onClick={handleDecrease} disabled={quantity <= 1}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField 
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: variant.stock, style: { textAlign: 'center', width: 40, padding: '4px 0', fontSize: '0.875rem' } }}
              variant="standard"
              InputProps={{ disableUnderline: true }}
            />
            <IconButton size="small" onClick={handleIncrease} disabled={quantity >= variant.stock}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right', flexShrink: 0 }}>
            {formatCurrency(Number(variant.price) * quantity)}
          </Typography>

          <IconButton color="error" onClick={() => onRemove(variant.id)} sx={{ bgcolor: 'error.lighter' }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PosCartItem
