import React from "react";
import { useAuth } from "../context/AuthContext";
import { StatCard } from '../components/ui/StatCard';
import { Greeting } from "../components/features/Greeting";
import { Spinner } from "../components/ui/Spinner";
import { useRPStats } from "../hooks/useRPStats";
import { Users, Baby, IndianRupee, UserCheck, Calendar, Hash, 
        HouseHeart, Layers, ToyBrick, BookOpen,Backpack,
        GraduationCap, PersonStanding } from "lucide-react";

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

                <StatCard
                    title="Families Paid"
                    value={stats.advanceCount}
                    icon={Hash}
                    theme="pink"
                />

                <StatCard
                    title="Total Advance"
                    value={stats.formattedAdvanceAmount}
                    icon={IndianRupee}
                    theme="lime"
                />

            </div>

                {/* Child Age Group Breakdown Section */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                    <Layers className="text-slate-500 dark:text-slate-400" size={20} />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kids Count by Age Category</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <StatCard
                        title="Age 0 - 2"
                        value={stats.ageGroups?.["0-2"] || 0}
                        icon={Baby}
                        theme="red"
                    />
                    <StatCard
                        title="Age 3 - 5"
                        value={stats.ageGroups?.["3-5"] || 0}
                        icon={ToyBrick}
                        theme="indigo"
                    />
                    <StatCard
                        title="Age 6 - 8"
                        value={stats.ageGroups?.["6-8"] || 0}
                        icon={BookOpen}
                        theme="sky"
                    />
                    <StatCard
                        title="Age 9 - 11"
                        value={stats.ageGroups?.["9-11"] || 0}
                        icon={Backpack}
                        theme="yellow"
                    />
                    <StatCard
                        title="Age 12 - 14"
                        value={stats.ageGroups?.["12-14"] || 0}
                        icon={GraduationCap}
                        theme="orange"
                    />
                    <StatCard
                        title="Age > 15"
                        value={stats.ageGroups?.[">15"] || 0}
                        icon={PersonStanding}
                        theme="green"
                    />
                </div>

            </div>
        </div>
    )
}