import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import notFoundImg from '../../assets/icons/not-found.svg';

export const NotFound = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-md w-full text-center py-12 px-4 sm:px-8">
        
        {/* Illustration Container */}
        <div className="mb-6 flex justify-center">
          <img
            src={notFoundImg}
            alt="Page Not Found Illustration"
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-sm"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          No Results Found
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved. Please check the URL or head back home.
        </p>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-sm transition-colors duration-150"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}