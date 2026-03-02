import React from 'react'
import { Navigate } from 'react-router-dom'
import { usePermissions } from '../../hooks/auth/usePermissions'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredGroups?: string[]
  requiredPermissions?: string[]
  fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredGroups = [],
  requiredPermissions = [],
  fallback = <Navigate to="/unauthorized" />
}) => {
  const permissions = usePermissions()
  
  if (!permissions) {
    return fallback
  }
  
  const { hasGroup, hasPermission, isStaffOrAdmin } = permissions
  
  const hasRequiredGroups = requiredGroups.length === 0 || 
    requiredGroups.every(group => hasGroup(group))
    
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission))
  
  if (isStaffOrAdmin || (hasRequiredGroups && hasRequiredPermissions)) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

export default ProtectedRoute
