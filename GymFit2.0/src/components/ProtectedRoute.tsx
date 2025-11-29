// Componente para proteger rutas según roles de usuario
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../interfaces/gym.interfaces';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[]; // Rol o roles requeridos
  requireAuth?: boolean; // Si requiere autenticación (cualquier rol)
}

/**
 * Componente que protege rutas según autenticación y roles
 * @param children - Componente hijo a renderizar si tiene permisos
 * @param requiredRole - Rol o roles requeridos para acceder
 * @param requireAuth - Si requiere autenticación (por defecto true)
 */
export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { authData } = useAuth();

  // Si requiere autenticación y el usuario no está autenticado
  if (requireAuth && !authData.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico
  if (requiredRole && authData.user) {
    const userRole = authData.user.role;
    
    // Si requiredRole es un array, verificar si el usuario tiene alguno de los roles
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        // Redirigir según el rol del usuario
        if (userRole === UserRole.ADMIN) {
          return <Navigate to="/admin" replace />;
        } else if (userRole === UserRole.TRAINER) {
          return <Navigate to="/trainer-panel" replace />;
        } else {
          return <Navigate to="/user-panel" replace />;
        }
      }
    } else {
      // Si requiredRole es un solo rol
      if (userRole !== requiredRole) {
        // Redirigir según el rol del usuario
        if (userRole === UserRole.ADMIN) {
          return <Navigate to="/admin" replace />;
        } else if (userRole === UserRole.TRAINER) {
          return <Navigate to="/trainer-panel" replace />;
        } else {
          return <Navigate to="/user-panel" replace />;
        }
      }
    }
  }

  // Si pasa todas las validaciones, renderizar el componente hijo
  return <>{children}</>;
};

