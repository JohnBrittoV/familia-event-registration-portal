import React from 'react';
import { Greeting } from '../components/features/Greeting';
import { useAuth } from '../context/AuthContext';

export const AdminPrayerPartners = () => {
    
    const { user } = useAuth();

    return(
            <>
                <Greeting 
                    name={user?.displayName} 
                    role="Admin" 
                    subtitle="Manage prayer partners and thier account details."/>
                                
                <div className="flex items-center justify-center h-[80%]">
                    <p>Prayer Partners Page</p>
                </div>
                        
            </>  
        )
}