import React from 'react'
import {
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Sale } from '../../types'
import SaleForm from '../sales/SaleForm'
import SaleFormHeader from '../common/SaleFormHeader'
import DialogShell from '../common/DialogShell'

interface SaleCreateEditDialogProps {
  open: boolean
  sale: Sale | null // null para crear, Sale para editar
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

  const handleClose = () => {
    onClose()
  }

  return (
    <DialogShell
      open={open}
      maxWidth="md"
      fullScreen={isMobile}
      onClose={handleClose}
      scroll="paper"
      header={
        <SaleFormHeader
          isEditing={!!sale}
          onClose={handleClose}
        />
      }
      headerInTitle={false}
    >
      <SaleForm
        sale={sale}
        onSubmit={onSubmit}
        onCancel={handleClose}
        loading={loading}
      />
    </DialogShell>
  )
}

export default SaleCreateEditDialog
