import React from 'react';
import { Moon, Sun, User, Church } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';


export const Header = () => {
    
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className='sticky top-0 z-50 w-full bg-white/95 
                          dark:bg-slate-900/95 backdrop-blur-sm 
                          border-b border-slate-200 
                          dark:border-slate-700'>

            <div className='page-container'>

                <div className='flex items-center 
                                justify-between h-16 
                                sm:h-20'>

                    <div className='flex items-center 
                                    gap-2 sm:gap-3'>
                    {/* Logo section */}

                        <div className='flex items-center justify-center 
                                        w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                                        bg-amber-100 dark:bg-amber-900/30'>

                            <Church className="w-5 h-5 sm:w-6 sm:h-6 
                                               text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                        </div>

                        <span className="text-lg sm:text-2xl 
                                         font-bold text-slate-900 
                                         dark:text-white tracking-tight">

                            FAMILIA <span className="text-amber-600 
                                                     dark:text-amber-400">26</span>
                        </span>

                    </div>
                
                    {/* Right section */}

                    <div className='flex items-center 
                                    gap-2 sm:gap-3'>
                        
                        <Button className="w-8 h-8 sm:w-10 sm:h-10 
                                           rounded-full hover:bg-slate-100 
                                           dark:hover:bg-slate-800 transition-colors"

                                variant='iconOnly' 
                                onClick={toggleTheme}
                                aria-label="Toggle theme">

                            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5"/> 
                                    : <Moon className="w-4 h-4 sm:w-5 sm:h-5"/>}

                        </Button>

                        <Button className="w-8 h-8 sm:w-auto sm:h-10 
                                           sm:px-4 rounded-full hover:bg-slate-100 
                                           dark:hover:bg-slate-800 transition-colors"

                                variant='iconOnly'>

                            <User className="w-4 h-4 sm:w-5 
                                             sm:h-5" strokeWidth={2}/>

                            <span className="hidden sm:inline text-sm 
                                             font-medium text-slate-700 
                                             dark:text-slate-300 ml-1.5"
                                             
                                            >Staff Login</span>
                        </Button>

                    </div>

                </div>

            </div>

        </header>
    )
}