import React, { useMemo, useState } from 'react'
import {
  alpha,
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
} from '@mui/material'
import { Add as AddIcon, Group as GroupIcon } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../../services/userService'
import { useCommonPermissions } from '../../hooks/auth/usePermissions'
import UserFormSimple from '../../components/admin/UserFormSimple'
import UserTable from '../../components/admin/UserTable'
import UsersCards from '../../components/admin/UsersCards'
import type { DjangoUser, UserCreateRequest, UserUpdateRequest } from '../../types/auth'
import PageShell from '../../components/common/PageShell'
import DialogShell from '../../components/common/DialogShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import GradientButton from '../../components/common/GradientButton'
import { showAcrylicConfirm } from '../../utils/showAcrylicConfirm'
import { extractApiErrorMessage } from '../../utils/apiError'

const UsersManagement: React.FC = () => {
  const [page, setPage] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<DjangoUser | undefined>(undefined)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingUser, setViewingUser] = useState<DjangoUser | undefined>(undefined)
  const [mutationError, setMutationError] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const queryClient = useQueryClient()
  const { canManageUsers } = useCommonPermissions()

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', page],
    queryFn: () => userService.getUsers({ page: page + 1 }),
  })

  const { data: groupsData } = useQuery({
    queryKey: ['groups'],
    queryFn: () => userService.getGroups(),
  })

  const createUserMutation = useMutation({
    mutationFn: (userData: UserCreateRequest) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setDialogOpen(false)
      setEditingUser(undefined)
      setMutationError('')
    },
    onError: (err: any) => {
      setMutationError(extractApiErrorMessage(err, 'No se pudo crear el usuario'))
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UserUpdateRequest }) =>
      userService.patchUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setDialogOpen(false)
      setEditingUser(undefined)
      setMutationError('')
    },
    onError: (err: any) => {
      setMutationError(extractApiErrorMessage(err, 'No se pudo actualizar el usuario'))
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (err: any) => {
      setMutationError(extractApiErrorMessage(err, 'No se pudo eliminar el usuario'))
    },
  })

  const handleCreateUser = () => {
    setEditingUser(undefined)
    setMutationError('')
    setDialogOpen(true)
  }

  const handleEditUser = (user: DjangoUser) => {
    setEditingUser(user)
    setMutationError('')
    setDialogOpen(true)
  }

  const handleViewUser = (user: DjangoUser) => {
    setViewingUser(user)
    setViewDialogOpen(true)
  }

  const handleDeleteUser = async (userId: number) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Eliminar Usuario',
      text: '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.',
      icon: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (confirmed) {
      deleteUserMutation.mutate(userId)
    }
  }

  const handleSubmit = (userData: UserCreateRequest | UserUpdateRequest) => {
    if (editingUser) {
      const updatePayload: UserUpdateRequest = {
        username: userData.username || '',
        email: userData.email || '',
        is_staff: !!userData.is_staff,
        groups: userData.groups || [],
      }
      updateUserMutation.mutate({ id: editingUser.id, userData: updatePayload })
      return
    }

    if (!('password' in userData)) {
      setMutationError('Falta la contraseña para crear el usuario.')
      return
    }

    const createPayload: UserCreateRequest = {
      username: userData.username || '',
      email: userData.email || '',
      is_staff: !!userData.is_staff,
      password: userData.password || '',
      groups: userData.groups || [],
    }
    createUserMutation.mutate(createPayload)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingUser(undefined)
    setMutationError('')
  }

  const users = useMemo(() => usersData?.results || [], [usersData])
  const totalCount = usersData?.count || 0
  const availableGroups = groupsData?.results || []

  React.useEffect(() => {
    if (totalCount === 0) {
      setPage(0)
      return
    }
    const rowsPerPage = 10
    const maxPage = Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1)
    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [totalCount, page])

  if (!canManageUsers) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">No tienes permisos para gestionar usuarios.</Alert>
      </Box>
    )
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Gestión de Usuarios"
        subtitle="Administra usuarios, grupos y acceso al sistema"
        icon={<GroupIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
        actions={
          <GradientButton
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Nuevo Usuario
          </GradientButton>
        }
      />

      <Box sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {mutationError && (
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setMutationError('')}>
                {mutationError}
              </Alert>
            </Grid>
          )}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">Error al cargar los usuarios: {(error as Error).message}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            {isMobile ? (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '24px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  bgcolor: 'background.paper',
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={800} color="text.primary">
                    Lista de Usuarios
                  </Typography>
                  <Box sx={{ 
                    px: 1.2, py: 0.4, borderRadius: 1.5, 
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.text.primary, 0.01)
                  }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>
                      Total: {totalCount}
                    </Typography>
                  </Box>
                </Stack>
                <UsersCards
                  users={users}
                  loading={isLoading}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onView={handleViewUser}
                />
              </Paper>
            ) : (
              <UserTable
                title="Lista de Usuarios"
                users={users}
                loading={isLoading}
                page={page}
                totalCount={totalCount}
                onPageChange={setPage}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onView={handleViewUser}
                onRefresh={refetch}
              />
            )}
          </Grid>
        </Grid>

        <DialogShell
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullScreen={isMobile}
          scroll="paper"
          dialogTitle={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        >
          <UserFormSimple
            user={editingUser}
            availableGroups={availableGroups}
            onSubmit={handleSubmit}
            loading={createUserMutation.isPending || updateUserMutation.isPending}
            onCancel={handleCloseDialog}
          />
        </DialogShell>

        <DialogShell
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          dialogTitle="Detalles del Usuario"
          subtitle="Información general y grupos asignados"
          actions={
            <Button onClick={() => setViewDialogOpen(false)} variant="outlined" sx={{ borderRadius: 1.5 }}>
              Cerrar
            </Button>
          }
        >
          {viewingUser ? (
            <Stack spacing={2.2} sx={{ p: 1 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={700}>
                    {viewingUser.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewingUser.email}
                  </Typography>
                  <Typography variant="body2">
                    {viewingUser.first_name || '-'} {viewingUser.last_name || ''}
                  </Typography>
                </Stack>
              </Paper>

              <Divider />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  size="small"
                  color={viewingUser.is_active ? 'success' : 'error'}
                  label={viewingUser.is_active ? 'Activo' : 'Inactivo'}
                />
                <Chip
                  size="small"
                  color={viewingUser.is_staff ? 'primary' : 'default'}
                  label={viewingUser.is_staff ? 'Staff' : 'Usuario'}
                />
              </Stack>

              <Typography variant="subtitle2" fontWeight={700}>
                Grupos asignados
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
                {(viewingUser.groups || []).map((group) => (
                  <Chip key={group.id} label={group.name} size="small" />
                ))}
                {(viewingUser.groups || []).length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Sin grupos asignados
                  </Typography>
                )}
              </Box>
            </Stack>
          ) : null}
        </DialogShell>
      </Box>
    </PageShell>
  )
}

export default UsersManagement


