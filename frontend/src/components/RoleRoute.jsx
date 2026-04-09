import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser } from '../services/api'

export default function RoleRoute({ allowedRoles }) {
  const user = getCurrentUser()
  const role = user?.role

  if (!role) return <Navigate to="/login" replace />
  if (!allowedRoles?.includes(role)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

