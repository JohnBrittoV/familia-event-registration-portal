import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../components/layout/AdminDashboardHeader';
import { Greeting } from '../components/features/Greeting';
import { StatCard } from '../components/ui/StatCard';
import { cardThemes } from '../assets/styles/cardThemes';
import { UserAccessTable } from '../components/features/UserAccessTable';
import { useAuth } from '../context/AuthContext';
import { useAdminControls } from '../hooks/useAdminControls';
import { Spinner } from '../components/ui/Spinner';
import { RecentParticipantsTable } from '../components/features/RecentParticipantsTable';
import { fetchLatestResponsiblePersons } from '../services/userService';
import { Users, Globe, TrendingUp, ShieldCheck, Gift } from 'lucide-react';


export const AdminDashboard = () => {
    
    const { user } = useAuth();
    const { handleToggleAccess, handleToggleRole, handleDeleteUser } = useAdminControls();

    const [responsibleUsers, setResponsibleUsers] = useState([]);
    const [loadingRecentUsers, setLoadingRecentUsers] = useState(true);

    const loadResponsiblePersons = async () => {
        setLoadingRecentUsers(true);
        const data = await fetchLatestResponsiblePersons(3);
        setResponsibleUsers(data);
        setLoadingRecentUsers(false);
    };

    useEffect(() => {
        loadResponsiblePersons();
    }, []);

    const onAccessToggle = async (id, isApproved) => {
        await handleToggleAccess(id, isApproved);
        loadResponsiblePersons();
    };

    const onRoleToggle = async (id, currentRole) => {
        await handleToggleRole(id, currentRole);
        loadResponsiblePersons();
    };

    const onUserDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await handleDeleteUser(id);
            loadResponsiblePersons();
        }
    };

    return(
        <div className='max-w-360 mx-auto px-4 sm:px-6 lg:px-8 space-y-6'>

            <Greeting 
                name={user?.displayName} 
                role="Admin" 
                subtitle="Monitor portal activity and manage user access." 
            />

            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">

                <div className='w-full 2xl:col-span-7'>
                    {loadingRecentUsers ? (
                        <div className="flex justify-center p-12 bg-white 
                                        dark:bg-slate-800 rounded-2xl border 
                                        border-slate-200 dark:border-slate-700">                                    
                            <Spinner />
                        </div>
                    ) : (
                        <UserAccessTable 
                            users={responsibleUsers} 
                            onToggleAccess={handleToggleAccess}
                            onToggleRole={handleToggleRole}
                            onDelete={handleDeleteUser}
                        />
                    )}
                </div>
                    
                <div className="w-full 2xl:col-span-5">
                    <RecentParticipantsTable />
                </div>

            </div>

        </div>
    )
}