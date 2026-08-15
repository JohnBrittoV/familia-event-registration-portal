import React, { useState, useRef, useEffect} from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, X} from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { Spinner } from "../ui/Spinner";
import { navItems, adminNavigation } from "../../config/navigationConfig";
import logo from '../../assets/icons/logo.png';

export const Sidebar = ({ isOpen, setIsOpen }) => {

    const { logout, user, dbUser } = useAuth();
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { pathname } = useLocation();
    
    const currentRole = dbUser?.role || '';
    const isAdminOrOwner = currentRole === 'admin' || currentRole === 'owner';

    // Filter tabs based on the user's role 
    const visibleRPNavItems = navItems.filter(items => items.allowedRoles.includes(currentRole));

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
    };

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

            <aside className={`fixed md:static inset-y-0 left-0 
                               z-50 w-64 bg-white dark:bg-slate-800 
                               border-r border-slate-200 dark:border-slate-700 
                               flex flex-col h-screen transition-transform 
                               duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                
                <div className="p-6 flex items-center justify-between 
                                border-b border-slate-200 dark:border-slate-700">

                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-11 h-11 object-contain shrink-0" />
                        <span className="font-bold text-lg text-slate-900 
                                         dark:text-white">Familia'26</span>
                    </div>

                    <button onClick={() => setIsOpen(false)} 
                            className="md:hidden text-slate-500 
                                     hover:text-slate-700">
                        <X size={24} />
                    </button>

                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    {isAdminOrOwner ? (
                        /* --- ADMIN MENU WITH CATEGORIES --- */
                        adminNavigation.map((group, index) => (
                            <div key={index} className="mb-4">
                                {/* Category Heading */}
                                <h3 className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2 uppercase">
                                    {group.category}
                                </h3>
                                
                                {/* Category Items */}
                                <div className="flex flex-col gap-1">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.path;
                                        
                                        return (
                                            <Link 
                                                key={item.id}
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                                                    isActive 
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                <Icon size={20} /> {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        /* --- RESPONSIBLE PERSONS MENU (FLAT LIST, UNCHANGED) --- */
                        visibleRPNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            
                            return (
                                <Link 
                                    key={item.id}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                                        isActive 
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Icon size={20} /> {item.label}
                                </Link>
                            );
                        })
                    )}
                </nav>

                <div className="p-4 border-t border-slate-200 
                               dark:border-slate-700">

                    <div className="flex items-center gap-3 
                                    mb-4 px-2">

                        <div className="w-8 h-8 rounded-full bg-emerald-100 
                                        text-emerald-600 flex items-center 
                                        justify-center font-bold text-sm
                                        overflow-hidden shrink-0
                                        ring-2 ring-emerald-500 ring-offset-2 
                                        ring-offset-white dark:ring-offset-slate-800">

                            {user?.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt={user?.displayName || "Profile"} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'
                            )}
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-900 
                                             dark:text-white truncate">

                                {user?.displayName || 'Admin User'}
                            </span>

                            <span className="text-xs text-slate-500 truncate capitalize">
                                {currentRole.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleLogout} 
                            className="flex items-center gap-3 dark:text-slate-400 
                                       w-full px-4 py-2 text-slate-600  
                                       hover:text-red-600 dark:hover:text-red-400 
                                       transition-colors font-medium text-sm">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>
           
        </>
    )
}