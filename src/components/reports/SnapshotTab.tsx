import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material'
import type { InventorySnapshotItem } from '../../types/reports'
import InventorySnapshotCard from './InventorySnapshotCard'

interface SnapshotTabProps {
  snapshots?: { results: InventorySnapshotItem[] }
  isSnapshotsLoading: boolean
  snapshotsError?: { message: string }
  isCreatingSnapshot: boolean
  onCreateSnapshot: () => void
  onExportExcel: () => void
}

const SnapshotTab: React.FC<SnapshotTabProps> = ({
  snapshots,
  isSnapshotsLoading,
  snapshotsError,
  isCreatingSnapshot,
  onCreateSnapshot,
  onExportExcel,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Snapshots Mensuales
      </Typography>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 3 }}>
        <Box 
          display="flex" 
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
          flexWrap="wrap"
        >
          <Button
            variant="contained"
            onClick={onCreateSnapshot}
            disabled={isCreatingSnapshot}
            sx={{
              borderRadius: 2,
              fontWeight: 'medium',
              minWidth: { xs: 140, sm: 160 },
              px: { xs: 2, sm: 3 },
              py: 1,
            }}
          >
            {isCreatingSnapshot ? <CircularProgress size={20} /> : 'Crear Snapshot'}
          </Button>
          <Button
            variant="outlined"
            onClick={onExportExcel}
            sx={{
              borderRadius: 2,
              fontWeight: 'medium',
              minWidth: { xs: 140, sm: 160 },
              px: { xs: 2, sm: 3 },
              py: 1,
            }}
          >
            Exportar a Excel
          </Button>
        </Box>
      </Paper>

      {snapshotsError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Error al cargar los snapshots: {snapshotsError.message}
        </Alert>
      )}

      {snapshots && (
        isMobile ? (
          <Grid container spacing={2}>
            {snapshots.results?.map((snapshot: InventorySnapshotItem) => (
              <Grid item xs={12} key={snapshot.id}>
                <InventorySnapshotCard item={snapshot} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Mes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Variante</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Stock Inicial</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Entradas</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Salidas</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Stock Final</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {snapshots.results?.map((snapshot: InventorySnapshotItem) => (
                  <TableRow key={snapshot.id} hover>
                    <TableCell>{new Date(snapshot.month).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</TableCell>
                    <TableCell>{snapshot.product}</TableCell>
                    <TableCell>{snapshot.variant_color} - {snapshot.variant_size}</TableCell>
                    <TableCell>{snapshot.stock_opening}</TableCell>
                    <TableCell>{snapshot.total_in}</TableCell>
                    <TableCell>{snapshot.total_out}</TableCell>
                    <TableCell>{snapshot.stock_closing}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {isSnapshotsLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  )
}

export default SnapshotTab
