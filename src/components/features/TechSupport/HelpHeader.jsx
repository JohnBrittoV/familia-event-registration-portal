import React from 'react';
import { HelpCircle, Globe } from 'lucide-react';

export const HelpHeader = ({ language, setLanguage }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-7 h-7 text-blue-600 font-malayalam" />
                    {language === 'ml' ? 'സഹായ കേന്ദ്രം (Help & Support)' : 'Help & Support Center'}
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-malayalam">
                    {language === 'ml' ? 'ആവശ്യമായ നിർദ്ദേശങ്ങളും സഹായങ്ങളും ഇവിടെ കണ്ടെത്താം.' : 'Find answers, video tutorials, or reach out to administrators for assistance.'}
                </p>
            </div>

            {/* Language Switcher */}
            <button 
                onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors self-start">
                <Globe size={16} className="text-blue-600" />
                {language === 'en' ? 'മലയാളത്തിലേക്ക് മാറ്റുക (Malayalam)' : 'Switch to English'}
            </button>
        </div>
    );
};