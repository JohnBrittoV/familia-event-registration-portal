import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff, Lock, Menu, Moon, Sun, User, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/logo.png';

const navItems = [
    ['Home', '#home'],
    ['About', '#about'],
    ['Gallery', '#gallery'],
    ['Highlights', '#highlights'],
    ['Prayer', '#prayer'],
];

export const Header = () => {
    const { isDark, toggleTheme } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isOtpModalOpen, setIsOTPModalOpen] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const ADMIN_SECRET = import.meta.env.VITE_ADMIN_OTP || '1235';

    useEffect(() => {
        document.body.style.overflow = isOtpModalOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOtpModalOpen]);

    const handleInitialLoginClick = () => {
        const isDeviceVerified = localStorage.getItem('familia_device_verified');

        if (isDeviceVerified === 'true') {
            login();
        } else {
            setIsOTPModalOpen(true);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setOtpError('');

        if (otpCode === ADMIN_SECRET) {
            try {
                localStorage.setItem('familia_device_verified', 'true');
                await login();
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
        <>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 text-white shadow-lg backdrop-blur-xl">
                <div className="page-container">
                    <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
                        <a href="#home" className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1 shadow-sm sm:h-10 sm:w-10">
                                <img src={logo} alt="Jesus Youth Logo" className="h-full w-full object-contain" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-black tracking-tight sm:text-base">Mananthavady <span className="text-amber-300">Family</span></p>
                            </div>
                        </a>

                        <nav className="hidden items-center gap-6 lg:flex">
                            {navItems.map(([label, href]) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="text-sm font-semibold text-slate-300 transition hover:text-white"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button
                                type="button"
                                onClick={handleInitialLoginClick}
                                className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 sm:inline-flex"
                            >
                                <User size={17} />
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={() => setMenuOpen((value) => !value)}
                                aria-label="Toggle navigation"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 lg:hidden"
                            >
                                {menuOpen ? <X size={19} /> : <Menu size={19} />}
                            </button>
                        </div>
                    </div>

                    {menuOpen && (
                        <nav className="border-t border-white/10 py-4 lg:hidden">
                            <div className="grid gap-1">
                                {navItems.map(([label, href]) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
                                    >
                                        {label}
                                    </a>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleInitialLoginClick}
                                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950"
                                >
                                    <User size={17} />
                                    Login
                                </button>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {isOtpModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[999] flex min-h-screen items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md">
                        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOTPModalOpen(false);
                                    setOtpError('');
                                    setOtpCode('');
                                }}
                                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                                aria-label="Close"
                            >
                                <X size={19} />
                            </button>

                            <div className="mb-6 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-[#D9B83F] dark:bg-amber-950/50 dark:text-amber-300">
                                    <Lock size={24} />
                                </div>
                                <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">Admin Access Only</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Enter the secret access code to sign in.
                                </p>
                            </div>

                            <form onSubmit={handleOtpSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        placeholder="Enter Secret Code..."
                                        disabled={isLoading}
                                        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 pr-11 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#D9B83F]/30 dark:bg-slate-950 dark:text-white ${
                                            otpError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        disabled={isLoading}
                                        aria-label={showPassword ? 'Hide access code' : 'Show access code'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    {otpError && <p className="mt-2 text-xs font-medium text-red-500">{otpError}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-2xl bg-[#D9B83F] py-3 font-bold text-white transition hover:bg-[#B99722] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                                </button>

                                <p className="text-center text-[10px] text-slate-400">
                                    *Code is shared only with authorized staff members.
                                </p>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};
