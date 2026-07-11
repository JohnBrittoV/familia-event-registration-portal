import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';

export const ProtectedRoute = ({ children, allowAdminOnly = false}) => {

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
    const hasAdminPrivileges = ['admin', 'owner'].includes(dbUser?.role);

    if (!isApproved && !hasAdminPrivileges) {
        return <Navigate to="/pending" replace/>
    }

    if (allowAdminOnly && !hasAdminPrivileges) {
        return <Navigate to="/dashboard" replace />
    }

     if (!allowAdminOnly && hasAdminPrivileges) {
        return <Navigate to="/admin" replace />
    }

    return children;

}