import React from 'react';
import { HeartHandshake, MessageCircleHeart, Sparkles } from 'lucide-react';

const cardTheme = {
    card: `
        bg-gradient-to-br
            from-violet-50 via-white to-fuchsia-100
            dark:from-slate-800 dark:via-slate-800 dark:to-violet-950/70
    `,
    icon: `
        bg-violet-100 text-violet-600
            dark:bg-violet-500/15 dark:text-violet-400
    `,
    glow: "group-hover:shadow-violet-500/20",
};


const points = [
    {
        icon: HeartHandshake,
        title: 'Reconnect as a family',
        text: 'Create space for honest conversations, shared moments, and stronger family bonds.',
    },
    {
        icon: MessageCircleHeart,
        title: 'Grow in faith',
        text: 'Discover practical ways to bring prayer, Christian values, and faith into everyday life.',
    },
    {
        icon: Sparkles,
        title: 'Make lasting memories',
        text: 'Enjoy joyful activities and meaningful experiences that your family can carry home.',
    },
];

export const EventStory = () => (
    <section id="about" className="py-10 sm:py-20">
        <div className="page-container grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            
            <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-amber-500/10 blur-2xl" />
                <div className={`relative rounded-[2rem] border border-slate-200/80 ${cardTheme.card} p-8 shadow-2xl dark:border-slate-700/80 sm:p-10`}>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D9B83F]">
                        Abide in Christ
                    </p>
                    <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                        Family time can become faith time.
                    </h2>
                    <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">
                        Familia&apos;26 is designed as a space where families can slow down,
                        listen, pray, celebrate, and grow together.
                    </p>
                </div>
            </div>

            {/* About Retreat Content & Small Feature Cards */}
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D9B83F]">
                    About the retreat
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                    A retreat built around <span className="text-[#D9B83F]">connection.</span>
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                    Familia&apos;26 brings together prayer, fellowship, family sessions,
                    spiritual sharing, and joyful activities in one welcoming experience.
                </p>

                <div className="mt-9 grid gap-4 sm:grid-cols-3">
                    {points.map(({ icon: Icon, title, text }) => (
                        <article
                            key={title}
                            className={`group relative rounded-2xl border border-slate-200/80 ${cardTheme.card} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cardTheme.glow} dark:border-slate-700/80`}
                        >
                            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${cardTheme.icon}`}>
                                <Icon size={21} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {text}
                            </p>
                        </article>
                    ))}
                </div>
            </div>

        </div>
    </section>
);
