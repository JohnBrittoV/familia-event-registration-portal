import React from 'react';
import { Greeting } from '../components/features/Greeting';
import { useAuth } from '../context/AuthContext';

export const AdminPendingAccess = () => {
    
    const { user } = useAuth();
    
        return(
            <>
                <Greeting 
                    name={user?.displayName} 
                    role="Admin" 
                    subtitle="Review and manage pending access requests."/>
                                
                <div className="flex items-center justify-center h-[80%]">
                    <p>Pending Access Page</p>
                </div>
                        
            </>  
        )
}