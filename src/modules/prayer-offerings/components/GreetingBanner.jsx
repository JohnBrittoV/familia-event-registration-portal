import React from 'react';

export const GreetingBanner = ({ userName }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative z-10">
                <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-100 dark:text-blue-500 text-xs px-3 py-1 font-semibold uppercase tracking-wider mb-3 inline-block">
                    Intercession Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Welcome back, {userName}!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-xl">
                    Your prayers are powerful. Offer your intercessions, track real-time global progress, and support Familia'26.
                </p>
            </div>
        </div>
    );
};