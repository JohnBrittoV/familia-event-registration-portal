import React from 'react';
import { usePrayerConfig } from '../hooks/usePrayerConfig';

export const PrayerAdminPage = () => {
    const { isBookingOpen, toggleBooking, isLoadingConfig } = usePrayerConfig();

    return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 
                       dark:text-white">Prayer Admin Controls</h1>
        
        {/* Admin Toggle Switch */}
        <div className="flex items-center gap-4 
                        bg-white dark:bg-slate-800 
                        p-4 rounded-xl shadow-sm border 
                        border-slate-200 dark:border-slate-700">

          <span className="font-semibold text-slate-700 
                           dark:text-slate-300">
            Prayer Bookings:
          </span>

          <button
            disabled={isLoadingConfig}
            onClick={() => toggleBooking(!isBookingOpen)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isBookingOpen ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                isBookingOpen ? 'translate-x-8' : 'translate-x-1'
              }`}
            />

          </button>
          
          <span className={`text-sm font-medium ${isBookingOpen ? 'text-green-600' : 'text-red-500'}`}>
            {isBookingOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>

      {/* Rest of your Admin Page content goes here */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500">Admin monitoring tools coming next...</p>
      </div>
    </div>
  );
}