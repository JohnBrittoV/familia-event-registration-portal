import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Greeting } from "../components/features/Greeting";
import { MessageSquare, Mail, Phone, Send, CheckCircle2 } from "lucide-react";

export const RPTechSupport = () => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    // Form submission handler
    const handleSubmitTicket = (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setIsSubmitting(true);
        setSubmittedSuccess(false);

        // Simulate sending ticket to backend/Firebase
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmittedSuccess(true);
            setSubject('');
            setMessage('');

            // Hide success notification after 5 seconds
            setTimeout(() => setSubmittedSuccess(false), 5000);
        }, 1200);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            
            <Greeting 
                name={user?.displayName} 
                role="Help & Support" 
                subtitle="Need assistance with a registration or encountering a technical issue? We're here to help." 
            />

            {/* Success Banner */}
            {submittedSuccess && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/35 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl animate-in fade-in duration-200">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <p className="text-sm font-medium">Your support ticket has been sent successfully! Our admin team will get back to you shortly.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Direct Contact Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Direct Contact</h3>
                        
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Email Support</p>
                                    <a href="mailto:support@familia26.com" 
                                    className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block break-all mt-0.5">
                                        johnbritto95@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Phone & WhatsApp</p>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 break-words">
                                        +91 97442 85166
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Support Ticket Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                        
                        <div className="flex items-center gap-3 mb-6">
                            <MessageSquare className="text-blue-600 dark:text-blue-400" size={24} />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send us a message</h2>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmitTicket}>
                            
                            {/* Subject Input */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Subject
                                </label>
                                <input 
                                    type="text" 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g., Payment issue, Registration change request"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all text-sm"
                                />
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Message
                                </label>
                                <textarea 
                                    rows="5"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Please describe your issue in detail..."
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all resize-none text-sm"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 text-sm"
                                >
                                    <Send size={16} />
                                    <span>{isSubmitting ? 'Sending...' : 'Submit Request'}</span>
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};