import React from 'react'
import {
  Button,
  ButtonProps,
} from '@mui/material'

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button 
      variant="contained"
      sx={{ 
        borderRadius: 2,
        textTransform: 'none',
        px: 4,
        py: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
        },
        '&:disabled': {
          background: '#e0e0e0',
          color: '#9e9e9e',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export default GradientButton
