import React from 'react';
import { usePrayerCounter } from '../hooks/usePrayerCounter';
import { Button } from '../../../components/ui/Button';
import { HeartPlusIcon, Heart, Cross } from 'lucide-react';


export const HailMaryCounter = ({ userMobile }) => {
  const { 
    currentCount, 
    target, 
    progressPercentage, 
    isSubmitting, 
    showAnimation, 
    handlePrayNow 
  } = usePrayerCounter(userMobile, 50000);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl 
                    shadow-sm border border-slate-100 dark:border-slate-700 
                    max-w-lg mx-auto relative">
      
      {/* Floating Feedback Animation */}
      {showAnimation && (
        <div className="absolute inset-0 pointer-events-none 
                        flex items-center justify-center z-10">

          <span className="text-4xl animate-bounce transition-opacity 
                           duration-500 opacity-100">
              ❤️👏
          </span>
        </div>
      )}

      {/* Header & Malayalam Text */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 
                       dark:text-white mb-4 flex items-center 
                       justify-center gap-2">

          <span><Cross/></span> Pray for Familia'26  <span><Cross/></span>
        </h3>
        <div className="bg-slate-50 dark:bg-slate-900/50 
                        rounded-xl p-4 border border-slate-100 
                        dark:border-slate-700">

          <p className="text-sm text-slate-600 
                        dark:text-slate-400 mb-4 
                        leading-relaxed">
            ഫാമിലിയ 26 - പ്രോഗ്രാമിനെ സമർപ്പിച്ചു നമ്മുക്ക് പ്രാർത്ഥിക്കാം  
          </p>
          <p className="text-sm font-medium text-slate-800 
                      dark:text-slate-200">
            "നന്മനിറഞ്ഞ മറിയമേ, സ്വസ്തി. കര്‍ത്താവ് അങ്ങയോടുകൂടെ സ്ത്രീകളില്‍ അങ്ങ്  അനുഗ്രഹിക്കപ്പെട്ടവള്‍ ആകുന്നു അങ്ങയുടെ ഉദരത്തില്‍ ഫലമായ ഈശോ അനുഗ്രഹിക്കപ്പെട്ടവനാകുന്നു.
            പരിശുദ്ധ മറിയമേ, തമ്പുരാൻ്റെ അമ്മേ, പാപികളായ ഞങ്ങള്‍ക്കുവേണ്ടി ഇപ്പോഴും ഞങളുടെ മരണ സമയത്തും തമ്പുരാനോട് അപേക്ഷിക്കണമേ. ആമ്മേന്‍."
          </p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-center text-xs font-bold 
                        text-blue-600 dark:text-blue-400 
                        tracking-wider">
          HAIL MARY PRAYER PROGRESS
        </div>
        
        <div className="h-3 w-full bg-purple-100 
                        dark:bg-blue-600/30 rounded-full 
                        overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full 
                       transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center text-sm font-bold 
                        text-slate-800 dark:text-slate-200 
                        mt-2">
          {currentCount.toLocaleString()} / {target.toLocaleString()} prayers
        </div>
      </div>

      {/* Reused Button Component */}
      <Button 
        onClick={handlePrayNow}
        disabled={isSubmitting}
        className={`w-full py-4 text-lg rounded-xl 
                    transition-all duration-300 ${
          isSubmitting ? 'bg-green-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
        }`}
      >
        <HeartPlusIcon/> Pray Now
      </Button>
    </div>
  );
};