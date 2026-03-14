import React from 'react'
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import type { RecentMovementsProps } from '../../types/dashboard'

const RecentMovements: React.FC<RecentMovementsProps> = ({ movements, loading }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Box
        sx={{
          height: 180,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          px: 1.5, 
          py: 1, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary', letterSpacing: '-0.1px' }}>
            Movimientos recientes
          </Typography>
          <Typography 
            onClick={() => navigate('/inventory')}
            sx={{ fontSize: '11px', color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
          >
            Ver todos →
          </Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'transparent transparent',
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.divider,
                borderRadius: 2,
              },
            }}
          >
            {movements?.map((movement, index) => {
              const isPurchase = movement.type === 'purchase' || movement.type_display?.toLowerCase().includes('compra')
              const isSale = movement.type_display?.toLowerCase().includes('venta') || movement.type_display?.toLowerCase().includes('salida')
              
              return (
                <Box key={movement.id} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderBottom: index === movements.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
                  transition: 'background 0.1s',
                  '&:hover': { bgcolor: 'action.hover' }
                }}>
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: isPurchase ? 'success.main' : isSale ? 'error.main' : 'info.main'
                  }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 500, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {movement.product_name}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.1 }}>
                      {movement.variant_info}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      px: 0.8, 
                      py: 0.2, 
                      borderRadius: 0.5,
                      fontSize: '10px',
                      fontWeight: 500,
                      bgcolor: isPurchase ? alpha(theme.palette.success.main, 0.08) : isSale ? alpha(theme.palette.error.main, 0.08) : alpha(theme.palette.info.main, 0.08),
                      color: isPurchase ? 'success.main' : isSale ? 'error.main' : 'info.main',
                    }}>
                      {movement.type_display}
                    </Box>
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.3 }}>
                      {new Date(movement.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
            {(!movements || movements.length === 0) && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  No hay movimientos recientes
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
  )
}

export default RecentMovements
