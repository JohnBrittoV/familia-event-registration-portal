import React from 'react';
import { PlaySquare } from 'lucide-react';
import { cardThemes } from '../../../assets/styles/cardThemes'; // Adjust path to your cardThemes.js

export const VideoTutorials = ({ language }) => {
    const tutorials = [
        {
            title: { en: "How to Register a New Family", ml: "ഒരു പുതിയ കുടുംബം എങ്ങനെ രജിസ്റ്റർ ചെയ്യാം" },
            duration: "3:45 mins",
            youtubeId: "",
            theme: cardThemes.purple
        },
        {
            title: { en: "Managing Profiles & Advance Payments", ml: "പ്രൊഫൈലുകളും അഡ്വാൻസ് പേയ്മെന്റുകളും കൈകാര്യം ചെയ്യൽ" },
            duration: "5:12 mins",
            youtubeId: "",
            theme: cardThemes.blue
        }
    ];

    return (
        <div className={`p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm ${cardThemes.indigo.card}`}>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <PlaySquare className="w-5 h-5 text-purple-600" />
                {language === 'ml' ? 'വീഡിയോ ഗൈഡുകൾ (Video Tutorials)' : 'Video Tutorials'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                    <div key={index} className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-4 flex flex-col justify-between ${tutorial.theme.card}`}>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${tutorial.theme.icon}`}>
                                    Tutorial
                                </span>
                                <span className="text-xs text-slate-400">{tutorial.duration}</span>
                            </div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
                                {tutorial.title[language]}
                            </h3>
                        </div>
                        <a 
                            href={`https://www.youtube.com/watch?v=${tutorial.youtubeId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors">
                            <PlaySquare size={14} /> {language === 'ml' ? 'വീഡിയോ കാണുക' : 'Watch Tutorial'}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};