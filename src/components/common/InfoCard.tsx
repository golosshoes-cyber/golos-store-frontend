import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
} from '@mui/material'

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  color: string
  children?: React.ReactNode
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  subtitle,
  color,
  children
}) => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: color }}>
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {subtitle}
            </Typography>
            {children}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default InfoCard
