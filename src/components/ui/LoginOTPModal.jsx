import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Shield } from 'lucide-react';
import { Button } from './Button';

// You can change this to any secret number your admins know.
const ADMIN_SECRET = "JYFAM1985"; 

export const LoginOTPModal = ({ isOpen, onClose, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    // Auto-focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleVerify = async () => {
        setError('');
        
        if (!otp.trim()) {
            setError('Please enter the secret code.');
            return;
        }

        setIsLoading(true);

        // Simulate slight delay for realism
        await new Promise(r => setTimeout(r, 800));

        if (otp === ADMIN_SECRET) {
            setIsLoading(false);
            setOtp('');
            onSuccess(); // This will trigger the actual login/navigation
        } else {
            setIsLoading(false);
            setError('Incorrect secret code. Access denied.');
            setOtp(''); // Clear the input so they re-try
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleVerify();
    };

    return (
        <div className="fixed inset-0 z-999 flex items-center 
                        justify-center bg-black/50 backdrop-blur-sm 
                        p-4 animate-in fade-in duration-200">
                            
            <div className="bg-white dark:bg-slate-900 
                            rounded-2xl shadow-2xl w-full 
                            max-w-sm overflow-hidden border 
                            border-slate-200 dark:border-slate-700 
                            animate-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between 
                                p-4 border-b border-slate-100 
                                dark:border-slate-800">

                    <div className="flex items-center gap-2 
                                    text-[#3B6AB0] dark:text-blue-400 
                                    font-bold text-lg">

                        <Shield size={20} />
                        <span>Admin Access</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 
                                   dark:hover:bg-slate-800 
                                   rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500 
                                                dark:text-slate-400" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-sm text-slate-600 
                                  dark:text-slate-400 mb-4">
                        Enter the secure pastoral passcode to unlock the staff registration area.
                    </p>

                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="password" // Hides the numbers for security/psychology
                                placeholder="Enter secret code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-3 rounded-xl border-2 
                                           border-slate-200 dark:border-slate-700 
                                           bg-slate-50 dark:bg-slate-800 
                                           focus:border-[#3B6AB0] focus:ring-2 
                                           focus:ring-[#3B6AB0]/20 outline-none 
                                           transition-all text-slate-900 
                                           dark:text-white placeholder:text-slate-400"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 
                                          dark:text-red-400 font-medium 
                                          animate-in slide-in-from-left-2 
                                          fade-in duration-150">
                                {error}
                            </p>
                        )}

                        <Button 
                            className="w-full bg-[#3B6AB0] dark:bg-blue-600 
                                       hover:bg-[#2E5591] dark:hover:bg-blue-700 
                                       text-white rounded-xl py-3 font-bold shadow-md 
                                       hover:shadow-lg transition-all duration-200 
                                       flex items-center justify-center gap-2"

                            isLoading={isLoading}
                            onClick={handleVerify}
                        >
                            Verify Access
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};