import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import accessIllustration from '../../assets/images/Access.svg';

export const AccessOverridesCard = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 p-6 sm:p-7 shadow-sm relative overflow-hidden group flex flex-col justify-between">
            
            {/* Top Header Content */}
            <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 shadow-sm">
                    <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Access Overrides & Role-Based Control
                </h3>
            </div>

            {/* Main Content Layout: Left Text & Action / Right Illustration */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
                
                {/* Left Side: Description and Button */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Override access controls for pending accounts, manage system permissions, and set user access overrides.
                    </p>

                    <div>
                        <button
                            onClick={() => navigate('/admin/pending')}
                            className="inline-flex items-center justify-between px-5 py-3 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold text-sm transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 group-hover:shadow-md w-full sm:w-auto min-w-60"
                        >
                            <span>Manage Pending Access</span>
                            <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* Right Side: Custom Illustration Container */}
                <div className="md:col-span-5 flex items-center justify-center">
                    <div className="relative w-full max-h-45 flex items-center justify-center p-2">
                        <img 
                            src={accessIllustration} 
                            alt="Access Control Illustration" 
                            className="w-full h-auto max-h-40 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
                        />
                    </div>
                </div>

            </div>

        </div>
    );
};
