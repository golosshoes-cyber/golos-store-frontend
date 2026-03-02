import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { InventorySnapshotItem } from '../../types/reports'
import { mobileCardSx, mobileMetricSx } from '../common/mobileCardStyles'

interface InventorySnapshotCardProps {
  item: InventorySnapshotItem
}

const InventorySnapshotCard: React.FC<InventorySnapshotCardProps> = ({
  item,
}) => {
  const theme = useTheme()

  return (
    <Card sx={mobileCardSx(theme)}>
      <CardContent sx={{ p: 2 }}>
        {/* Header con mes y producto */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" color="primary" fontWeight="medium" sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              mb: 0.5,
            }}>
              {new Date(item.month).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.product}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              {item.product_sku && `SKU: ${item.product_sku} | `}
              {item.variant_color} - {item.variant_size}
            </Typography>
          </Box>
        </Box>

        {/* Información de snapshot */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
            gap: 1.5,
            mb: 2
          }}
        >
          <Box
            sx={{
              ...mobileMetricSx(theme, 'primary'),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Inicial
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#1976d2'
            }}>
              {item.stock_opening}
            </Typography>
          </Box>

          <Box
            sx={{
              ...mobileMetricSx(theme, 'success'),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Entradas
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#2e7d32'
            }}>
              {item.total_in}
            </Typography>
          </Box>

          <Box
            sx={{
              ...mobileMetricSx(theme, 'error'),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Salidas
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#d32f2f'
            }}>
              {item.total_out}
            </Typography>
          </Box>

          <Box
            sx={{
              ...mobileMetricSx(theme, 'info'),
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Final
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#7b1fa2'
            }}>
              {item.stock_closing}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default InventorySnapshotCard
