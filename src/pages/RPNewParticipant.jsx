import React from 'react';
import { RegistrationWizard } from '../components/features/Registration/components/RegistrationWizard';
import { useAuth } from '../context/AuthContext';
import { Greeting } from '../components/features/Greeting';

export const RPNewParticipant = () => {

    const { user } = useAuth();
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Optional Header Context for the Form */}
            <div className="max-w-4xl mx-auto space-y-6">
                <Greeting 
                name={user?.displayName} 
                role="New Registration" 
                subtitle="Fill out the form to register a new family for Familia'26." 
            />
            </div>

            {/* The core wizard component */}
            <div className="bg-white dark:bg-slate-800 
                            rounded-xl shadow-sm border 
                            border-slate-200 dark:border-slate-700 
                            p-6">

                <RegistrationWizard />
            </div>

        </div>
    );
}