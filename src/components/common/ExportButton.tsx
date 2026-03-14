import React, { useState } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
} from '@mui/material'
import {
  FileDownload as ExportIcon,
  Description as CsvIcon,
  TableChart as ExcelIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material'

interface ExportButtonProps {
  onExport: (format: 'excel' | 'csv') => void
  disabled?: boolean
  fullWidth?: boolean
}

const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  disabled = false,
  fullWidth = false,
}) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExport = (format: 'excel' | 'csv') => {
    onExport(format)
    handleClose()
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        disabled={disabled}
        fullWidth={fullWidth}
        startIcon={<ExportIcon sx={{ fontSize: 18 }} />}
        endIcon={<ArrowDownIcon sx={{ fontSize: 16, opacity: 0.5 }} />}
        sx={{
          fontSize: '11px',
          height: 32,
          minWidth: 'auto',
          px: 1.5,
          borderRadius: 1.5,
          color: 'text.secondary',
          borderColor: theme.palette.divider,
          textTransform: 'none',
          fontWeight: 500,
          bgcolor: 'background.paper',
          '&:hover': {
            borderColor: theme.palette.text.disabled,
            bgcolor: alpha(theme.palette.text.primary, 0.02),
            color: 'text.primary',
          },
          '&.Mui-disabled': {
            borderColor: theme.palette.action.disabledBackground,
          },
        }}
      >
        Exportar
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 160,
            boxShadow: theme.palette.mode === 'light' 
              ? '0 10px 15px -3px rgba(0,0,0,0.1)' 
              : '0 10px 15px -3px rgba(0,0,0,0.5)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
          }
        }}
      >
        <MenuItem onClick={() => handleExport('excel')} sx={{ py: 1 }}>
          <ListItemIcon>
            <ExcelIcon fontSize="small" sx={{ color: '#1D6F42' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Descargar Excel" 
            primaryTypographyProps={{ fontSize: '12px', fontWeight: 500 }} 
          />
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')} sx={{ py: 1 }}>
          <ListItemIcon>
            <CsvIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Descargar CSV" 
            primaryTypographyProps={{ fontSize: '12px', fontWeight: 500 }} 
          />
        </MenuItem>
      </Menu>
    </>
  )
}

export default ExportButton
