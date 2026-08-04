import React from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Baby, IndianRupee, UserCheck, Calendar, HouseHeart } from "lucide-react";
import { StatCard } from '../components/ui/StatCard';
import { Greeting } from "../components/features/Greeting";
import { Spinner } from "../components/ui/Spinner";
import { useRPStats } from "../hooks/useRPStats";

export const UserDashboard = () => {
    const { user } = useAuth();
    const { stats, loading } = useRPStats(user?.uid);

    if (loading) {
        return <div className="py-4 flex justify-center"><Spinner size="lg" /></div>;
    }

    return(

        <div className="max-w-7xl mx-auto space-y-8">
            <Greeting 
                name={user?.displayName} 
                role="responsible persons overview" 
                subtitle="Monitor your registration progress, update participant details, and view collection totals." 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                
                <StatCard
                    title="Total Families"
                    value={stats.totalFamilies}
                    icon={HouseHeart}
                    theme="blue"
                />

                <StatCard
                    title="Total Adults"
                    value={stats.totalAdults}
                    icon={Users}
                    theme="purple"
                />

                <StatCard
                    title="Total Kids"
                    value={stats.totalKids}
                    icon={Baby}
                    theme="emerald"
                />

                <StatCard
                    title="Total Attendees"
                    value={stats.totalAttendees}
                    icon={Calendar}
                    theme="amber"
                />

            </div>
        </div>
    )
}