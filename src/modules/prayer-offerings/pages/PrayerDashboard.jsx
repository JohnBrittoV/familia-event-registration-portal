import React from 'react';
import { usePrayerAuth } from '../hooks/usePrayerAuth';
import { MobileEntryStep } from '../components/auth/MobileEntryStep';
import { ProfileSetupStep } from '../components/auth/ProfileSetupStep';
import { HailMaryCounter } from '../components/HailMaryCounter';
import { PrayerBookingForm } from '../components/PrayerBookingForm';
import { PrayerHistoryTable } from '../components/PrayerHistoryTable';
import { Spinner } from '../../../components/ui/Spinner';

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
            <Spinner/>
        );
    }

    // If the user is authenticated, render the actual dashboard
    if (currentUser) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 
                            font-sans transition-colors duration-200">
            
            {/* Top Navigation Bar */}
            <div className="p-4 px-6 flex justify-between items-center 
                            bg-white dark:bg-slate-800 shadow-sm 
                            border-b border-slate-200 dark:border-slate-700 
                            transition-colors duration-200">

                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white w-8 h-8 
                                    rounded-lg flex items-center 
                                    justify-center shadow-sm">

                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                       </svg>
                    </div>

                    <span className="font-bold text-slate-900 
                                     dark:text-white">Familia'26 Prayer Partners</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 
                                    bg-green-50 dark:bg-green-900/30 
                                    text-green-700 dark:text-green-400 
                                    px-3 py-1 rounded-full text-sm font-medium 
                                    border border-green-200 dark:border-green-800">

                        <span>✅</span> {currentUser.name}
                        <span className="bg-green-200 dark:bg-green-800 
                                         px-2 py-0.5 rounded-full text-xs ml-1">
                            {currentUser.place}
                        </span>
                    </div>

                    <button onClick={logout} className="text-sm font-medium 
                                                      text-slate-500 dark:text-slate-400 
                                                      hover:text-slate-800 dark:hover:text-slate-200 
                                                      transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>

                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-4xl mx-auto p-6 mt-8 space-y-8">
                {/* Hail Mary Counter Widget */}
                <HailMaryCounter userMobile={currentUser.mobile}/>

                {/* Placeholder for Prayer Booking (Step 4.3) */}
                <div className="bg-white dark:bg-slate-800 
                                p-6 rounded-2xl shadow-sm border 
                                border-slate-100 dark:border-slate-700 
                                text-center text-slate-500 dark:text-slate-400">
                    <PrayerBookingForm currentUser={currentUser}/>

                    

                </div>

                <div className="bg-white dark:bg-slate-800 
                                p-6 rounded-2xl shadow-sm border 
                                border-slate-100 dark:border-slate-700 
                                text-center text-slate-500 dark:text-slate-400">
                    <PrayerHistoryTable currentUser={currentUser}/>
                </div>
                
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