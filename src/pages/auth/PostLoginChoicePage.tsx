import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useNavigate } from 'react-router-dom'

export default function PostLoginChoicePage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h5" fontWeight={800}>¿A donde quieres ir?</Typography>
            <Typography variant="body2" color="text.secondary">
              Puedes seguir en la tienda o entrar al panel de gestion.
            </Typography>
          </Box>

          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<StorefrontRoundedIcon />}
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate('/store')}
            sx={{ py: 1.35, justifyContent: 'space-between' }}
          >
            Ir a la tienda
          </Button>

          <Button
            fullWidth
            size="large"
            variant="outlined"
            startIcon={<DashboardRoundedIcon />}
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ py: 1.35, justifyContent: 'space-between' }}
          >
            Ir a gestion
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
