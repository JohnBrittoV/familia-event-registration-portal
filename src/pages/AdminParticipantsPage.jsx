import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminParticipantsList } from '../modules/prayer-offerings/features/AdminParticipantsList';
import { Greeting } from '../components/features/Greeting';
import { useAuth } from '../context/AuthContext';

export const AdminParticipants = () => { // <-- The Page
    const { user } = useAuth();
    return (
        <AdminLayout> {/* Layout Wrapper (Sidebar) */}
            <div className='max-w-7xl mx-auto space-y-6'>
                <Greeting 
                    name={user?.displayName} 
                    role="Admin" 
                    subtitle="View all participants registered for Familia'26." 
                />
                {/* Rendering the Component here */}
                <AdminParticipantsList /> 
            </div>
        </AdminLayout>
    );
};