import React from 'react';
import { Users, FileCheck, IndianRupee } from 'lucide-react';
import { DashboardHeader } from '../components/layouts/DashboardHeader';
import { StatCard } from '../components/ui/StatCard';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {

    const { user } = useAuth();

    return( 
        <div className="min-h-screen bg-slate-50 
                        dark:bg-slate-900 transition-colors 
                        duration-300">

            <DashboardHeader />

            <main className='max-w-7xl mx-auto px-4 sm:px-6 
                            lg:px-8 py-8 space-y-8'>

                {/* Greetings section */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold 
                                 text-slate-900 dark:text-white">
                        Welcome back, {user?.displayName?.split(' ')[0]} 
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Here is an overview of your registration activity.
                    </p>

                </div>

                {/* Matrix Overview Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 
                                lg:grid-cols-3 gap-5'>

                    <StatCard 
                        title="My Total Registrations" 
                        value="0" 
                        icon={Users} 
                        trend="+0 this week"
                    />
                    <StatCard 
                        title="Completed Payments" 
                        value="0" 
                        icon={FileCheck} 
                    />
                    <StatCard 
                        title="Total Amount Collected" 
                        value="₹0" 
                        icon={IndianRupee} 
                    />

                </div>

                <div className="bg-white dark:bg-slate-800 
                                  rounded-3xl border border-slate-200 
                                  dark:border-slate-700 p-8 text-center 
                                  border-dashed">

                    <p className="text-slate-500 dark:text-slate-400">
                        Multi-Step Registration Form & User Table will go here.
                    </p>
                </div>

            </main>

        </div>
    )
}