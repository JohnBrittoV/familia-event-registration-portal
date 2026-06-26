import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowAdminOnly = false}) => {

    const isAuthenticated = true;
    const isApproved = true;
    const isAdmin = true;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    if (!isApproved && !isAdmin) {
        return <Navigate to="/pending" replace />
    }

    if (allowAdminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
}