import React from 'react';

export const Greeting = ({ name, role, subtitle }) => {
    
   return(
        
        <div className='mb-6'>

            <h1 className="text-2xl sm:text-3xl font-bold 
                        text-slate-900 dark:text-white">
                Welcome back, {name?.split(' ')[0]} 
            </h1>

            <p className="text-sm font-medium text-blue-600 
                        dark:text-blue-400 uppercase 
                        tracking-widest mt-1 mb-2">
                {role}
            </p>

            <p className="text-slate-600 dark:text-slate-400">
                {subtitle}
            </p>

        </div>
    )
};

