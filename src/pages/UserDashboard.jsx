import React from "react";
import { useAuth } from "../context/AuthContext";
import { Users, FileCheck, IndianRupee } from "lucide-react";
import { StatCard } from '../components/ui/StatCard';
import { Greeting } from "../components/features/Greeting";

export const UserDashboard = () => {
    const { user } = useAuth();

    return(
                  
            <div className="max-w-7xl mx-auto space-y-8">
                
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

            </div>

    )
}