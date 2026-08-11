import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { WORD_OF_GOD_VERSES } from '../data/wordOfGodData';

export const WordOfGodCard = ({ userName, language = 'ML' }) => {
    const [selectedVerse, setSelectedVerse] = useState(null);

    useEffect(() => {
        // Low-repetition verse selection algorithm based on local session cache
        const sessionKey = 'familia_viewed_verses';
        let viewedVerses = [];
        
        try {
            const cached = localStorage.getItem(sessionKey);
            viewedVerses = cached ? JSON.parse(cached) : [];
        } catch (e) {
            viewedVerses = [];
        }

        // Find verses that haven't been viewed yet
        let availableVerses = WORD_OF_GOD_VERSES.filter(v => !viewedVerses.includes(v.id));

        // If all verses have been seen, reset the tracking pool
        if (availableVerses.length === 0) {
            viewedVerses = [];
            availableVerses = WORD_OF_GOD_VERSES;
        }

        // Pick a random verse from the available pool
        const randomIndex = Math.floor(Math.random() * availableVerses.length);
        const chosen = availableVerses[randomIndex];

        setSelectedVerse(chosen);

        // Update storage pool
        try {
            localStorage.setItem(sessionKey, JSON.stringify([...viewedVerses, chosen.id]));
        } catch (e) {
            // handle storage error gracefully if disabled
        }
    }, []);

    if (!selectedVerse) return null;

    // Default to Malayalam ('ML'), switch to English ('EN') when specified
    const verseText = language === 'EN' ? selectedVerse.english : selectedVerse.malayalam;

    return (
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative z-10">
                    
                    <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-100 dark:text-blue-500 text-xs px-3 py-1 font-semibold uppercase tracking-wider mb-3 inline-block">
                        Intercession Portal
                    </span>

                    {/* Decorative ambient background spark */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-start gap-4">
                        
                        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-md shrink-0 mt-1">
                            <Sparkles size={20} />
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-bold font-malayalam uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                {language === 'EN' ? 'Word of God for You' : 'ഇന്നത്തെ തിരുവചനം'}
                            </span>
                            
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                Dear beloved {userName}, your God says to you this:
                            </h3>

                            <blockquote className="text-slate-700 dark:text-slate-300 text-base sm:text-lg font-medium font-malayalam pt-2 border-l-2 border-blue-500 pl-4 my-2">
                                "{verseText}"
                            </blockquote>
                        </div>

                    </div>

                </div>

            </div>

    );
};