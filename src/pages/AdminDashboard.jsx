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
import { AccessOverridesCard } from '../components/features/AccessOverridesCard';
import { adminDashboardCards } from '../components/features/adminDashboardCard';
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

             {/* Stats Cards - Responsive Grid without horizontal scroll */}
            <div className="w-full overflow-hidden p-5">
                <div className="marquee-track">

                    {/* First set of cards */}
                    
                    <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Total Registrations" 
                            value="12,846" 
                            trend="▲ 12.5% vs last month" 
                            icon={Users} 
                            theme="violet" 
                        />
                    </div>
                    
                    <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Prayer Offerings" 
                            value="₹ 8,450" 
                            trend="▲ 18.7% vs last month" 
                            icon={Gift} 
                            theme="amber" 
                        />
                    </div>

                    <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Active Responsible Persons" 
                            value="103" 
                            trend="▲ 6.3% vs last month" 
                            icon={ShieldCheck} 
                            theme="emerald" 
                    />
                    </div>

                    <div className='min-w-75 shrink-0'>
                         <StatCard 
                            title="New Monthly Participants" 
                            value="1,256" 
                            trend="▲ 8.9% vs last month" 
                            icon={TrendingUp} 
                            theme="blue" 
                        />
                    </div>

                    <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Global Access Views" 
                            value="45,983" 
                            trend="▲ 15.4% vs last month" 
                            icon={Globe} 
                            theme="rose" 
                        />
                    </div>
                    
                    <div className='min-w-75 shrink-0'>   
                        <StatCard 
                            title="Global Access Views" 
                            value="45,983" 
                            trend="▲ 15.4% vs last month" 
                            icon={Globe} 
                            theme="sky" 
                        />
                    </div>

                    {/* Second set of same card for seemless loop */}
                        <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Total Registrations" 
                            value="12,846" 
                            trend="▲ 12.5% vs last month" 
                            icon={Users} 
                            theme="violet" 
                        />
                    </div>
                    
                    <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Prayer Offerings" 
                            value="₹ 8,450" 
                            trend="▲ 18.7% vs last month" 
                            icon={Gift} 
                            theme="amber" 
                        />
                    </div>

                    <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Active Responsible Persons" 
                            value="103" 
                            trend="▲ 6.3% vs last month" 
                            icon={ShieldCheck} 
                            theme="emerald" 
                    />
                    </div>

                    <div className='min-w-75 shrink-0'>
                         <StatCard 
                            title="New Monthly Participants" 
                            value="1,256" 
                            trend="▲ 8.9% vs last month" 
                            icon={TrendingUp} 
                            theme="blue" 
                        />
                    </div>

                    <div className='min-w-75 shrink-0'>
                        <StatCard 
                            title="Global Access Views" 
                            value="45,983" 
                            trend="▲ 15.4% vs last month" 
                            icon={Globe} 
                            theme="rose" 
                        />
                    </div>
                    
                    <div className='min-w-75 shrink-0'>   
                        <StatCard 
                            title="Global Access Views" 
                            value="45,983" 
                            trend="▲ 15.4% vs last month" 
                            icon={Globe} 
                            theme="sky" 
                        />
                    </div>
                    
                </div>
            </div>

            <div className="w-full xl:col-span-8 flex flex-col">

                    {loadingRecentUsers ? (
                        <div className="flex justify-center items-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex-1">                                    
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

            <div className="w-full xl:col-span-12">
                    <RecentParticipantsTable />
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {adminDashboardCards.map((card, index) => (
                        <div key={index} className='flex flex-col'>
                            <AccessOverridesCard data={card} />
                        </div>
                    ))}
            </div> */}

        </div>
    )
}