import React from 'react'
import {
  Box,
  Grid,
  Typography,
} from '@mui/material'
import type { DjangoUser } from '../../types/auth'
import UserCard from './UserCard'

interface UsersCardsProps {
  users: DjangoUser[]
  loading: boolean
  onEdit: (user: DjangoUser) => void
  onDelete: (userId: number) => void
  onView: (user: DjangoUser) => void
}

const UsersCards: React.FC<UsersCardsProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
  onView,
}) => {

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <Typography>Cargando usuarios...</Typography>
      </Box>
    )
  }

  if (users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <Typography color="text.secondary">No se encontraron usuarios</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} lg={4} key={user.id}>
            <UserCard
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default UsersCards
