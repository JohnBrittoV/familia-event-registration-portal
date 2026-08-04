import React, { useState, useEffect } from 'react';
import { RegistrationWizard } from '../components/features/Registration/components/RegistrationWizard';
import { useAuth } from '../context/AuthContext';
import { Greeting } from '../components/features/Greeting';
import { Spinner } from '../components/ui/Spinner';

export const RPNewParticipant = () => {
    
    const { user, loading: authLoading} = useAuth();
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if(authLoading) return;

        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [authLoading]);

    if (authLoading || pageLoading) {
        return (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <Spinner size="lg" />
                </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Optional Header Context for the Form */}
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
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