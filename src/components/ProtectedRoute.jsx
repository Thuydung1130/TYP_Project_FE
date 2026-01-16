import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

/**
 * ProtectedRoute - Component bảo vệ các route cần authentication
 * Nếu không có token, sẽ redirect về trang đăng nhập
 */
export default function ProtectedRoute({ children }) {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

