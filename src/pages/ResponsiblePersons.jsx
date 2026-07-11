import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Greeting } from "../components/features/Greeting";
import { fetchPaginatedUsersByRole } from "../services/userService"; 
import { toggleApproval, updateUserRole, deleteUserWithSecret } from "../services/adminService";
import { UserAccessTable } from "../components/features/UserAccessTable";

export const ResponsiblePersons = () => {

    const [users, setUsers] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const loadData = async (isNext = false) => {
        setLoading(true);
        try {
            const data = await fetchPaginatedUsersByRole('responsible_person', isNext ? lastDoc : null, 10);
            
            if (isNext) {
                setUsers(prev => [...prev, ...data.result]);
            } else {
                setUsers(data.result);
            }
            
            setLastDoc(data.lastDoc);
            setHasNext(data.result.length === 10);
        } catch (error) {
            console.error("Failed to load responsible persons", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(false);
    }, []);

    // --- ADMIN ACTION HANDLERS ---
    const handleToggleAccess = async (userId, currentStatus) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: !currentStatus } : u));
        await toggleApproval(userId, currentStatus);
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'responsible_person' : 'admin';
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        try {
            await updateUserRole(userId, newRole);
            // If they are no longer a responsible person, remove them from this specific list
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: currentRole } : u));
            alert('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        const secretCode = window.prompt('Enter Secret Code to delete this user:');
        if (secretCode === 'FAMILIA26_DELETE') {
            await deleteUserWithSecret(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } else {
            alert("Invalid deletion code!");
        }
    };

    return(
        <>
            <AdminLayout>
                 <Greeting 
                    name={user?.displayName} 
                    role="Admin" 
                    subtitle="Monitor portal activity and manage user access."/>

                    <div className="max-w-7xl mx-auto space-y-6">
                
                <UserAccessTable 
                    users={users}
                    title="Responsible Persons Directory"
                    subtitle="View and manage all registered responsible persons (Max 10 per page)."
                    onToggleAccess={handleToggleAccess}
                    onToggleRole={handleToggleRole}
                    onDelete={handleDeleteUser}
                />

                {/* Load More Button */}
                {hasNext && (
                    <div className="flex justify-center pt-4">
                        <button 
                            onClick={() => loadData(true)}
                            disabled={loading}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white font-medium text-sm rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Loading...' : 'Load More Users'}
                        </button>
                    </div>
                )}
            </div>
            </AdminLayout>
        </>
    )

}