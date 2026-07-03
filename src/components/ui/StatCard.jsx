import { Icon } from 'lucide-react';
import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend}) => {
    return(
        <div className='bg-white dark:bg-slate-800 p-6 
                          rounded-2xl border border-slate-200/60 
                          dark:border-slate-700/60 shadow-sm 
                          hover:shadow-md transition-shadow'>

            <div className='flex items-center justify-between mb-4'>
                
                <h3 className='text-sm font-semibold text-slate-500 
                               dark:text-slate-400'>
                    {title}
                </h3>

                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 
                                text-blue-600 dark:text-blue-400 
                                rounded-xl">
                    {Icon && <Icon size={20} aria-hidden="true" />}
                </div>
            </div>

            <div className='flex items-baseline gap-3'>
                <span className="text-3xl font-bold 
                                 text-slate-900 dark:text-white">
                    {value}
                </span>

                {trend && (
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {trend}
                    </span>
                )}
            </div>

        </div>
    )
}