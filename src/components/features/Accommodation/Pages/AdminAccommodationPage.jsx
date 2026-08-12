import React from 'react';
import { Greeting } from '../../Greeting';
import { useAuth } from '../../../../context/AuthContext';

export const AdminAccommodationPage = () => {

    const { user } = useAuth();

    return(

        <>
            <Greeting 
                name={user?.displayName} 
                role="Admin" 
                subtitle="Manage accommodation areas and thier room details."/>
                                        
            <div className="flex items-center justify-center h-[80%]">
                <p>Pending Access Page</p>
            </div>
                                
        </>  
    )
}