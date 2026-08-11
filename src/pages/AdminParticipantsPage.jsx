import React from 'react';
import { AdminParticipantsList } from '../modules/prayer-offerings/features/AdminParticipantsList';
import { Greeting } from '../components/features/Greeting';
import { useAuth } from '../context/AuthContext';

export const AdminParticipants = () => { // <-- The Page
    const { user } = useAuth();
    return (
        
        <div className='max-w-7xl mx-auto space-y-6'>
            <Greeting 
                name={user?.displayName} 
                role="Admin" 
                subtitle="View and manage all participants registration for Familia'26." 
            />
            {/* Rendering the Component here */}
            <AdminParticipantsList /> 
        </div>
        
    );
};