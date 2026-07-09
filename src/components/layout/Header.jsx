import React, { useState } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun, User, Church, X, Lock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/blue.png';

export const Header = () => {
    
    const { isDark, toggleTheme } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isOtpModalOpen, setIsOTPModalOpen] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const  [showPassword, setShowPassword] = useState(false);

    const ADMIN_SECRET = import.meta.env.VITE_ADMIN_OTP || "1235"; 

    useEffect(() => {
       if (isOtpModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }; 
    },[isOtpModalOpen]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setOtpError('');

        if (otpCode === ADMIN_SECRET) {
            try {
                await login();        // Triggers your existing Google Auth flow
                navigate('/dashboard'); // Navigates to dashboard
                setIsOTPModalOpen(false);
                setOtpCode('');
                setShowPassword(false);
            } catch (error) {
                console.error('Login failed:', error);
                setOtpError('Authentication failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setOtpError('Incorrect access code. Access Denied.');
            setIsLoading(false);
        }
    };

    return (
        <header className='sticky top-0 z-50 w-full bg-white/95
                           dark:bg-slate-900/95 backdrop-blur-sm 
                           border-b border-slate-200 dark:border-slate-700 shadow-sm'>

            <div className='page-container'>

                <div className='flex items-center justify-between h-14 sm:h-16 lg:h-20'>

                    {/* Logo section */}
                    <div className='flex items-center gap-2 sm:gap-3'>
                    
                        <div className='flex items-center justify-center p-1
                                        w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 
                                        rounded-lg bg-[#d3e1f6] dark:bg-blue-900 
                                        shadow-sm shrink-0 overflow-hidden'>

                            <img src={logo} 
                                 alt="Jesus Youth Logo" 
                                 className="w-full h-full object-contain"
                            />

                        </div>

                        <span className="text-sm sm:text-lg lg:text-2xl 
                                         font-bold tracking-tight 
                                         whitespace-nowrap">

                            <span className="text-slate-800 dark:text-white">Jesus Youth </span>
                            <span className="text-[#3B6AB0] dark:text-blue-400">Family Mananthavady</span>
                        </span>

                    </div>
                
                    {/* Right section */}

                    <div className='flex items-center gap-1.5 sm:gap-2 lg:gap-3'>
                        
                        <Button className=" w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 
                                            rounded-full hover:bg-slate-100 
                                            dark:hover:bg-slate-800 flex items-center 
                                            justify-center transition-colors duration-200"

                                variant='iconOnly' 
                                onClick={toggleTheme}
                                aria-label="Toggle theme">

                            {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 
                                                      lg:w-5 lg:h-5 text-slate-600 
                                                      dark:text-slate-300"/> 

                                    : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 
                                                       lg:w-5 lg:h-5 text-slate-600 
                                                       dark:text-slate-300"/>}

                        </Button>

                        <Button 
                                onClick={() => setIsOTPModalOpen(true)}
                                className="flex items-center gap-1.5 sm:gap-2 px-2 
                                           py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 
                                           rounded-full bg-white dark:bg-slate-800 
                                           border border-slate-200 dark:border-slate-700 
                                           hover:bg-slate-50 dark:hover:bg-slate-700 
                                           transition-colors duration-200 shadow-sm"

                                variant='iconOnly'>

                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 
                                             lg:h-5 text-slate-600 
                                             dark:text-slate-300" 
                                   strokeWidth={2}/>

                            <span className="hidden sm:inline text-[10px] sm:text-xs 
                                             lg:text-sm font-medium text-slate-700 
                                             dark:text-slate-300"
                                             
                                            >Login</span>
                        </Button>

                        {/* OTP MODAL - Available across all screen sizes */}
                        {isOtpModalOpen && createPortal(
                        <div className="fixed inset-0 z-999 flex min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity">
                            
                            {/* Your existing Modal Content Wrapper */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-100 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
                                
                                {/* Close Icon */}
                                <button 
                                    onClick={() => { setIsOTPModalOpen(false); setOtpError(''); setOtpCode(''); }}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#3B6AB0]/10 dark:bg-blue-500/20 mb-4">
                                        <Lock className="text-[#3B6AB0] dark:text-blue-400" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Access Only</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Enter the secret access code to sign in.
                                    </p>
                                </div>

                                <form onSubmit={handleOtpSubmit} className="space-y-4">
                                    <div className='relative'>
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            placeholder="Enter Secret Code..."
                                            className={`w-full px-4 py-3 pr-10 rounded-xl 
                                                        border bg-slate-50 dark:bg-slate-900 
                                                        focus:outline-none focus:ring-2 
                                                        focus:ring-[#3B6AB0] text-slate-900
                                                        dark:text-white placeholder:text-slate-400 
                                                        ${otpError ? 'border-red-500 dark:border-red-500 ring-red-500/20' : 'border-slate-200 dark:border-slate-700'}`}
                                            disabled={isLoading}
                                        />

                                        {/* Toggle Visibility Button */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 
                                                           text-slate-400 hover:text-slate-600 
                                                           dark:text-slate-500 dark:hover:text-slate-300 
                                                           transition-colors focus:outline-none"
                                                disabled={isLoading}
                                                tabIndex={-1} // Prevents keyboard focus order issues
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>

                                        {otpError && (
                                            <p className="text-red-500 text-xs 
                                                          font-medium mt-2 text-left">{otpError}</p>
                                        )}
                                    </div>
                                    
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-200 ${isLoading ? 'bg-[#3B6AB0]/70 cursor-not-allowed' : 'bg-[#3B6AB0] hover:bg-[#2E5591] shadow-md hover:shadow-lg'}`}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                                    </button>

                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
                                        *Code is shared only with authorized staff members.
                                    </p>
                                </form>
                            </div>

                        </div>,
                        document.body 
                    )}

                    </div>

                </div>

            </div>

        </header>
    )
}