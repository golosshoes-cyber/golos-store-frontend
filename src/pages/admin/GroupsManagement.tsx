import React, { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  GroupWork as GroupWorkIcon,
} from '@mui/icons-material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageShell from '../../components/common/PageShell'
import GlobalSectionHeader from '../../components/common/GlobalSectionHeader'
import GradientButton from '../../components/common/GradientButton'
import GroupDialog from '../../components/admin/GroupDialog'
import { userService } from '../../services/userService'
import type { DjangoGroup, DjangoPermission } from '../../types/auth'
import { showAcrylicConfirm } from '../../utils/showAcrylicConfirm'
import { useCommonPermissions } from '../../hooks/auth/usePermissions'
import { extractApiErrorMessage } from '../../utils/apiError'

const GroupsManagement: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const queryClient = useQueryClient()
  const { canManageUsers } = useCommonPermissions()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<DjangoGroup | null>(null)
  const [error, setError] = useState('')

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => userService.getGroups(),
  })

  const { data: permissionsData = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => userService.getPermissions(),
  })

  const groups = useMemo(() => groupsData?.results || [], [groupsData])
  const permissionsAvailable = permissionsData.length > 0
  const getGroupPermissions = (group: DjangoGroup): DjangoPermission[] =>
    Array.isArray((group as any).permissions) ? ((group as any).permissions as DjangoPermission[]) : []

  const createGroupMutation = useMutation({
    mutationFn: (payload: { name: string; permissions: number[] }) =>
      permissionsAvailable
        ? userService.createGroup(payload)
        : userService.createGroup({ name: payload.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      setDialogOpen(false)
      setEditingGroup(null)
      setError('')
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al crear grupo'))
    },
  })

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name: string; permissions: number[] } }) =>
      permissionsAvailable
        ? userService.updateGroup(id, payload)
        : userService.updateGroup(id, { name: payload.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      setDialogOpen(false)
      setEditingGroup(null)
      setError('')
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al actualizar grupo'))
    },
  })

  const deleteGroupMutation = useMutation({
    mutationFn: (id: number) => userService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: (err: any) => {
      setError(extractApiErrorMessage(err, 'Error al eliminar grupo'))
    },
  })

  const handleCreate = () => {
    setEditingGroup(null)
    setDialogOpen(true)
  }

  const handleEdit = (group: DjangoGroup) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }

  const handleDelete = async (group: DjangoGroup) => {
    const confirmed = await showAcrylicConfirm({
      mode: theme.palette.mode,
      title: 'Eliminar Grupo',
      text: `¿Eliminar el grupo "${group.name}"?`,
      icon: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    })
    if (confirmed) {
      deleteGroupMutation.mutate(group.id)
    }
  }

  if (!canManageUsers) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">No tienes permisos para gestionar grupos.</Alert>
      </Box>
    )
  }

  return (
    <PageShell>
      <GlobalSectionHeader
        title="Grupos y Permisos"
        subtitle="Crea y gestiona roles para controlar acceso por módulo"
        icon={<GroupWorkIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />}
        actions={
          <GradientButton
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: `1px solid ${alpha('#ffffff', 0.3)}`,
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.3),
                transform: 'translateY(-1px)',
              },
            }}
          >
            Nuevo Grupo
          </GradientButton>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {!permissionsAvailable && (
        <Alert severity="info" sx={{ mb: 2 }}>
          El backend no expone permisos por API. Puedes gestionar nombres de grupos; la asignación de permisos se habilitará cuando exista el endpoint.
        </Alert>
      )}

      {!isMobile && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Grupo</TableCell>
                <TableCell>Permisos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => {
                const groupPermissions = getGroupPermissions(group)
                return (
                  <TableRow key={group.id}>
                    <TableCell>
                      <Typography fontWeight={700}>{group.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                        {groupPermissions.slice(0, 4).map((permission) => (
                          <Chip key={permission.id} size="small" label={permission.codename} />
                        ))}
                        {groupPermissions.length > 4 && (
                          <Chip size="small" color="primary" label={`+${groupPermissions.length - 4}`} />
                        )}
                        {groupPermissions.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            Sin permisos expuestos
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar grupo">
                        <IconButton size="small" color="warning" onClick={() => handleEdit(group)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar grupo">
                        <IconButton size="small" color="error" onClick={() => handleDelete(group)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
              {!groupsLoading && groups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">No hay grupos creados.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isMobile && (
        <Stack spacing={1.5}>
          {groups.map((group) => {
            const groupPermissions = getGroupPermissions(group)
            return (
              <Paper key={group.id} sx={{ p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography fontWeight={700}>{group.name}</Typography>
                  <Box>
                    <IconButton size="small" color="warning" onClick={() => handleEdit(group)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(group)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 1 }}>
                  {groupPermissions.slice(0, 4).map((permission) => (
                    <Chip key={permission.id} size="small" label={permission.codename} />
                  ))}
                  {groupPermissions.length > 4 && (
                    <Chip size="small" color="primary" label={`+${groupPermissions.length - 4}`} />
                  )}
                  {groupPermissions.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Sin permisos expuestos
                    </Typography>
                  )}
                </Box>
              </Paper>
            )
          })}
        </Stack>
      )}

      <GroupDialog
        open={dialogOpen}
        group={editingGroup}
        permissions={permissionsData}
        loading={createGroupMutation.isPending || updateGroupMutation.isPending}
        onClose={() => {
          setDialogOpen(false)
          setEditingGroup(null)
        }}
        onSubmit={(payload) => {
          if (editingGroup) {
            updateGroupMutation.mutate({ id: editingGroup.id, payload })
            return
          }
          createGroupMutation.mutate(payload)
        }}
      />
    </PageShell>
  )
}

export default GroupsManagement
