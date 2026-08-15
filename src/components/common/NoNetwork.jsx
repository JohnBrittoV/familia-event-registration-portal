import React, { useState} from 'react';
import { useTheme } from '../../hooks/useTheme';

export const NoNetwork = ({ onRetry }) => {
    const { theme } = useTheme();

    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetryClick = async () => {
        setIsRetrying(true);
        
        // Give it a brief simulated check or call custom retry logic
        setTimeout(() => {
            if (onRetry) {
                onRetry();
            } else {
                window.location.reload();
            }
            setIsRetrying(false);
        }, 800);
    };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-md w-full text-center py-12 px-4 sm:px-8">
        
        {/* Network Error Icon / Illustration */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1-4.5a5 5 0 017.072 0m-7.072 0L3 3m18 18l-3.5-3.5" 
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          No Internet Connection
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Whoops, looks like you've lost your connection. Please check your network settings and try again.
        </p>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRetryClick}
            disabled={isRetrying}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-sm transition-colors duration-150 cursor-pointer"
          >
            {isRetrying ? 'Checking connection...' : 'Try Again'}
          </button>
        </div>

      </div>
    </div>
  );
}