import React from 'react';
import { usePrayerConfig } from '../hooks/usePrayerConfig';
import { usePrayerBooking } from '../hooks/usePrayerBooking';
import { Button } from '../../../components/ui/Button';
import { Lock, Church, Flame, XCircle, CheckCircle2 } from 'lucide-react';

export const PrayerBookingForm = ({ currentUser }) => {
    const { isBookingOpen, isLoadingConfig } = usePrayerConfig();
    const { 
        today, MAX_DATE,
        selectedDate, setSelectedDate, 
        customName, setCustomName,
        selectedPrayers, bookedPrayersForDate, togglePrayer, 
        isSubmitting, modalConfig, closeModal, handleBookPrayer
  } = usePrayerBooking(currentUser.mobile, currentUser.name);

  // If the admin has toggled bookings off
  if (!isLoadingConfig && !isBookingOpen) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 
                      rounded-2xl shadow-sm border 
                      border-slate-100 dark:border-slate-700 
                      text-center transition-colors duration-200">

        <div className="flex justify-center mb-4">
          <Lock className="w-12 h-12 text-slate-400 
                           dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 
                     dark:text-white mb-2">Prayer Collections Currently Closed</h3>

        <p className="text-slate-500 dark:text-slate-400">
          We are not currently accepting Holy mass, fasting prayer collections. Please check back later!
        </p>

      </div>
    );
  }

  const isHolyMassBooked = bookedPrayersForDate.includes('holy_mass');
  const isFastingBooked = bookedPrayersForDate.includes('fasting');

  return (
    <div className="relative bg-white dark:bg-slate-800 p-6 
                    sm:p-8 rounded-2xl shadow-sm border 
                    border-slate-100 dark:border-slate-700 
                    transition-colors duration-200">
      
      {/* Modal Overlay */}
      {modalConfig.isOpen && (
        <div className="absolute inset-0 z-50 flex items-center 
                        justify-center p-4 bg-slate-900/40 
                        dark:bg-slate-900/60 backdrop-blur-sm 
                        rounded-2xl">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl 
                          shadow-xl max-w-sm w-full border border-slate-100 
                          dark:border-slate-700 text-center 
                          animate-in fade-in zoom-in duration-200">

            <div className="flex justify-center mb-4">
              {modalConfig.type === 'success' ? (
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>

            <h3 className={`text-xl font-bold mb-2 ${modalConfig.type === 'success' ? 'text-slate-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
              {modalConfig.type === 'success' ? 'Success!' : 'Action Required'}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 
                          mb-6 leading-relaxed">
              {modalConfig.message}
            </p>

            <Button onClick={closeModal} className="w-full rounded-xl">
              {modalConfig.type === 'success' ? 'Continue' : 'Try Again'}
            </Button>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 
                       dark:text-white">Prayer Booking</h2>
        <p className="text-sm text-slate-500 
                      dark:text-slate-400 mt-1">Select a date and commit to your prayers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Details & Date */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold 
                           text-slate-800 dark:text-slate-200 
                           mb-3">Dedication Name</h3>

            <div className="space-y-3">
              <input 
                type="text" 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter name"
                className="w-full bg-white dark:bg-slate-900 
                           border-2 border-slate-200 dark:border-slate-700 
                           text-slate-900 dark:text-white rounded-xl 
                           px-4 py-3 focus:outline-none focus:ring-2 
                           focus:ring-blue-600 transition-colors"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
                You can edit this name to dedicate the prayer for a family member or friend.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 
                           dark:text-slate-200 mb-3">Choose a Date</h3>
            <input 
              type="date" 
              value={selectedDate}
              min={today}
              max={MAX_DATE}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 
                         border-2 border-slate-200 dark:border-slate-700 
                         text-slate-900 dark:text-white rounded-xl px-4 
                         py-3 focus:outline-none focus:ring-2 
                         focus:ring-blue-600 transition-colors"
            />
          </div>
        </div>

        {/* Right Column: Prayer Selection */}
        <div>
          <h3 className="text-lg font-semibold 
                         text-slate-800 dark:text-slate-200 
                         mb-3">Select Your Prayer</h3>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Holy Mass Card */}
            <button 
              onClick={() => togglePrayer('holy_mass')}
              disabled={isHolyMassBooked}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-200 
                ${isHolyMassBooked 
                  ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed text-slate-500' 
                  : selectedPrayers.includes('holy_mass') 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-600 dark:text-slate-300'
                }`}
            >
              <div className="flex justify-center mb-2">
                <Church className="w-8 h-8" />
              </div>
              <div className="font-semibold">Holy Mass</div>
              <div className={`text-xs mt-1 font-medium ${isHolyMassBooked ? 'text-red-500 dark:text-red-400' : 'opacity-70'}`}>
                {isHolyMassBooked ? '(Not available)' : selectedPrayers.includes('holy_mass') ? '(Selected)' : '(Available)'}
              </div>
            </button>

            {/* Fasting Prayer Card */}
            <button 
              onClick={() => togglePrayer('fasting')}
              disabled={isFastingBooked}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-200 
                ${isFastingBooked 
                  ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed text-slate-500' 
                  : selectedPrayers.includes('fasting') 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-600 dark:text-slate-300'
                }`}
            >
              <div className="flex justify-center mb-2">
                <Flame className="w-8 h-8" />
              </div>
              <div className="font-semibold">Fasting Prayer</div>
              <div className={`text-xs mt-1 font-medium ${isFastingBooked ? 'text-red-500 dark:text-red-400' : 'opacity-70'}`}>
                {isFastingBooked ? '(Not available)' : selectedPrayers.includes('fasting') ? '(Selected)' : '(Available)'}
              </div>
            </button>

          </div>

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors duration-200">
             <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
                your prayer details:<br/>
                <span className="font-semibold text-slate-900 dark:text-white truncate block mt-1">{customName || '...'}</span> 
                <span className="font-semibold text-slate-900 dark:text-white block">{selectedDate}</span>
             </div>
          </div>

          <Button 
            onClick={handleBookPrayer}
            isLoading={isSubmitting}
            className="w-full mt-4 rounded-xl py-4"
          >
            MARK PRAYERS
          </Button>

        </div>
      </div>
    </div>

  );

}