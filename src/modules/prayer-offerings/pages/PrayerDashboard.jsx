import React from 'react';
import { usePrayerAuth } from '../hooks/usePrayerAuth';
import { MobileEntryStep } from '../components/auth/MobileEntryStep';
import { ProfileSetupStep } from '../components/auth/ProfileSetupStep';

export const PrayerDashboard = () => {
    const {
        currentUser, 
        isLoading, 
        error, 
        authStep, 
        tempMobile, 
        handleMobileSubmit, 
        handleProfileSubmit, 
        setAuthStep,
        logout
    } = usePrayerAuth();

    if (isLoading) {
        return (
        <div className="flex items-center justify-center 
                        min-h-screen bg-purple-50">
            <div className="animate-spin rounded-full h-12 
                            w-12 border-b-2 border-purple-600"></div>
        </div>
        );
    }

    // If the user is authenticated, render the actual dashboard
    if (currentUser) {
        return (
        <div className="min-h-screen bg-purple-50">
            {/* Placeholder for the actual dashboard content (Phase 4) */}
            <div className="p-4 flex justify-between items-center 
                            bg-white shadow-sm">
            <div>Welcome, {currentUser.name}</div>
                <button onClick={logout} 
                    className="text-sm text-gray-500 
                               hover:text-gray-800">Logout
                </button>
            </div>
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold">Dashboard Features Coming Next</h2>
                <p>User is logged in successfully via mobile number.</p>
            </div>
        </div>
        );
    }

    // If not authenticated, render the onboarding steps
    return (
        <>
        {authStep === 1 && (
            <MobileEntryStep 
            onSubmit={handleMobileSubmit} 
            isLoading={isLoading} 
            error={error} 
            />
        )}
        
        {authStep === 2 && (
            <ProfileSetupStep 
            mobile={tempMobile}
            onSubmit={handleProfileSubmit}
            onBack={() => setAuthStep(1)}
            isLoading={isLoading}
            error={error}
            />
        )}
        </>
    );
}