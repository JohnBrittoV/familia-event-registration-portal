// components/sections/Footer.jsx
import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';

export const Footer = () => (
    <footer className="border-t border-slate-200 bg-white/70 py-8 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="page-container flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
            <p className="flex items-center gap-1.5">
                Made with
                <Heart size={14} className="fill-red-500 text-red-500" />
                by
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                    techies Inside
                </span>
            </p>

            <p>&copy; 2026 FAMILIA26. All rights reserved.</p>

            <a
                href="#home"
                className="inline-flex items-center gap-2 font-semibold text-[#D9B83F] hover:underline"
            >
                Back to top
                <ArrowUp size={14} />
            </a>
        </div>
    </footer>
);
