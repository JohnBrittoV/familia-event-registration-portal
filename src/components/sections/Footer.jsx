// components/sections/Footer.jsx
import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-slate-200 
                           dark:border-slate-700 mt-20 pt-8 
                           pb-8 text-center">

            <div className="page-container flex flex-col 
                            items-center gap-2 text-slate-500 
                            dark:text-slate-400 text-sm">

                <p className="flex items-center gap-1">
                    Made with 
                    <Heart size={14} 
                               className="text-red-500
                                           fill-red-500" /> by {""}

                    <span className="text-slate-700 dark:text-slate-300 
                                    font-medium">Jesus Youth Mananthavady</span>
                </p>
                <p>&copy; 2026 FAMILIA26. All rights reserved.</p>
            </div>
        </footer>
    );
};