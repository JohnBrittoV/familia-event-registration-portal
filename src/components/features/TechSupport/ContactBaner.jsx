import React from 'react';
import { Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { cardThemes } from '../../../assets/styles/cardThemes';

export const ContactBanner = ({ language }) => {
    const adminEmail = "frominsides@gmail.com";
    const adminWhatsApp = "919744285166";
    const whatsAppMessage = encodeURIComponent("Hello Admin, I need assistance with the Familia'26 portal.");

    return (
        <div className={`p-6 rounded-2xl border border-slate-200/65 dark:border-slate-700/65 shadow-sm ${cardThemes.blue.card}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {language === 'ml' ? 'നേരിട്ട് ബന്ധപ്പെടുക' : 'Need Immediate Assistance?'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {language === 'ml' ? 'ആവശ്യഘട്ടങ്ങളിൽ ഞങ്ങളെ ഇമെയിൽ വഴിയോ വാട്‌സാപ്പ് വഴിയോ ബന്ധപ്പെടാവുന്നതാണ്.' : 'Reach out directly via email or WhatsApp for quick coordination and support.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Email Contact Button */}
                    <a 
                        href={`mailto:${adminEmail}?subject=${encodeURIComponent("Support Inquiry - Familia'26")}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Mail size={16} />
                        </div>
                        <span>{adminEmail}</span>
                    </a>

                    {/* WhatsApp Contact Button */}
                    <a 
                        href={`https://wa.me/${adminWhatsApp}?text=${whatsAppMessage}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">
                        <div className="p-1.5 bg-emerald-500/30 text-white rounded-lg">
                            <MessageSquare size={16} />
                        </div>
                        <span>{language === 'ml' ? 'വാട്‌സാപ്പ് ചാറ്റ്' : 'WhatsApp Chat'}</span>
                        <ExternalLink size={14} className="opacity-70" />
                    </a>
                </div>
            </div>
        </div>
    );
};