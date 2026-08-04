import React, { useState} from "react";
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cardThemes } from "../../../assets/styles/cardThemes";

export const HelpFAQ = ({ language }) => {
    const [openFaq, setOpenFaq] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState('all');

    const faqs = [
        {
            priority: "high",
            category: "Permissions & Edits",
            theme: cardThemes.blue,
            question: {
                en: "Why is a participant profile showing as 'Read-Only Mode'?",
                ml: "എന്തുകൊണ്ടാണ് ഒരു participant profile 'Read-Only Mode'-ൽ കാണിക്കുന്നത്?"
            },
            answer: {
                en: "Profiles can only be edited by the Responsible Person who originally registered them or by system administrators. If another user registered the family, you have view-only access to prevent accidental data overwrites.",
                ml: "ആദ്യം രജിസ്റ്റർ ചെയ്ത Responsible Person-നോ അഡ്മിനിസ്ട്രേറ്റർമാർക്കോ മാത്രമേ പ്രൊഫൈലുകൾ എഡിറ്റ് ചെയ്യാൻ കഴിയൂ."
            }
        },
        {
            priority: "high",
            category: "Data Updates",
            theme: cardThemes.blue,
            question: {
                en: "How do I update participant details after submission?",
                ml: "സബ്മിഷന് ശേഷം എങ്ങനെയാണ് participant വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യുന്നത്?"
            },
            answer: {
                en: "Go to 'My Submissions', locate the family record, and click on it to open the profile page. Make your changes and click 'Update Changes' at the bottom.",
                ml: "'My Submissions'-ൽ പോയി റെക്കോർഡ് തിരഞ്ഞെടുത്ത് പ്രൊഫൈൽ പേജ് തുറക്കുക. മാറ്റങ്ങൾ വരുത്തിയ ശേഷം 'Update Changes' ക്ലിക്ക് ചെയ്യുക."
            }
        },
        {
            priority: "general",
            category: "Formatting",
            theme: cardThemes.blue,
            question: {
                en: "Why are all text fields automatically converting to uppercase?",
                ml: "എന്തുകൊണ്ടാണ് എല്ലാ ടെക്സ്റ്റ് ഫീൽഡുകളും സ്വയം uppercase-ലേക്ക് മാറുന്നത്?"
            },
            answer: {
                en: "To maintain uniform database consistency across global directories and reports, the system automatically normalizes all text inputs into uppercase when saved.",
                ml: "ഡാറ്റാബേസ് സ്ഥിരത നിലനിർത്താൻ, സിസ്റ്റം എല്ലാ ടെക്സ്റ്റ് ഇൻപുട്ടുകളും സ്വയം uppercase ആക്കി മാറ്റുന്നു."
            }
        },
        {
            priority: "general",
            category: "Attendance",
            theme: cardThemes.sky,
            question: {
                en: "How are event attendance statistics calculated in real-time?",
                ml: "ഇവന്റ് ഹാജർ കണക്കുകൾ തത്സമയം എങ്ങനെയാണ് കണക്കാക്കുന്നത്?"
            },
            answer: {
                en: "The system calculates totals automatically based on active checkboxes for adults (self and spouse) and children marked as attending.",
                ml: "മുതിർന്നവരുടെയോ കുട്ടികളുടെയോ ആക്റ്റീവ് ചെക്ക്ബോക്സുകളെ അടിസ്ഥാനമാക്കി സിസ്റ്റം ഇത് തത്സമയം കണക്കാക്കുന്നു."
            }
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        if (priorityFilter === 'all') return true;
        return faq.priority === priorityFilter;
    });

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className={`rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden ${cardThemes.blue.card}`}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                    {language === 'ml' ? 'പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQs)' : 'Frequently Asked Questions'}
                </h2>
                
                {/* Priority Filter Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
                    <button 
                        onClick={() => setPriorityFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${priorityFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>
                        {language === 'ml' ? 'എല്ലാം' : 'All'}
                    </button>
                    <button 
                        onClick={() => setPriorityFilter('high')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${priorityFilter === 'high' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-sm' : 'text-slate-500'}`}>
                        <AlertCircle size={12} /> {language === 'ml' ? 'പ്രധാനം (High)' : 'High Priority'}
                    </button>
                    <button 
                        onClick={() => setPriorityFilter('general')}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${priorityFilter === 'general' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}>
                        {language === 'ml' ? 'പൊതുവായത്' : 'General'}
                    </button>
                </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredFaqs.map((faq, index) => (
                    <div key={index} className={`transition-colors ${faq.theme.card}`}>
                        <button 
                            onClick={() => toggleFaq(index)}
                            className="w-full p-5 flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                            <div className="flex items-center gap-3">
                                {faq.priority === 'high' && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="High Priority" />
                                )}
                                <span>{faq.question[language]}</span>
                            </div>
                            <ChevronDown size={18} className={`transform transition-transform duration-200 ${openFaq === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                        </button>
                        {openFaq === index && (
                            <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white/40 dark:bg-slate-900/20">
                                {faq.answer[language]}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};