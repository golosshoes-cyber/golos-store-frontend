import { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { userService } from '../../services/userService'
import type { 
  DjangoGroup, 
  DjangoPermission, 
  UserPermissions, 
  UserRole 
} from '../../types/auth'

export const usePermissions = () => {
  const { user, isAdmin } = useAuth()

  // Memoizar cálculos de permisos para mejor rendimiento
  const permissions = useMemo(() => {
    if (!user) return null

    // Obtener grupos del usuario (asumimos que el User tiene groups)
    const userGroups = (user as any).groups || []
    const userPermissions = (user as any).user_permissions || []

    // Función para verificar si tiene un grupo específico
    const hasGroup = (groupName: string): boolean =>
      userGroups.some((group: DjangoGroup) => group.name === groupName)

    // Función para verificar si tiene un permiso específico
    const hasPermission = (permission: string): boolean => {
      return userPermissions.some((perm: DjangoPermission) => perm.codename === permission)
    }

    // Función para verificar permisos por modelo y acción
    const can = (action: string, model: string): boolean => {
      return hasPermission(`${action}_${model}`)
    }

    // Verificaciones específicas por grupo
    const isSales = hasGroup('Sales')
    const isInventory = hasGroup('Inventory')
    const isManagers = hasGroup('Managers')
    const isCustomer = hasGroup('Customers')

    // Lógica especial: superadmin/staff o grupo Managers tienen alcance administrativo
    const isStaffOrAdmin = isAdmin || isManagers

    // Permisos específicos del negocio
    const userPermissionsObj: UserPermissions = {
      // Gestión de usuarios
      can_manage_users: isStaffOrAdmin,
      
      // Ventas
      can_add_sales: isSales || isStaffOrAdmin,
      can_change_sales: isSales || isStaffOrAdmin,
      can_delete_sales: isSales || isStaffOrAdmin,
      
      // Productos
      can_add_products: isInventory || isStaffOrAdmin,
      can_change_products: isInventory || isStaffOrAdmin,
      can_delete_products: isInventory || isStaffOrAdmin,
      
      // Compras
      can_add_purchases: isInventory || isStaffOrAdmin,
      can_change_purchases: isInventory || isStaffOrAdmin,
      can_delete_purchases: isInventory || isStaffOrAdmin,
      
      // Inventario
      can_view_inventory: isSales || isInventory || isStaffOrAdmin,
      can_change_inventory: isInventory || isStaffOrAdmin,
      can_add_inventory_adjustments: isInventory || isStaffOrAdmin,
    }

    // Determinar rol primario (prioridad: Managers > Inventory > Sales > Customer)
    const getPrimaryRole = (): UserRole => {
      if (isStaffOrAdmin) return 'Managers'
      if (isInventory) return 'Inventory'
      if (isSales) return 'Sales'
      return 'Customers'
    }

    return {
      user,
      groups: userGroups,
      permissions: userPermissions,
      hasGroup,
      hasPermission,
      can,
      isSales,
      isInventory,
      isManagers,
      isStaffOrAdmin,
      isCustomer,
      primaryRole: getPrimaryRole(),
      userPermissions: userPermissionsObj,
    }
  }, [user, isAdmin])

  return permissions
}

// Hook para refrescar permisos del usuario actual
export const useRefreshPermissions = () => {
  const { user } = useAuth()

  const refreshPermissions = async () => {
    if (!user?.id) return

    try {
      // Obtener datos actualizados del usuario con grupos y permisos
      const updatedUser = await userService.getUser(user.id)
      // Actualizar el usuario en el contexto (necesitaríamos extender el AuthContext)
      console.log('Permissions refreshed:', updatedUser)
    } catch (error) {
      console.error('Error refreshing permissions:', error)
    }
  }

  return { refreshPermissions }
}

// Hook para verificar permisos específicos comúnmente usados
export const useCommonPermissions = () => {
  const permissions = usePermissions()
  
  if (!permissions) {
    return {
      canCreateUser: false,
      canEditUser: false,
      canDeleteUser: false,
      canCreateSale: false,
      canEditSale: false,
      canDeleteSale: false,
      canCreateProduct: false,
      canEditProduct: false,
      canDeleteProduct: false,
      canCreatePurchase: false,
      canEditPurchase: false,
      canDeletePurchase: false,
      canViewDashboard: false,
      canViewReports: false,
    }
  }

  const { can, isSales, isInventory, isStaffOrAdmin } = permissions

  return {
    // Acciones rápidas
    canCreateUser: isStaffOrAdmin,
    canEditUser: isStaffOrAdmin,
    canDeleteUser: isStaffOrAdmin,
    canManageUsers: isStaffOrAdmin, // Agregar esta propiedad faltante
    
    canCreateSale: isSales || isStaffOrAdmin,
    canEditSale: isSales || isStaffOrAdmin,
    canDeleteSale: isSales || isStaffOrAdmin,
    
    canCreateProduct: isInventory || isStaffOrAdmin,
    canEditProduct: isInventory || isStaffOrAdmin,
    canDeleteProduct: isInventory || isStaffOrAdmin,
    
    canCreatePurchase: isInventory || isStaffOrAdmin,
    canEditPurchase: isInventory || isStaffOrAdmin,
    canDeletePurchase: isInventory || isStaffOrAdmin,
    
    canViewDashboard: isSales || isInventory || isStaffOrAdmin,
    canViewReports: isStaffOrAdmin,
    
    // Permisos granulares
    canAddSaleGranular: can('add', 'sale'),
    canChangeSaleGranular: can('change', 'sale'),
    canDeleteSaleGranular: can('delete', 'sale'),
    
    canAddProductGranular: can('add', 'product'),
    canChangeProductGranular: can('change', 'product'),
    canDeleteProductGranular: can('delete', 'product'),
    
    canAddPurchaseGranular: can('add', 'purchase'),
    canChangePurchaseGranular: can('change', 'purchase'),
    canDeletePurchaseGranular: can('delete', 'purchase'),
  }
}
