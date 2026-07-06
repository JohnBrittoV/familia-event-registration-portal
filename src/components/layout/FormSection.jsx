import React from "react";

export const FormSection = ({ title, description, children }) => {
    
    return(

        <div className="mb-5">
            
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            </div>

            <div className="space-y-0">
                {children}
            </div>
            
        </div>

    )
}