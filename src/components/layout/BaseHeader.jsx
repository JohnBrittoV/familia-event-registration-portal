import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import logo from '../../assets/icons/blue.png';

export const BaseHeader = ({ user, onLogout, isLoggingOut, roleText, hideUserProfile = false }) => {
    return (
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
            <div className='flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                
                {/* Left Branding - Always visible */}
                <div className='flex items-center gap-3'>
                    <img src={logo} alt="Jesus Youth Logo" className="w-8 h-8 object-contain shrink-0" />
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 hidden sm:block">
                        Familia'26
                    </span>
                </div>

                {/* Right: User Profile & Actions */}
                {!hideUserProfile && user ? (
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-700'>
                            {user?.photoURL ? (
                               <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600" /> 
                            ) : (
                                <div className='w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold'>
                                    {user?.displayName?.charAt(0) || 'JY'}
                                </div>
                            )}
                            <div className='hidden md:flex md:flex-col justify-start'>
                                <span className="text-sm font-bold text-slate-900 mx-2 dark:text-slate-100 leading-tight">
                                    {user?.displayName}
                                </span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {roleText || 'Responsible Person'}
                                </span>
                            </div>
                        </div>
                        <Button variant="iconOnly" onClick={onLogout} aria-label="Sign out">
                            <LogOut size={18} className="text-slate-600 dark:text-slate-300" />
                        </Button>
                    </div>
                ) : (
                    /* Empty div when hideUserProfile is true (Public page) */
                    <div></div>
                )}
            </div>
        </header>
    );
};