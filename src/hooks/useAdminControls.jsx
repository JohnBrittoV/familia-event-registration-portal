import { useState, useEffect } from 'react';
import { fetchUsers, toggleApproval, 
         deleteUserWithSecret, updateUserRole 
        } from '../services/adminService';

export const useAdminControls = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await fetchUsers();
                setUsers(userData);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Handle User Approval
    const handleToggleAccess = async (userId, currentStatus) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: !currentStatus } : u));
        await toggleApproval(userId, currentStatus);
    };

    // Handle User Role
    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'responsible_person' : 'admin';
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        
        try {
            await updateUserRole(userId, newRole);
        } catch (error) {
            console.error("Failed to update role", error);
            setUsers(prev => prev.map(u => u.id === userId ? {...u, role: currentRole} : u));
            alert('Failed to update user role');
        }
    }

    // Handle Delete User
    const handleDeleteUser = async (userId) => {
        const secretCode = window.prompt('Enter Secret Code to delete this user:');
        if (secretCode === 'FAMILIA26_DELETE') {
            await deleteUserWithSecret(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            alert('User deleted successfully.');
        }
        else {
            alert("Invalid deletion code!");
        }
    };

    return {users, loading, handleToggleAccess, handleToggleRole, handleDeleteUser};
};

