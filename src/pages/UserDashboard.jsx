import React from "react";
import { useAuth } from "../context/AuthContext";
import { Users, FileCheck, IndianRupee } from "lucide-react";
import { DashboardHeader } from '../components/layout/UserDashboardHeader';
import { StatCard } from '../components/ui/StatCard';
import { Greeting } from "../components/features/Greeting";
import { RegistrationWizard } from "../components/features/RegistrationWizard";

export const UserDashboard = () => {
    const { user } = useAuth();

    return(
        <div className="min-h-screen bg-slate-50 duration-300
                        dark:bg-slate-900 transition-colors ">
            
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 
                             sm:px-6 lg:px-8 py-8 space-y-8">
                
                <Greeting 
                    name={user?.displayName} 
                    role="Responsible Person" 
                    subtitle="Here is an overview of your registration activity." 
                />

                {/* Metrics Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

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

                <RegistrationWizard/>

            </main>

        </div>

    )
}