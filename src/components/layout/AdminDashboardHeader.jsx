import React from "react";
import { Menu } from 'lucide-react';

export const AdminHeader = ({ toggleSidebar }) => {
    return(

        <header className="bg-white dark:bg-slate-800 border-b 
                           border-slate-200 dark:border-slate-700 
                           h-16 flex items-center px-4 md:hidden sticky 
                           top-0 z-30">

            <button 
                onClick={toggleSidebar}
                className="p-2 -ml-2 mr-2 text-slate-600 
                           dark:text-slate-300 hover:bg-slate-100 
                           dark:hover:bg-slate-700 rounded-lg">

                <Menu size={24} />

            </button>

            <span className="font-bold text-lg text-slate-900 
                             dark:text-white">Admin Panel</span>
            
        </header>

    );
};


