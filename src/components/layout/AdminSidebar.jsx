import React, { useState, useRef, useEffect} from "react";
import { useAuth } from '../../context/AuthContext';
import { Spinner } from "../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Cross, FileUser,
         LogOut, X, ChartLine,  HandHelping,  Download} from "lucide-react";
import logo from '../../assets/icons/blue.png';

export const AdminSidebar = ({ isOpen, setIsOpen }) => {

    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { pathname } = useLocation();
    const isActive = (path => pathname === path);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleLogout = () => {
        setIsLoggingOut(true);
        timeoutRef.current = setTimeout(() => {
            logout();
            navigate('/');
        }, 1500);
    }

    return (
        <>
            {isLoggingOut && (
                <div className="fixed inset-0 z-60 flex min-h-screen 
                                items-center justify-center bg-white/90 
                                dark:bg-slate-900/90 backdrop-blur-sm 
                                transition-opacity">

                    <Spinner size="lg" centered={true} />
                </div>
            )}

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

                    {/* Dashboard */}
                    <Link 
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            isActive('/admin') 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}>
                            
                        <LayoutDashboard size={20} /> Dashboard 
                    </Link>

                    {/* Responsible persons */}
                    <Link 
                        to="/admin/responsible-persons"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            isActive('/admin/responsible-persons') 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <FileUser size={20} /> Responsible Persons
                    </Link>
                    
                    {/* Prayer Partners */}
                    <Link 
                        to="/admin/prayer-partners"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            isActive('/admin/prayer-partners') 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Cross size={20} /> Prayer Partners
                    </Link>
                    
                    {/* Participants List */}
                    <Link 
                        to="/admin/participants"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            isActive('/admin/participants') 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Users size={20} /> Participants List
                    </Link>
                    
                    {/* Statistics */}
                    <Link 
                        to="/admin/stats"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            isActive('/admin/stats') 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <ChartLine size={20} /> Global Statistics
                    </Link>

                    {/* Prayer offerings */}
                    <Link 
                        to="/admin/prayer-bookings"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            isActive('/admin/prayer-bookings') 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <HandHelping size={20} /> Prayer Offerings
                    </Link>

                    <Link 
                        to="/admin/export"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                            isActive('/admin/export') 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Download size={20} /> Export Data
                    </Link>

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

                    <button onClick={handleLogout} 
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