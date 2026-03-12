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
      {...props}
      sx={{ 
        px: 3,
        py: 0.8,
        fontSize: '13px',
        fontWeight: 500,
        ...props.sx
      }}
    >
      {children}
    </Button>
  )
}

export default GradientButton
