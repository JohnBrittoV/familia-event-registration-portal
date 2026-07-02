import React from 'react';

export const FeatureCard = ({ icon, text }) => {
    return (
        <div className='flex items-center gap-2.5 px-4 py-2.5 
                      bg-amber-50 dark:bg-amber-900/20 
                        rounded-full border border-amber-200 
                        dark:border-amber-800/30'>
            
            <span className='text-amber-600 dark:text-amber-400 
                               text-sm sm:text-base'>
                {icon} 
            </span>

            <span className="text-sm sm:text-base font-medium
                           text-slate-700 dark:text-slate-300">
                {text}
            </span>

        </div>
    );
};