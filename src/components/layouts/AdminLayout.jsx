import React from 'react';
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/icons/blue.png';

export const AdminLayout = ({ children }) => {

    const { logout, user } = useAuth();

    return(
        <div className='min-h-screen bg-slate-50 
                        dark:bg-slate-900 flex transition-colors 
                        duration-300'>

            {/* side bar */}
            <aside className="w-64 bg-white dark:bg-slate-800 
                              border-r border-slate-200 
                              dark:border-slate-700 hidden 
                              md:flex flex-col sticky top-0 
                              h-screen">
                
                <div className="p-6 flex items-center 
                                gap-3 border-b border-slate-200 
                                dark:border-slate-700">
                                    
                    <img src={logo} 
                         alt="Logo" 
                         className="w-8 h-8 object-contain 
                                    shrink-0" />

                    <span className="font-bold text-lg text-slate-900
                                     dark:text-white">Admin Central</span>
                </div>

                <nav className="flex-1 p-4 flex 
                                flex-col gap-2">
                                    
                    {/* Active Link Example */}

                    <a href="#" className="flex items-center gap-3 
                                           px-4 py-3 bg-blue-50 
                                           dark:bg-blue-900/20 text-blue-700 
                                           dark:text-blue-400 rounded-xl 
                                           font-medium">

                        <Users size={20} /> User Requests
                    </a>

                    <a href="#" className="flex items-center gap-3 
                                           px-4 py-3 text-slate-600 
                                           dark:text-slate-400 hover:bg-slate-50 
                                           dark:hover:bg-slate-800 rounded-xl 
                                           font-medium transition-colors">

                        <LayoutDashboard size={20} /> Global Stats
                    </a>

                    <a href="#" className="flex items-center gap-3 
                                           px-4 py-3 text-slate-600 
                                           dark:text-slate-400 hover:bg-slate-50 
                                           dark:hover:bg-slate-800 rounded-xl 
                                           font-medium transition-colors">

                        <FileText size={20} /> All Participants
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-200
                                dark:border-slate-700">

                    <div className="flex items-center 
                                    gap-3 mb-4 px-2">

                        <div className="w-8 h-8 rounded-full bg-emerald-100 
                                        text-emerald-600 flex items-center 
                                        justify-center font-bold text-sm">
                            A
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-900 
                                             dark:text-white truncate">{user?.displayName}</span>

                            <span className="text-xs text-slate-500 
                                             truncate">Administrator</span>

                        </div>
                    </div>

                    <button onClick={logout} 
                            className="flex items-center gap-3 w-full 
                                       px-4 py-2 text-slate-600 
                                       dark:text-slate-400 hover:text-red-600 
                                       dark:hover:text-red-400 transition-colors 
                                       font-medium text-sm">

                        <LogOut size={18} /> Sign Out
                    </button>

                </div>
            </aside>

            <main className='flex-1 overflow-y-auto'>
                {children}
            </main>
            
        </div>
    )
}