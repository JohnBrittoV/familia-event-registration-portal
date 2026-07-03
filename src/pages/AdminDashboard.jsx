import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminHeader } from '../components/layout/AdminDashboardHeader';
import { Greeting } from '../components/features/Greeting';
import { UserAccessTable } from '../components/features/UserAccessTable';
import { useAuth } from '../context/AuthContext';
import { useAdminControls } from '../hooks/useAdminControls';
import { Spinner } from '../components/ui/Spinner';

export const AdminDashboard = () => {
    
    const { user } = useAuth();
    const { users, loading, handleToggleAccess, handleToggleRole, handleDeleteUser } = useAdminControls();

    return(
        
        <>
            <AdminLayout>

                <div className='max-w-7xl mx-auto 
                                space-y-6'>

                    <Greeting 
                        name={user?.displayName} 
                        role="Admin" 
                        subtitle="Monitor portal activity and manage user access." 
                    />

                    <div className="grid grid-cols-1 
                                    lg:grid-cols-2 gap-6">

                        {/* Left Column: User Table */}

                        {loading ? (
                            <div className="flex justify-center p-12"><Spinner /></div>
                        ) : (
                            <UserAccessTable 
                                users={users} 
                                onToggleAccess={handleToggleAccess}
                                onToggleRole={handleToggleRole}
                                onDelete={handleDeleteUser}
                            />
                        )}
                        
                        {/* Right Column: Placeholder */}

                        <div className="bg-white dark:bg-slate-800 
                                        rounded-2xl border border-slate-200 
                                        dark:border-slate-700 p-6 flex flex-col 
                                        items-center justify-center border-dashed 
                                        min-h-75">
                                            
                            <p className="text-slate-500 
                                        dark:text-slate-400 font-medium">Recent Participants Table</p>

                            <p className="text-xs text-slate-400 mt-2">Coming Soon</p>

                        </div>
                    </div>

                </div>

            </AdminLayout>
        </>
    )
}