import React from 'react';
import { cardThemes } from '../../assets/styles/cardThemes';

    export const StatCard = ({ title, value, icon: Icon, trend, theme = 'blue'}) => {   
           const colors = cardThemes[theme] || cardThemes.blue;

        return(
            <div className={`${colors.card} group relative overflow-hidden
                              rounded-2xl border border-slate-200/70
                              dark:border-slate-700/70 p-5 sm:p-6 lg:p-7
                              transition-all duration-300 hover:-translate-y-2
                              hover:shadow-2xl ${colors.glow} `} >

                            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 dark:bg-white/4" />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {value}
                    </h2>

                    {trend && (
                        <p className="mt-2 text-sm text-emerald-600">
                            {trend}
                        </p>
                    )}
                </div>

                <div
                    className={`${colors.icon} rounded-2xl shadow-sm flex
                        items-center justify-center h-14 w-14 sm:h-16 sm:w-16
                        lg:h-14 lg:w-14 transition-all duration-300
                        group-hover:scale-110 group-hover:rotate-6`}
                >
                    {Icon && (
                        <Icon
                            className="h-7 w-7 sm:h-8 sm:w-8 lg:h-7 lg:w-7"/>
                    )}
                </div>
            </div>
        </div>

        )
    }