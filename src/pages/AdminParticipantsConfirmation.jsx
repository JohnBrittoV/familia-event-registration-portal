import React from 'react';
import { Greeting } from '../components/features/Greeting';
import { useAuth } from '../context/AuthContext';

export const AdminParticipantsConfirmation = () => {

    const { user } = useAuth();

    return(
        <>
            <Greeting 
                name={user?.displayName} 
                role="Admin" 
                subtitle="Review participant details and confirm registrations."/>
                            
            <div className="flex items-center justify-center h-[80%]">
                <p>Participants Confirmation</p>
            </div>
                    
        </>  
    )
    
}