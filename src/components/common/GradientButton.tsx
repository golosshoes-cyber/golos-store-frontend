import React from 'react'
import {
  Button,
  ButtonProps,
  CircularProgress,
} from '@mui/material'

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode
  loading?: boolean
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  loading,
  disabled,
  ...props
}) => {
  return (
    <Button 
      variant="contained"
      disabled={loading || disabled}
      {...props}
      sx={{ 
        px: 3,
        py: 0.8,
        fontSize: '13px',
        fontWeight: 500,
        position: 'relative',
        ...props.sx
      }}
    >
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-10px',
            marginLeft: '-10px',
            color: 'inherit',
          }}
        />
      )}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </Button>
  )
}

export default GradientButton
