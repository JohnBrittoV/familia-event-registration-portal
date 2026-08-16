import React from 'react';
import { ArrowRight, CalendarDays, HandHeart, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroImage from '../../assets/images/HeroImg.jpg';

export const WelcomeHero = () => {
    const navigate = useNavigate();

    return (
        <section id="home" className="relative overflow-hidden pt-10 sm:pt-16 lg:pt-20">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
                <div className="absolute right-[-6rem] top-10 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            <div className="page-container grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
                <div className="max-w-3xl">
                   

                    <h1 className="text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                        Familia&apos;26
                        <span className="block bg-gradient-to-r from-[#D9B83F] via-violet-500 to-violet-500 bg-clip-text text-transparent">
                            Family Retreat.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                        &quot;But seek first the kingdom of God and his righteousness, and all these things will be added to you.&quot;
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                        — Matthew 6:33
                    </p>

                    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-2">
                            <CalendarDays size={17} className="text-[#D9B83F]" />
                            August 26 - 29
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <MapPin size={17} className="text-[#D9B83F]" />
                            Pastoral Center Dwarka
                        </span>
                    </div>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={() => navigate('/prayer-dashboard')}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#D9B83F] px-6 py-3.5 text-center font-bold text-white shadow-lg shadow-blue-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#B99722] hover:shadow-xl sm:w-auto"
                        >
                            <HandHeart size={19} className="shrink-0" />
                            <span>Pray</span>
                            <ArrowRight size={17} className="shrink-0 transition-transform group-hover:translate-x-1" />
                        </button>

                        <a
                            href="#highlights"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3.5 text-center font-bold text-slate-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#D9B83F] dark:border-slate-700 dark:bg-slate-900/60 dark:text-white sm:w-auto"
                        >
                            Explore the retreat
                        </a>
                    </div>

                </div>

                <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                    <div className="pointer-events-none absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-amber-500/20 via-violet-500/10 to-transparent blur-2xl" />
                    <div className="relative rounded-[2rem] border border-white/80 bg-white/70 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70">
                        
                        {/* Changed wrapper: Removed fixed aspect ratio and added background/centering to fit image completely without crop */}
                        <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 flex items-center justify-center">
                            <img
                                src={HeroImage}
                                alt="Families gathering at the Familia 26 retreat"
                                className="w-full h-auto object-contain transition duration-700 hover:scale-[1.03]"
                            />
                        </div>

                        <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 sm:left-8 sm:right-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#D9B83F]">
                                        Theme Scripture
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white sm:text-base">
                                        &quot;Seek first the kingdom of God...&quot;
                                    </p>
                                </div>
                                <span className="hidden rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-[#D9B83F] dark:bg-amber-950/50 dark:text-amber-300 sm:inline-flex">
                                    Matthew 6:33
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
