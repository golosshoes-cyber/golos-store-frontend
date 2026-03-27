import { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { userService } from '../../services/userService'
import type { 
  DjangoGroup, 
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
    // Leer la lista de permisos en vez de user_permissions
    const userPermissions = (user as any).permissions || []

    // Función para verificar si tiene un grupo específico
    const hasGroup = (groupName: string): boolean =>
      userGroups.some((group: DjangoGroup | string) => 
        typeof group === 'string' ? group === groupName : group.name === groupName
      )

    // Función para verificar si tiene un permiso específico (el backend devuelve strings ej: 'inventory.add_product')
    const hasPermission = (permission: string): boolean => {
      return userPermissions.includes(permission)
    }

    // Función para verificar permisos por modelo y acción
    const can = (action: string, model: string): boolean => {
      return hasPermission(`inventory.${action}_${model}`) || hasPermission(`auth.${action}_${model}`)
    }

    // Verificaciones específicas por grupo
    const isSales = hasGroup('Sales')
    const isInventory = hasGroup('Inventory')
    const isManagers = hasGroup('Managers')
    const isCustomer = hasGroup('Customers')

    // Lógica especial: isAdmin da pase libre (is_staff o is_superuser en backend). 
    // NUNCA MÁS le damos pase libre forzoso a Managers (quedan sujetos a sus permisos asignados).
    const isStaffOrAdmin = isAdmin

    // Permisos específicos del negocio basados en los permisos reales
    const userPermissionsObj: UserPermissions = {
      // Gestión de usuarios
      can_manage_users: hasPermission('auth.view_user') || isStaffOrAdmin,
      
      // Ventas
      can_add_sales: hasPermission('inventory.add_sale') || isStaffOrAdmin,
      can_change_sales: hasPermission('inventory.change_sale') || isStaffOrAdmin,
      can_delete_sales: hasPermission('inventory.delete_sale') || isStaffOrAdmin,
      
      // Productos
      can_add_products: hasPermission('inventory.add_product') || isStaffOrAdmin,
      can_change_products: hasPermission('inventory.change_product') || isStaffOrAdmin,
      can_delete_products: hasPermission('inventory.delete_product') || isStaffOrAdmin,
      
      // Compras / Proveedores (asumimos permisos sobre supplier para compras según estructura del refactor)
      can_add_purchases: hasPermission('inventory.add_movementinventory') || isStaffOrAdmin,
      can_change_purchases: hasPermission('inventory.change_movementinventory') || isStaffOrAdmin,
      can_delete_purchases: hasPermission('inventory.delete_movementinventory') || isStaffOrAdmin,
      
      // Inventario
      can_view_inventory: hasPermission('inventory.view_movementinventory') || isStaffOrAdmin,
      can_change_inventory: hasPermission('inventory.change_movementinventory') || isStaffOrAdmin,
      can_add_inventory_adjustments: hasPermission('inventory.add_movementinventory') || isStaffOrAdmin,
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

  const { can, isSales, isStaffOrAdmin, userPermissions } = permissions
  
  // Extraemos las validaciones granulares construidas previamente en userPermissionsObj
  const { 
    can_manage_users, 
    can_add_sales, 
    can_change_sales, 
    can_delete_sales,
    can_add_products,
    can_change_products,
    can_delete_products,
    can_add_purchases,
    can_change_purchases,
    can_delete_purchases,
    can_view_inventory
  } = userPermissions

  return {
    // Acciones rápidas (ahora impulsadas por los verdaderos permisos granulares)
    canCreateUser: can_manage_users,
    canEditUser: can_manage_users,
    canDeleteUser: can_manage_users,
    canManageUsers: can_manage_users,
    
    canCreateSale: can_add_sales,
    canEditSale: can_change_sales,
    canDeleteSale: can_delete_sales,
    
    canCreateProduct: can_add_products,
    canEditProduct: can_change_products,
    canDeleteProduct: can_delete_products,
    
    canCreatePurchase: can_add_purchases,
    canEditPurchase: can_change_purchases,
    canDeletePurchase: can_delete_purchases,
    
    canViewDashboard: can_view_inventory || isSales || isStaffOrAdmin,
    canViewReports: can('view', 'sale') && can('view', 'user') || isStaffOrAdmin,
    canViewFinance: can('view', 'financialtransaction') || isStaffOrAdmin,
    
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
