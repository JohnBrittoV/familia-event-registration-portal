import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowAdminOnly = false}) => {

    const { isAuthenticated, user, loading } = useAuth();
    const isApproved = true;
    const isAdmin = user?.email?.endsWith('@admin.com') || false;

    if (!isAuthenticated) {
        return <Navigate to="/" replace/>;
    }

    if (!isApproved && !isAdmin) {
        return <Navigate to="/pending" replace/>
    }

    if (allowAdminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return children;

}