import React, { useState } from 'react';
import { Globe, MapPin, LogOut, User} from 'lucide-react';
import { usePrayerAuth } from '../hooks/usePrayerAuth';
import { MobileEntryStep } from '../components/auth/MobileEntryStep';
import { ProfileSetupStep } from '../components/auth/ProfileSetupStep';
import { HailMaryCounter } from '../components/HailMaryCounter';
import { PrayerBookingForm } from '../components/PrayerBookingForm';
import { PrayerHistoryTable } from '../components/PrayerHistoryTable';
import { GreetingBanner } from '../components/GreetingBanner';
import { WordOfGodCard } from '../components/WordOfGodCard';
import { Spinner } from '../../../components/ui/Spinner';
import logo from '../../../assets/icons/logo.png';

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

    const [language, setLanguage] = useState('EN');;
    const [selectedPlace, setSelectedPlace] = useState(currentUser?.place || '' )

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'EN' ? 'ML' : 'EN');
    };

    if (isLoading) {
        return (
            <Spinner/>
        );
    }

    // If the user is authenticated, render the actual dashboard
    if (currentUser) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 
                            font-malayalam transition-colors duration-200">
            
            {/* Top Navigation Bar */}
            {/* Redesigned Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                    {/* Left Side: Jesus Youth Logo + Familia'26 Branding */}
                    <div className="flex items-center gap-3">
                        <div className="w-15 h-15 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center p-1.5 shadow-inner hover:-translate-y-0.5 duration-300">
                            <img src={logo} alt="Jesus Youth Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wider text-blue-600 font-sans dark:text-blue-400 font-bold block">Jesus Youth</span>
                            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans dark:text-white tracking-tight">Familia'26</h1>
                        </div>
                    </div>

                    {/* Right Side: User Name, Location Dropdown, Language Switcher, Logout */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        
                        {/* Logged-in User Badge */}
                        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-600">
                            <User size={14} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-semibold font-sans text-slate-700 dark:text-slate-200">{currentUser.name}</span>
                        </div>

                        {/* Language Switcher (World Icon) */}
                        <button 
                            onClick={toggleLanguage}
                            title="Switch Language (English / Malayalam)"
                            className="p-2 rounded-lg bg-slate-100 font-sans dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2 text-xs font-bold"
                        >
                            <Globe size={17} className="text-blue-600 dark:text-blue-400" />
                            <span>{language}</span>
                        </button>

                        {/* Logout Button */}
                        <button 
                            onClick={logout} 
                            title="Logout"
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
                        >
                            <LogOut size={17} />
                        </button>
                    </div>

                </div>
            </header>

            {/* Dashboard Content */}
            <div className="max-w-4xl mx-auto p-6 mt-8 space-y-8">

                <GreetingBanner userName={currentUser.name} />

                <WordOfGodCard userName={currentUser.name} language={language} />      

                {/* Hail Mary Counter Widget */}
                <HailMaryCounter userMobile={currentUser.mobile}/>

                {/* Placeholder for Prayer Booking (Step 4.3) */}
                <div className="bg-white dark:bg-slate-800 
                                p-6 rounded-2xl shadow-sm border 
                                border-slate-100 dark:border-slate-700 
                                text-center text-slate-500 dark:text-slate-400">
                    <PrayerBookingForm currentUser={currentUser}/>

                </div>

                <PrayerHistoryTable currentUser={currentUser}/>
                
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