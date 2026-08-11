import React from "react";
import { StatCard } from "../../../components/ui/StatCard";
import { Heart, Church, Flame, Users, Award } from 'lucide-react';

export const PrayerStatsOverview = ({ userStats }) => {
    
    // Extract stats safely with fallback defaults
    const totalHailMarys = userStats?.totalHailMarys || 0;
    const holyMassCount = userStats?.holyMassCount || 0;
    const fastingCount = userStats?.fastingCount || 0;
    const familiaPrayerCount = userStats?.familiaPrayerCount || 0;
    const totalContributions = userStats?.TotalContribution || 0;
    const hailMaryTarget = 500;
    const completionPercentage = Math.min(Math.round((totalHailMarys / hailMaryTarget) * 100), 100);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Your Prayer Overview
                </h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    Live Contributions
                </span>
            </div>

            {/* Responsive Grid of StatCards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* 1. Hail Mary Counter Card */}
                <StatCard 
                    title="Hail Mary"
                    value={totalHailMarys.toLocaleString()}
                    icon={Heart}
                    theme="blue"
                    trend={`${completionPercentage}% of personal target (${hailMaryTarget})`}
                />

                {/* 2. Holy Mass Card */}
                <StatCard 
                    title="Holy Masses"
                    value={holyMassCount}
                    icon={Church}
                    theme="violet"
                    trend="Active offering"
                />

                {/* 3. Fasting Card */}
                <StatCard 
                    title="Fasting Days"
                    value={fastingCount}
                    icon={Flame}
                    theme="amber"
                    trend="Sacrifice recorded"
                />

                {/* 4. Familia Prayers Card */}
                <StatCard 
                    title="Familia Prayers"
                    value={familiaPrayerCount}
                    icon={Users}
                    theme="emerald"
                    trend="Event intercession"
                />

                {/* 4. Familia Prayers Card */}
                <StatCard 
                    title="Total Contributions"
                    value={totalContributions.toLocaleString()}
                    icon={Award}
                    theme="sky"
                    trend="Grant total offered"
                />

            </div>
        </div>
    );
};