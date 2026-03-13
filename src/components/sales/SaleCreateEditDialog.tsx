import React from 'react'
import {
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Sale } from '../../types'
import SaleForm from '../sales/SaleForm'
import DialogShell from '../common/DialogShell'

interface SaleCreateEditDialogProps {
  open: boolean
  sale: Sale | null
  onClose: () => void
  onSubmit: (saleData: any) => void
  loading?: boolean
}

const SaleCreateEditDialog: React.FC<SaleCreateEditDialogProps> = ({
  open,
  sale,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <DialogShell
      open={open}
      maxWidth="md"
      fullScreen={isMobile}
      onClose={!loading ? onClose : undefined}
      scroll="paper"
      dialogTitle={sale ? 'Editar Venta' : 'Nueva Venta'}
      subtitle={sale ? 'Modifica los detalles de la venta existente' : 'Registra una nueva venta directa'}
    >
      <SaleForm
        sale={sale}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </DialogShell>
  )
}

export default SaleCreateEditDialog
