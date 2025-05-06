import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function UserRoute({ children }) {
  const { user, isUser } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isUser) return <Navigate to="/admin" replace />
  return children
}

export default UserRoute 