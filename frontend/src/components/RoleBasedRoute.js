import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ROUTES from '../utils/routes';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectTo = user?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleBasedRoute;