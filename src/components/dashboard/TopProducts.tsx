import React from 'react'
import {
  Grid,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  EmojiEvents,
  MilitaryTech,
  WorkspacePremium,
} from '@mui/icons-material'
import type { TopProductsProps } from '../../types/dashboard'

const TopProducts: React.FC<TopProductsProps> = ({ products, loading }) => {
  const theme = useTheme()

  return (
    <Grid item xs={12} lg={6}>
      <Box
        sx={{
          p: 2.5,
          height: 300,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Top Productos
          </Typography>
          <EmojiEvents sx={{ fontSize: 18, color: 'text.secondary' }} />
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List
            sx={{
              maxHeight: 220,
              overflow: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'transparent transparent',
              '&::-webkit-scrollbar': { width: 5, height: 5 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'transparent',
                borderRadius: 8,
              },
              '&:hover': {
                scrollbarColor:
                  theme.palette.mode === 'light'
                    ? alpha('#0f172a', 0.24) + ' transparent'
                    : alpha('#e2e8f0', 0.26) + ' transparent',
              },
              '&:hover::-webkit-scrollbar-thumb': {
                background:
                  theme.palette.mode === 'light'
                    ? alpha('#0f172a', 0.2)
                    : alpha('#e2e8f0', 0.24),
              },
            }}
          >
            {products?.map((product, index: number) => (
              <React.Fragment key={product.id}>
                <ListItem
                  sx={{
                    px: 0,
                    transition: 'all 0.2s ease',
                    '@media (hover: hover) and (pointer: fine)': {
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                        borderRadius: 2,
                        px: 1,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {index === 0 && <MilitaryTech color="warning" />}
                    {index === 1 && <WorkspacePremium color="action" />}
                    {index === 2 && <WorkspacePremium color="disabled" />}
                    {index > 2 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        #{index + 1}
                      </Typography>
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {product.product_name}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {product.total_sold} uds
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Ingresos: ${product.revenue?.toFixed(2) || '0.00'}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < (products?.length || 0) - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
            {(!products || products.length === 0) && (
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="No hay ventas registradas"
                  secondary="Los productos más vendidos aparecerán aquí"
                />
              </ListItem>
            )}
          </List>
        )}
      </Box>
    </Grid>
  )
}

export default TopProducts



