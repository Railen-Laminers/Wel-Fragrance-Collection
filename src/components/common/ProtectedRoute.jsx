// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthenticatedNavbar from './AuthenticatedNavbar';

export default function ProtectedRoute({ children, requireAdmin = false, allowAdmin = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Admin trying to access a non-admin protected page.
    // Allow /profile and other shared authenticated pages if explicitly permitted.
    if (isAdmin && !requireAdmin && !allowAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Non-admin trying to access an admin-only page → redirect to customer dashboard
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/customer/dashboard" replace />;
    }

    return <AuthenticatedNavbar>{children}</AuthenticatedNavbar>;
}