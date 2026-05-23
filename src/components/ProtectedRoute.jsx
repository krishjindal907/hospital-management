import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')

  // Login nahi hai
  if (!token) {
    return <Navigate to="/login" />
  }

  // Role allowed nahi hai
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

export default ProtectedRoute