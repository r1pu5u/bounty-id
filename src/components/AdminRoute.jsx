import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
  console.log('AdminRoute: Component is rendering');
  const userString = localStorage.getItem('user');
  console.log('AdminRoute: userString from localStorage:', userString);
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
      console.log('AdminRoute: Parsed user object:', user);
    } catch (e) {
      console.error('AdminRoute: Error parsing user from localStorage:', e);
      localStorage.removeItem('user');
      return <Navigate to="/login" />;
    }
  }

  if (!user) {
    console.log('AdminRoute: No user found, redirecting to /login');
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    console.log(`AdminRoute: User role is "${user.role}", redirecting to /login`);
    return <Navigate to="/login" />;
  }

  console.log('AdminRoute: User is admin, rendering children');
  return children;
}

export default AdminRoute 