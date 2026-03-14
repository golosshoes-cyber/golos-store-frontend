import React, { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import { exportService } from '../../services/exportService'
import { extractApiErrorMessage } from '../../utils/apiError'

const ExportsPage: React.FC = () => {
  const [format, setFormat] = useState<'csv' | 'excel'>('excel')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [days, setDays] = useState('90')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const runExport = async (action: () => Promise<void>, successText: string) => {
    try {
      setIsLoading(true)
      setMessage(null)
      await action()
      setMessage({ type: 'success', text: successText })
    } catch (error: any) {
      setMessage({ type: 'error', text: extractApiErrorMessage(error, 'No se pudo exportar el reporte.') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Exportaciones"
        subtitle="Descarga reportes en CSV o Excel con filtros por fecha"
        icon={<DownloadForOfflineIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
      />

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 2.5 }, mb: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
          Filtros
        </Typography>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' } }}>
          <TextField select label="Formato" value={format} onChange={(e) => setFormat(e.target.value as 'csv' | 'excel')}>
            <MenuItem value="excel">Excel</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </TextField>
          <TextField
            type="date"
            label="Fecha inicio"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="Fecha fin"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Días proveedores"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            type="number"
          />
        </Box>
      </Paper>

      <Stack spacing={1.2}>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="contained"
          disabled={isLoading}
          onClick={() => runExport(() => exportService.exportSales(format, startDate, endDate), 'Reporte de ventas descargado.')}
        >
          Exportar Ventas
        </Button>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="contained"
          disabled={isLoading}
          onClick={() => runExport(() => exportService.exportPurchases(format, startDate, endDate), 'Reporte de compras descargado.')}
        >
          Exportar Compras
        </Button>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="contained"
          disabled={isLoading}
          onClick={() => runExport(() => exportService.exportInventory(format), 'Reporte de inventario descargado.')}
        >
          Exportar Inventario
        </Button>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="contained"
          disabled={isLoading}
          onClick={() => runExport(() => exportService.exportMovements(format, startDate, endDate), 'Reporte de movimientos descargado.')}
        >
          Exportar Movimientos
        </Button>
        <Button
          startIcon={<FileDownloadIcon />}
          variant="contained"
          disabled={isLoading}
          onClick={() => runExport(() => exportService.exportSuppliersReport(format), 'Reporte de proveedores descargado.')}
        >
          Exportar Reporte de Proveedores
        </Button>
      </Stack>
    </PageShell>
  )
}

export default ExportsPage
