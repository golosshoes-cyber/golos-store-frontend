import React from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Add as AddIcon, Group as GroupIcon } from '@mui/icons-material'

interface UsersManagementHeaderProps {
  onCreateUser: () => void
  totalUsers: number
  loading: boolean
}

const UsersManagementHeader: React.FC<UsersManagementHeaderProps> = ({
  onCreateUser,
  totalUsers,
  loading,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Card
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        mb: 3,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3, md: 3.5 },
          '&:last-child': {
            pb: { xs: 2.5, sm: 3, md: 3.5 },
          },
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <GroupIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Gestión de Usuarios
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Administra usuarios, grupos y permisos del sistema
                </Typography>
              </Box>
            </Box>
            {!loading && (
              <Typography variant="h6" sx={{ opacity: 0.8, mt: 2 }}>
                Total de usuarios: {totalUsers}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              justifyContent={isMobile ? 'center' : 'flex-end'}
              mt={isMobile ? 2 : 0}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={onCreateUser}
                disabled={loading}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                Nuevo Usuario
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UsersManagementHeader
