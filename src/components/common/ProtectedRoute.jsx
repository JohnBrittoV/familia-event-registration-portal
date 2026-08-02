import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';

export const ProtectedRoute = ({ children, allowedRoles }) => {

    const { isAuthenticated, user, dbUser, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Spinner size='lg' />
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace/>;
    }

    const isApproved = dbUser?.isApproved === true;
    const userRole = dbUser?.role;

    if (!isApproved && !['admin', 'owner'].includes(userRole)) {
        return <Navigate to="/pending" replace/>
    }

    if (!isApproved && !allowedRoles.includes(userRole)) {
        return ['admin', 'owner'].includes(userRole) 
            ? <Navigate to="/admin" replace /> 
            : <Navigate to="/dashboard" replace />;
    }

    // if (allowAdminOnly && !hasAdminPrivileges) {
    //     return <Navigate to="/dashboard" replace />
    // }

    //  if (!allowAdminOnly && hasAdminPrivileges) {
    //     return <Navigate to="/admin" replace />
    // }

    return children;

}