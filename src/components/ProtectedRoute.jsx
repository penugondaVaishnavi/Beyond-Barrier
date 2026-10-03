import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated user to login page, remembering location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If role doesn't match:
    // If student tries to visit teacher page -> redirect to /student
    // If teacher tries to visit student page -> redirect to /teacher
    const redirectPath = user.role === 'teacher' ? '/teacher' : '/student';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
