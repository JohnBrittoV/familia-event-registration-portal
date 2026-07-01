import React from 'react';

export const Spinner = ({ size = 'md' }) => {
    
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    return( 
        <div className='flex items-center justify-center min-h-64 p-4'>
            <div 
                className={`${sizeClasses[size] || sizeClasses.md} 
                            animate-spin rounded-full border-gray-200 
                            border-t-indigo-600`}
                role="status" 
                aria-label='Loading'>
            </div>
        </div>
    )
}