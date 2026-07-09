import React from 'react';

export const FeatureCard = ({ icon: Icon, text }) => {
    return (
        <div className='flex items-center gap-3 p-3 sm:p-4 
                        bg-white dark:bg-slate-800 rounded-xl 
                        shadow-sm border border-slate-100/50 
                        dark:border-slate-700 hover:shadow-md 
                        transition-shadow duration-200 w-full h-full'>
            
            <Icon size={20} className="text-[#3B6AB0] dark:text-blue-400 
                                        shrink-0" />

            <span className="text-sm sm:text-base font-semibold 
                            text-slate-700 dark:text-slate-200">
                {text}
            </span>

        </div>
    );
};