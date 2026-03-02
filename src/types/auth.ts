// Interfaces basadas en el schema del backend Django

export interface DjangoUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  last_login?: string
  groups: DjangoGroup[]
  user_permissions: DjangoPermission[]
}

export interface DjangoGroup {
  id: number
  name: string  // 'Sales', 'Inventory', 'Managers', 'Customers'
  permissions?: DjangoPermission[]
}

export interface DjangoPermission {
  id: number
  name: string  // 'Can add sale', 'Can change product'
  codename: string  // 'add_sale', 'change_product'
  content_type: number
  content_type_name: string  // 'sale', 'product'
}

export interface UserCreateRequest {
  username: string
  email: string
  password: string
  is_staff: boolean
  groups?: number[]  // IDs de grupos
}

export interface UserUpdateRequest {
  username?: string
  email?: string
  is_staff?: boolean
  is_active?: boolean
  groups?: number[]  // IDs de grupos
}

export interface UserListResponse {
  count: number
  next?: string
  previous?: string
  results: DjangoUser[]
}

export interface GroupListResponse {
  count: number
  next?: string
  previous?: string
  results: DjangoGroup[]
}

export interface GroupCreateRequest {
  name: string
  permissions?: number[]
}

export interface GroupUpdateRequest {
  name?: string
  permissions?: number[]
}

// Interfaces para permisos específicos
export interface UserPermissions {
  can_manage_users: boolean
  can_add_sales: boolean
  can_change_sales: boolean
  can_delete_sales: boolean
  can_add_products: boolean
  can_change_products: boolean
  can_delete_products: boolean
  can_add_purchases: boolean
  can_change_purchases: boolean
  can_delete_purchases: boolean
  can_view_inventory: boolean
  can_change_inventory: boolean
  can_add_inventory_adjustments: boolean
}

// Roles predefinidos basados en los grupos de Django
export type UserRole = 'Sales' | 'Inventory' | 'Managers' | 'Customers'

export interface UserWithRole extends DjangoUser {
  primary_role: UserRole
  permissions: UserPermissions
}
