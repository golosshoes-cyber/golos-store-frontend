import React, { useState } from 'react'
import {
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  TrendingDown as ExpenseIcon,
  TrendingUp as IncomeIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financeService, FinancialCategory } from '../../services/financeService'
import DialogShell from '../common/DialogShell'

interface CategoriesDialogProps {
  open: boolean
  onClose: () => void
}

const CategoriesDialog: React.FC<CategoriesDialogProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [isIncome, setIsIncome] = useState(false)
  
  const { data: categories } = useQuery({
    queryKey: ['financial-categories-all'],
    queryFn: () => financeService.getCategories({}),
    enabled: open
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<FinancialCategory>) => financeService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories-all'] })
      setName('')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => financeService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-categories-all'] })
    }
  })

  const handleAdd = () => {
    if (!name.trim()) return
    createMutation.mutate({ name: name.trim(), is_income: isIncome })
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      dense
      title="Categorías"
      subtitle="Define categorías para ingresos y egresos"
    >
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Nueva Categoría"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputBase-root': { fontSize: '13px' },
              '& .MuiInputLabel-root': { fontSize: '13px' }
            }}
          />
          <FormControlLabel
            control={<Switch size="small" checked={isIncome} onChange={(e) => setIsIncome(e.target.checked)} />}
            label={<Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600 }}>{isIncome ? 'Ingreso' : 'Egreso'}</Typography>}
            sx={{ ml: 0, mr: 1 }}
          />
          <Button 
            variant="contained" 
            size="small"
            onClick={handleAdd}
            disabled={!name.trim() || createMutation.isPending}
            sx={{ minWidth: 36, p: 0.8, borderRadius: 1.5 }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </Stack>
      </Box>

      <Typography variant="caption" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Existentes
      </Typography>
      <Box sx={{ maxHeight: 240, overflowY: 'auto', border: 1, borderColor: alpha(theme.palette.divider, 0.8), borderRadius: 2 }}>
        <List dense disablePadding>
          {categories?.results?.map((cat: FinancialCategory) => (
            <ListItem 
              key={cat.id}
              secondaryAction={
                <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(cat.id)} sx={{ p: 0.5 }}>
                  <DeleteIcon sx={{ fontSize: '14px' }} />
                </IconButton>
              }
              sx={{ 
                borderBottom: 1, 
                borderColor: alpha(theme.palette.divider, 0.5), 
                '&:last-child': { borderBottom: 0 },
                px: 1.5,
                py: 0.8
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                {cat.is_income ? <IncomeIcon color="success" sx={{ fontSize: '14px' }} /> : <ExpenseIcon color="error" sx={{ fontSize: '14px' }} />}
              </ListItemIcon>
              <ListItemText 
                primary={cat.name} 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600, fontSize: '12px' }}
                sx={{ my: 0 }}
              />
              <Chip 
                label={cat.is_income ? 'Ingreso' : 'Egreso'} 
                size="small" 
                variant="outlined"
                color={cat.is_income ? 'success' : 'error'}
                sx={{ fontSize: '9px', height: 18, mr: 1, fontWeight: 700 }}
              />
            </ListItem>
          ))}
          {categories?.results?.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>No hay categorías registradas</Typography>
            </Box>
          )}
        </List>
      </Box>
    </DialogShell>
  )
}

export default CategoriesDialog
