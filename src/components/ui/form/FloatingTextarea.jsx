import React from 'react';
import { useFormContext } from 'react-hook-form';

export const FloatingTextarea = ({ name, label, rows = 3, ...props }) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name];

    return (
        <div className="relative mb-6">
            <textarea
                id={name}
                rows={rows}
                placeholder=" "
                className={`

                    peer block w-full appearance-none 
                    rounded-xl border-2 bg-transparent 
                    px-4 pb-2.5 pt-5 text-sm 
                    text-slate-900 focus:outline-none 
                    focus:ring-0 dark:text-white resize-none

                    ${error 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-600 dark:border-slate-700 dark:focus:border-blue-500'
                    }
                    transition-colors duration-200
                `}
                {...register(name)}
                {...props}
            ></textarea>
            
            <label
                htmlFor={name}
                className={`
                    absolute left-4 top-4 z-10 origin-left 
                    -translate-y-4 scale-75 transform cursor-text 
                    bg-white px-1 text-sm duration-300 
                    peer-placeholder-shown:translate-y-0 
                    peer-placeholder-shown:scale-100 
                    peer-focus:-translate-y-4 peer-focus:scale-75
                    dark:bg-slate-800

                    ${error 
                        ? 'text-red-500' 
                        : 'text-slate-500 peer-focus:text-blue-600 dark:text-slate-400 dark:peer-focus:text-blue-500'}
                `}
            >
                {label}
            </label>

            {error && (
                <p className="absolute -bottom-5 left-2 text-xs font-medium text-red-500">
                    {error.message}
                </p>
            )}
        </div>
    );
};