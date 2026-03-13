import React from 'react'
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { SupplierPerformanceProps } from '../../types/dashboard'

const SupplierPerformance: React.FC<SupplierPerformanceProps> = ({ suppliers, loading }) => {
  const theme = useTheme()

  return (
    <Grid item xs={12} md={6}>
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
            Rendimiento proveedores
          </Typography>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}>
            Ver todos →
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: 4 } }}>
            {suppliers?.map((supplier, index) => (
              <Box key={supplier.id} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                px: 2,
                py: 1.2,
                borderBottom: index === suppliers.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
                transition: 'background 0.1s',
                '&:hover': { bgcolor: 'action.hover' }
              }}>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  flexShrink: 0,
                  bgcolor: 'success.main'
                }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 500, color: 'text.primary' }}>
                    {supplier.name}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.1 }}>
                    {supplier.total_purchases} compra · {supplier.total_products} producto · Última: {supplier.last_purchase ? new Date(supplier.last_purchase).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Box sx={{ fontSize: '12px', fontWeight: 500, color: 'text.primary' }}>
                    {supplier.total_quantity} uds
                  </Box>
                  <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                    este mes
                  </Typography>
                </Box>
              </Box>
            ))}
            {(!suppliers || suppliers.length === 0) && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  No hay datos de proveedores
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Grid>
  )
}

export default SupplierPerformance
