import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react'
import { Spinner } from '../../ui/Spinner';
import { cardThemes } from '../../../assets/styles/cardThemes';
import { useAuth } from '../../../context/AuthContext';
import { createSupportTicket } from '../../../services/SupportService';

export const SupportTicketForm = ({ language }) => {
    const { user, dbUser } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ subject: '', message: '' });

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const ticketPayload = {
                subject: formData.subject,
                message: formData.message,
                userId: user?.uid || 'Anonymous',
                userEmail: user?.email || 'N/A',
                userName: dbUser?.fullName || user?.displayName || 'Responsible Person'
            };

            // 1. Save ticket to Firebase database using dedicated service
            await createSupportTicket(ticketPayload);

            setSubmitted(true);
            setFormData({ subject: '', message: '' });
        } catch (err) {
            console.error("Error handling support submission:", err);
            alert("Failed to submit support request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

return (
        <div className={`rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 ${cardThemes.teal.card}`}>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                {language === 'ml' ? 'ഒരു സഹായ അഭ്യർത്ഥന അയക്കുക' : 'Send a Support Request'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
                {language === 'ml' ? 'എന്തെങ്കിലും പ്രശ്നങ്ങളുണ്ടെങ്കിൽ ഇവിടെ രേഖപ്പെടുത്തുക.' : 'Encountered an issue or bug? Drop us a note and we will review it promptly.'}
            </p>

            {submitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <p>{language === 'ml' ? 'നിങ്ങളുടെ അഭ്യർത്ഥന വിജയകരമായി സമർപ്പിച്ചു!' : 'Your support ticket has been submitted successfully! We will get back to you soon.'}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                            {language === 'ml' ? 'വിഷയം (Subject)' : 'Subject'}
                        </label>
                        <input 
                            type="text"
                            required
                            placeholder={language === 'ml' ? 'ഉദാഹരണത്തിന്: പ്രൊഫൈൽ അപ്ഡേറ്റിൽ പ്രശ്നം' : 'e.g., Issue with updating family details'}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-sm shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                            {language === 'ml' ? 'വിവരണം (Message)' : 'Message Description'}
                        </label>
                        <textarea 
                            required
                            rows={4}
                            placeholder={language === 'ml' ? 'പ്രശ്നം വിശദമായി എഴുതുക...' : 'Describe what happened and any error messages you saw...'}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-sm shadow-sm"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 shadow-sm">
                        {submitting ? <Spinner size="sm" /> : <Send size={16} />} {language === 'ml' ? 'സമർപ്പിക്കുക' : 'Submit Request'}
                    </button>
                </form>
            )}
        </div>
    );
};