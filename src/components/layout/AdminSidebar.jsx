import React from "react";
import { LayoutDashboard, Users, FileText, LogOut, X } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/icons/blue.png';

export const AdminSidebar = ({ isOpen, setIsOpen }) => {

    const { logout, user } = useAuth();

    return (
        <>
            {/* Mobile overlay background */}
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 
                                z-40 md:hidden"
                     onClick={() => setIsOpen(false)}/>

            )}

            {/* Sidebar itself */}
            <aside className={`
                   fixed md:static inset-y-0 left-0 z-50
                   w-64 bg-white dark:bg-slate-800 border-r 
                   border-slate-200 dark:border-slate-700 
                   flex flex-col h-screen transition-transform 
                   duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}  
            `}>

                <div className="p-6 flex items-center justify-between 
                                border-b border-slate-200 dark:border-slate-700">

                    <div className="flex items-center gap-3">
                        
                        <img src={logo} alt="Logo" 
                             className="w-8 h-8 object-contain shrink-0" />

                        <span className="font-bold text-lg 
                                         text-slate-900 dark:text-white">
                                Admin Panel</span>
                    </div>

                    {/* Mobile close button */}
                    <button onClick={() => setIsOpen(false)} 
                            className="md:hidden text-slate-500 
                                       hover:text-slate-700">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 flex 
                                flex-col gap-2">

                    <a href="#" className="flex items-center gap-3 
                                           px-4 py-3 bg-blue-50 dark:bg-blue-900/20 
                                           text-blue-700 dark:text-blue-400 
                                           rounded-xl font-medium">

                        <Users size={20} /> User Requests
                    </a>

                    <a href="#" className="flex items-center gap-3 px-4 
                                           py-3 text-slate-600 dark:text-slate-400 
                                           hover:bg-slate-50 dark:hover:bg-slate-800 
                                           rounded-xl font-medium transition-colors">

                        <LayoutDashboard size={20} /> Global Stats
                    </a>

                    <a href="#" className="flex items-center gap-3 px-4 py-3
                                           text-slate-600 dark:text-slate-400 
                                           hover:bg-slate-50 dark:hover:bg-slate-800 
                                           rounded-xl font-medium transition-colors">

                        <FileText size={20} /> Participants
                    </a>

                </nav>

                <div className="p-4 border-t border-slate-200 
                                dark:border-slate-700">

                    <div className="flex items-center gap-3 
                                    mb-4 px-2">

                        <div className="w-8 h-8 rounded-full bg-emerald-100 
                                        text-emerald-600 flex items-center 
                                        justify-center font-bold text-sm">
                            A
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            
                            <span className="text-sm font-bold text-slate-900 
                                             dark:text-white truncate">
                                                {user?.displayName}</span>

                            <span className="text-xs text-slate-500 
                                             truncate">Administrator</span>
                        </div>

                    </div>

                    <button onClick={logout} 
                            className="flex items-center gap-3 
                                       w-full px-4 py-2 text-slate-600 
                                       dark:text-slate-400 hover:text-red-600 
                                       dark:hover:text-red-400 transition-colors 
                                       font-medium text-sm">

                        <LogOut size={18} /> Sign Out

                    </button>
                    
                </div>

            </aside>
        </>
    )
}