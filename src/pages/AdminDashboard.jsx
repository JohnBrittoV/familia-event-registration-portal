import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminHeader } from '../components/layout/AdminDashboardHeader';
import { Greeting } from '../components/features/Greeting';
import { UserAccessTable } from '../components/features/UserAccessTable';
import { useAuth } from '../context/AuthContext';
import { useAdminControls } from '../hooks/useAdminControls';
import { Spinner } from '../components/ui/Spinner';
import { RecentParticipantsTable } from '../components/features/RecentParticipantsTable';

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

                    <div className="grid grid-cols-1 gap-6">

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

                        <RecentParticipantsTable/>
                    </div>

                </div>

            </AdminLayout>
        </>
    )
}