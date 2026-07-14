// src/components/common/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen" />;
    }

    if (isAuthenticated) {
        // Redirect authenticated users to their role‑specific dashboard
        return isAdmin
            ? <Navigate to="/admin/dashboard" replace />
            : <Navigate to="/customer/dashboard" replace />;
    }

    // Not authenticated → show the public page
    return children;
}