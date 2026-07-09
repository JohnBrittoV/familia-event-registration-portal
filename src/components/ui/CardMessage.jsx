import React from "react";
import { CheckIcon, X,  Info} from "lucide-react";

export const CardMessage = ({ type = 'info', message, onDismiss }) => {

    const iconProps = { className: 'w-5 h-5'};

    const styles = {
        success: {
            bg: 'bg-green-50 border-green-400',
            text: 'text-green-800',
            icon: <CheckIcon {...iconProps}/>,
        },

        error: {
            bg: 'bg-red-50 border-red-400',
            text: 'text-red-800',
            icon: <X {...iconProps}/>
        },

        info: {
            bg: 'bg-blue-50 border-blue-400',
            text: 'text-blue-800',
            icon: <Info {...iconProps}/>,
        },

    };

    const current = styles[type] || styles.info;

    return (
        <div
        className={`flex items-center justify-between 
                    p-4 border rounded-lg shadow-sm ${current.bg} ${current.text} 
                    max-w-lg mx-auto my-2 transition-all duration-300`}

        role="alert"
        >

        <div className="flex items-center gap-3">
            <span className="text-xl">{current.icon}</span>
            <p className="text-sm font-medium">{message}</p>
        </div>

        {onDismiss && (
            <button
            onClick={onDismiss}
            className="ml-4 text-current opacity-70 hover:opacity-100 focus:outline-none"
            aria-label="Close"
            >
            x
            </button>
        )}
        </div>
    );
};


