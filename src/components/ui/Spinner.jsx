import React from 'react';

export const Spinner = ({ size = 'md', centered = true }) => {
    
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    const spinnerCircle = (
        <div 
            className={`${sizeClasses[size] || sizeClasses.md} 
                        animate-spin rounded-full border-gray-200
                        border-t-blue-600 dark:border-t-blue-400`}
            role='status'
            aria-label='Loading'
        />
    );

    if (!centered) return spinnerCircle;

    return( 
        <div className='flex items-center justify-center min-h-64 p-4'>
            {spinnerCircle}
        </div>
    )
}