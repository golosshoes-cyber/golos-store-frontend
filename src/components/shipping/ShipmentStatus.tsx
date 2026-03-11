import { Box, Chip, Typography } from '@mui/material'
import { getStatusConfig } from '../../utils/shippingHelpers'

interface ShipmentStatusProps {
  status: string
  trackingNumber?: string
  labelUrl?: string | null
}

export default function ShipmentStatus({ status, trackingNumber, labelUrl }: ShipmentStatusProps) {
  const config = getStatusConfig(status)

  return (
    <Box
      sx={{
        bgcolor: config.bgColor,
        border: '1px solid',
        borderColor: config.color,
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Typography fontSize={24}>{config.icon}</Typography>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} color={config.color}>
            Estado: {config.label}
          </Typography>
          {trackingNumber && (
            <Typography variant="body2" color="text.secondary">
              Guía No. <strong>{trackingNumber}</strong>
            </Typography>
          )}
        </Box>
      </Box>

      {labelUrl && (
        <Chip
          component="a"
          href={labelUrl}
          target="_blank"
          rel="noopener noreferrer"
          clickable
          label="Descargar Etiqueta"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600, bgcolor: 'common.white' }}
        />
      )}
    </Box>
  )
}
