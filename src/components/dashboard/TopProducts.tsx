import React from 'react'
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { StarOutline } from '@mui/icons-material'
import type { TopProductsProps } from '../../types/dashboard'

const TopProducts: React.FC<TopProductsProps> = ({ products, loading }) => {
  const theme = useTheme()

  return (
    <Grid item xs={12} lg={6}>
      <Box
        sx={{
          height: 280,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ 
          px: 2, 
          py: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary', letterSpacing: '-0.1px' }}>
            Top productos
          </Typography>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}>
            Ver reportes →
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: 4 } }}>
            {products?.map((product, index) => (
              <Box key={product.id} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                px: 2,
                py: 1.2,
                borderBottom: index === products.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
                transition: 'background 0.1s',
                '&:hover': { bgcolor: 'action.hover' }
              }}>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  flexShrink: 0,
                  bgcolor: index === 0 ? 'warning.main' : index === 1 ? 'action.disabled' : 'action.disabled',
                  opacity: index > 2 ? 0.3 : 1
                }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 500, color: 'text.primary' }}>
                    {product.product_name}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.1 }}>
                    Ingresos: ${product.revenue?.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0, color: 'primary.main' }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                    {product.total_sold} uds
                  </Typography>
                </Box>
              </Box>
            ))}
            {(!products || products.length === 0) && (
              <Box sx={{ p: '32px 16px', textAlign: 'center' }}>
                <StarOutline sx={{ fontSize: 24, mb: 1, opacity: 0.3, color: 'text.secondary' }} />
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  Sin ventas registradas aún
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Grid>
  )
}

export default TopProducts
