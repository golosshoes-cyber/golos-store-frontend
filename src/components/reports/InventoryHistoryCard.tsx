import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material'
import { mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

interface InventoryHistoryItem {
  id: number
  created_at: string
  product: string
  variant: number
  movement_type_display: string
  quantity: number
  stock_after: number
  observation: string
  direction: string
  color?: string
  icon?: string
}

interface InventoryHistoryCardProps {
  item: InventoryHistoryItem
  variantDisplay: string
}

const InventoryHistoryCard: React.FC<InventoryHistoryCardProps> = ({
  item,
  variantDisplay,
}) => {
  const theme = useTheme()

  const getMovementIcon = () => {
    if (item.direction === 'in') return <TrendingUpIcon />
    if (item.direction === 'out') return <TrendingDownIcon />
    return <SwapHorizIcon />
  }

  const getMovementColor = () => {
    if (item.direction === 'in') return 'success'
    if (item.direction === 'out') return 'error'
    return 'info'
  }

  const renderStackedName = (name: string) => {
    const words = name.split(' ')
    return words.map((word, index) => (
      <Typography
        key={index}
        variant="h6"
        fontWeight="bold"
        sx={{
          fontSize: { xs: '0.9rem', sm: '1rem' },
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {word}
      </Typography>
    ))
  }

  return (
    <Card sx={mobileCardSx(theme)}>
      <CardContent sx={{ p: 2 }}>
        {/* Header con producto y variante */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ mb: 0.5 }}>
              {renderStackedName(item.product)}
            </Box>
            <Typography variant="body2" color="primary" fontWeight="medium" sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              mb: 0.5,
            }}>
              {variantDisplay}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              {new Date(item.created_at).toLocaleDateString('es-ES')}
            </Typography>
          </Box>
          <Chip
            label={item.movement_type_display}
            color={getMovementColor() as any}
            size="small"
            icon={getMovementIcon()}
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          />
        </Box>

        {/* Información de movimiento */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 1.5,
            mb: 2
          }}
        >
          <Box
            sx={{
              ...mobileMetricSx(theme, item.quantity > 0 ? 'success' : 'error'),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Cantidad
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: item.quantity > 0 ? '#2e7d32' : '#d32f2f'
            }}>
              {item.quantity > 0 ? '+' : ''}{item.quantity}
            </Typography>
          </Box>

          <Box
            sx={{
              ...mobileMetricSx(theme, 'info'),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Balance
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#7b1fa2'
            }}>
              {item.stock_after}
            </Typography>
          </Box>

          <Box
            sx={{
              ...mobileMetricSx(theme, 'primary'),
              gridColumn: { xs: 'span 2', sm: 'span 1' }
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Observación
            </Typography>
            <Typography variant="body2" fontWeight="medium" sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              color: '#1976d2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.observation || 'Sin observación'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default InventoryHistoryCard
