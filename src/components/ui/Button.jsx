import React from "react";
import { Spinner} from './Spinner';

export const Button = ({children, onClick, variant = 'primary', 
                        isLoading = false, icon: Icon, type = 'button',
                        disabled = false, className = '' }) => {
    
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-95 disabled:opacity-60 disabled:pointer-events-none';
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white py-3 px-8',
        secondary: 'bg-blue-300 hover:bg-blue-500 text-white py-3 px-8',
        iconOnly: 'p-2 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 shadow-none'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            aria-busy={isLoading}>
            
            {isLoading ? (
                <>
                    <Spinner size="sm" centered={false}/>
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {children}
                    {Icon && <Icon size={18} aria-hidden='true' className="transition-transform group-hover:translate-x-1"/>}
                </>
            )}
            
        </button>
    );
};