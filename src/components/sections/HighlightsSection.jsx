import React from 'react';
import {
    Baby,
    Heart,
    HandHeart,
    Handshake,
    MessageCircle,
    Music2,
} from 'lucide-react';

import AdorationImg from '../../assets/images/Adoration.jpg';
import PraiseImg from '../../assets/images/praise.jpg';
import KidsImg from '../../assets/images/kids2.jpg';
import FamilyImg from '../../assets/images/family2.jpg';
import SharingImg from '../../assets/images/Pray.jpg';
import FaithImg from '../../assets/images/Sharing.jpg'

const cardTheme = {
    card: `
        bg-gradient-to-br
        from-amber-50 via-white to-yellow-100
        dark:from-slate-800 dark:via-slate-800 dark:to-amber-950/70
    `,
    icon: `
        bg-amber-100 text-[#D9B83F]
        dark:bg-amber-500/15 dark:text-amber-300
    `,
    glow: "group-hover:shadow-amber-500/20",
};

const highlights = [
    { 
        icon: Heart, 
        title: 'Prayer & Adoration', 
        text: 'Create space for prayer and a deeper encounter with God.',
        image: AdorationImg
    },
    { 
        icon: Music2, 
        title: 'Praise & Worship', 
        text: 'Lift your hearts together through music and joyful worship.',
        image: PraiseImg
        },
    { 
        icon: Baby, 
        title: "Children's Corner", 
        text: 'A welcoming space for younger family members to participate.',
        image: KidsImg
    },
    { 
        icon: Handshake, 
        title: 'Family Sessions', 
        text: 'Learn, discuss, and grow through practical family-focused sessions.',
        image: FamilyImg 
    },
    { 
        icon: MessageCircle, 
        title: 'Spiritual Sharing', 
        text: 'Share stories, experiences, and encouragement with one another.',
        image: FaithImg
    },
    { 
        icon: HandHeart, 
        title: 'Together in Faith', 
        text: 'Return home with renewed faith and a stronger sense of community.',
        image: SharingImg
    },
];

export const HighlightsSection = () => (
    
   <section id="highlights" className="relative overflow-hidden py-10 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="page-container relative">
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D9B83F]">
                    What to expect
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                    Retreat <span className="text-[#D9B83F]">highlights.</span>
                </h2>
                <p className="mt-5 text-slate-600 dark:text-slate-300">
                    A balanced mix of faith, family, reflection, and joyful moments.
                </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {highlights.map(({ icon: Icon, title, text, image }, index) => (
                    <article
                        key={title}
                        className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 ${cardTheme.card} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardTheme.glow} dark:border-slate-700/80`}
                    >
                        {/* Uniform Image Container */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                            <img
                                src={image}
                                alt={title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
                            
                            {/* Card Number Badge over the image */}
                            <span className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                                0{index + 1}
                            </span>
                        </div>

                        {/* Content Container */}
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${cardTheme.icon}`}>
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {text}
                                </p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    </section>

);
