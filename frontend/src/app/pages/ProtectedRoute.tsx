import React from 'react';
import { Navigate, useLocation } from 'react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, and the user's role isn't in the list
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to their respective dashboards based on their actual role
    if (role === 'SUPER_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'VENDOR') return <Navigate to="/vendor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}