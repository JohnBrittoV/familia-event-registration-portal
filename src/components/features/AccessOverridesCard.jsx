import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const AccessOverridesCard = ({ data }) => {
    const navigate = useNavigate();

    // Fallback defaults if data is missing
    const {
        title = "Access Role-Based Control",
        description = "Override access controls for pending accounts, manage system permissions, and set user access overrides.",
        buttonText = "Manage Pending Access",
        path = "/admin/pending",
        icon: Icon,
        illustration
    } = data || {};

    return (
        <div
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/70
                bg-white dark:bg-slate-800 p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between h-full">
            {/* Decorative Background Glows */}
            <div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"/>
            <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
                    group-hover:opacity-100 bg-linear-to-r from-blue-500/5 via-transparent
                    to-blue-500/5 pointer-events-none"/>

            <div className="relative z-10 flex flex-col justify-between h-full">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br
                                from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-500/10
                                text-blue-600 dark:text-blue-400 ring-1 ring-blue-200/60 dark:ring-blue-400/10
                                transition-transform duration-300 group-hover:scale-105 shrink-0">
                            {/* Dynamically renders the assigned Lucide icon */}
                            {Icon && <Icon size={22} />}
                        </div>

                        <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-900 dark:text-white line-clamp-1">
                            {title}
                        </h2>
                    </div>

                    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">
                        {description}
                    </p>
                </div>

                {/* Illustration Section */}
                <div className="my-4 flex items-center justify-center">
                    <div className="relative w-full py-4 px-6 rounded-2xl bg-linear-to-tr from-blue-50/50 via-sky-50/30 to-indigo-50/50 dark:from-slate-900/40 dark:via-slate-800/50 dark:to-blue-950/30 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center">
                        <img 
                            src={illustration} 
                            alt={title} 
                            className="w-full h-auto max-h-32 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105 animate-[float_4s_ease-in-out_infinite]"
                        />
                    </div>
                </div>    

                {/* Dynamic Button with Routing */}
                <button 
                    onClick={() => navigate(path)}
                    className="group/button relative overflow-hidden inline-flex w-full items-center justify-between
                        rounded-xl border border-blue-200/70 dark:border-blue-800/60 bg-linear-to-r from-blue-50
                        via-white to-blue-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/40
                        px-5 py-3 text-sm font-medium text-blue-700 dark:text-blue-300 transition-all
                        duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 mt-auto">

                    {/* Animated Shimmer */}
                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent
                            via-white/10 to-transparent group-hover/button:translate-x-full transition-transform
                            duration-1000 ease-out" />

                    <span className="relative z-10 font-semibold truncate pr-2">
                        {buttonText}
                    </span>

                    <ChevronRight
                        size={18}
                        className="relative z-10 shrink-0 transition-all duration-300 group-hover/button:translate-x-1.5
                            group-hover/button:scale-110"/>
                </button>
            </div>
        </div>
    );
}