import React from 'react';
import { ArrowUpRight, HandHeart, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrayerSection = () => {
    const navigate = useNavigate();

    return (
        <section id="prayer" className="py-5 sm:py-10">
            <div className="page-container">
                <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white shadow-2xl sm:px-10 lg:px-16 lg:py-14">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

                    <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-200">
                                <ShieldCheck size={14} />
                                Prayer space
                            </div>
                            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                                Let&apos;s pray for Familia&apos;26.
                            </h2>
                            <p className="mt-4 leading-7 text-slate-300">
                                Continue using your existing prayer dashboard and login flow.
                                This redesign only changes the presentation around it.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/prayer-dashboard')}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-50"
                        >
                            <HandHeart size={19} />
                            Open Prayer Dashboard
                            <ArrowUpRight size={17} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
