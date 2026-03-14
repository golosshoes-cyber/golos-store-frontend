import React, { useMemo, useState } from 'react'
import {
  alpha,
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
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          {/* Encabezado Integrado */}
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
              Lista de Grupos
            </Typography>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.02)' }}>
                  <TableCell sx={{ py: 1.5, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', pl: 3 }}>Grupo</TableCell>
                  <TableCell sx={{ py: 1.5, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Permisos</TableCell>
                  <TableCell align="right" sx={{ py: 1.5, fontSize: '10px', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', pr: 3 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group) => {
                  const groupPermissions = getGroupPermissions(group)
                  return (
                    <TableRow key={group.id} sx={{ '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.005) } }}>
                      <TableCell sx={{ pl: 3, py: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'text.primary' }}>{group.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                          {groupPermissions.slice(0, 4).map((permission) => (
                            <Chip 
                              key={permission.id} 
                              size="small" 
                              label={permission.codename}
                              sx={{ 
                                fontSize: '10px', 
                                height: 20, 
                                borderRadius: '4px',
                                bgcolor: alpha(theme.palette.text.primary, 0.05),
                                color: 'text.secondary',
                                fontWeight: 500
                              }} 
                            />
                          ))}
                          {groupPermissions.length > 4 && (
                            <Chip 
                              size="small" 
                              label={`+${groupPermissions.length - 4}`}
                              sx={{ 
                                fontSize: '10px', 
                                height: 20, 
                                borderRadius: '4px',
                                bgcolor: 'text.primary',
                                color: 'background.paper',
                                fontWeight: 700
                              }} 
                            />
                          )}
                          {groupPermissions.length === 0 && (
                            <Typography variant="caption" color="text.secondary">
                              Sin permisos expuestos
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          {[
                            { icon: <EditIcon sx={{ fontSize: 18 }} />, color: '#f59e0b', title: 'Editar grupo', onClick: () => handleEdit(group) },
                            { icon: <DeleteIcon sx={{ fontSize: 18 }} />, color: '#ef4444', title: 'Eliminar grupo', onClick: () => handleDelete(group) }
                          ].map((action, idx) => (
                            <Tooltip key={idx} title={action.title}>
                              <IconButton 
                                size="small" 
                                onClick={action.onClick}
                                sx={{ 
                                  color: action.color,
                                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    bgcolor: alpha(action.color, 0.1),
                                  }
                                }}
                              >
                                {action.icon}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {!groupsLoading && groups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ py: 6, textAlign: 'center' }}>
                      <Typography color="text.secondary">No hay grupos creados.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {isMobile && (
        <Stack spacing={2}>
          {groups.map((group) => {
            const groupPermissions = getGroupPermissions(group)
            return (
              <Paper 
                key={group.id} 
                elevation={0}
                sx={{ 
                  p: 2.5, 
                  borderRadius: '24px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{group.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(group)}
                      sx={{ color: '#f59e0b', bgcolor: alpha('#f59e0b', 0.1) }}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(group)}
                      sx={{ color: '#ef4444', bgcolor: alpha('#ef4444', 0.1) }}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {groupPermissions.slice(0, 4).map((permission) => (
                    <Chip 
                      key={permission.id} 
                      size="small" 
                      label={permission.codename}
                      sx={{ 
                        fontSize: '10px', 
                        height: 20, 
                        borderRadius: '4px',
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                        color: 'text.secondary',
                        fontWeight: 500
                      }} 
                    />
                  ))}
                  {groupPermissions.length > 4 && (
                    <Chip 
                      size="small" 
                      label={`+${groupPermissions.length - 4}`}
                      sx={{ 
                        fontSize: '10px', 
                        height: 20, 
                        borderRadius: '4px',
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        fontWeight: 700
                      }} 
                    />
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
