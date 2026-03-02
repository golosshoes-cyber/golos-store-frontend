import React from 'react'
import {
  Grid,
  Paper,
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
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          height: 300,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.warning.main, theme.palette.mode === 'light' ? 0.2 : 0.3)}`,
          background:
            theme.palette.mode === 'light'
              ? alpha('#ffffff', 0.96)
              : alpha('#0b1220', 0.86),
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 8px 22px ${alpha('#0f172a', 0.08)}`
              : `0 14px 26px ${alpha('#000000', 0.46)}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Top Productos</Typography>
          <EmojiEvents color="action" />
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
      </Paper>
    </Grid>
  )
}

export default TopProducts



