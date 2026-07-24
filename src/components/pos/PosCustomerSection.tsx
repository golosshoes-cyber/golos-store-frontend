import React, { useState } from 'react'
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { receivableService } from '../../services/receivableService'
import type { CustomerEntity } from '../../types'
import { useAuth } from '../../contexts/AuthContext'

interface PosCustomerSectionProps {
  selectedCustomer: CustomerEntity | null
  onCustomerSelect: (customer: CustomerEntity | null) => void
}

const PosCustomerSection: React.FC<PosCustomerSectionProps> = ({
  selectedCustomer,
  onCustomerSelect
}) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [openCreate, setOpenCreate] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerIdNumber, setNewCustomerIdNumber] = useState('')

  // Fetch customers
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => receivableService.getCustomers({ limit: 1000 }),
    staleTime: 5 * 60_000,
  })

  const customers = customersData?.results || []

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: (data: Partial<CustomerEntity>) => receivableService.createCustomer(data),
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      onCustomerSelect(newCustomer)
      setOpenCreate(false)
      setNewCustomerName('')
      setNewCustomerIdNumber('')
    }
  })

  const handleCreateCustomer = () => {
    if (!newCustomerName.trim()) return
    createCustomerMutation.mutate({
      name: newCustomerName.trim(),
      id_number: newCustomerIdNumber.trim() || undefined,
      is_active: true,
      created_by: user?.username || 'system'
    })
  }

  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
      <Autocomplete
          fullWidth
          options={customers}
          getOptionLabel={(option) => option.name}
          value={selectedCustomer}
          onChange={(_, newValue) => onCustomerSelect(newValue)}
          loading={isLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar cliente..."
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
        />
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: 1.5, height: 40, whiteSpace: 'nowrap' }}
        >
          Crear
        </Button>

      {/* Dialog for creating a new customer */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Cliente</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre Completo"
            fullWidth
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Cédula / NIT (Opcional)"
            fullWidth
            value={newCustomerIdNumber}
            onChange={(e) => setNewCustomerIdNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenCreate(false)} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCustomer} 
            variant="contained"
            disabled={!newCustomerName.trim() || createCustomerMutation.isPending}
          >
            {createCustomerMutation.isPending ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PosCustomerSection
