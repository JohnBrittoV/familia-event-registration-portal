import React from 'react';
import { ArrowRight, CalendarCheck2, PhoneCall, MapPin } from 'lucide-react';

const bookingNumbers = [
    { display: '+91 94475 25545', value: '+919447525545' },
    { display: '+91 98477 84324', value: '+919847784324' },
    { display: '+91 98439 95457', value: '+919843995457' },
];

const contactItems = [
    {
        icon: MapPin,
        title: 'Venue',
        value: 'Pastoral Center Dwarka',
        isLink: false,
    },
    {
        icon: CalendarCheck2,
        title: 'Dates',
        value: 'August 26 - 29',
        isLink: false,
    },
    {
        icon: PhoneCall,
        title: 'For Retreat Booking & Enquiries',
        value: bookingNumbers,
        isLink: true,
    },
];

export const ContactSection = () => (
    
    <section id="contact" className="pb-24 sm:pb-28">
        <div className="page-container">
            <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 sm:p-10">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D9B83F]">
                            Stay connected
                        </p>
                        <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                            Ready for <span className="text-[#D9B83F]">Familia&apos;26?</span>
                        </h2>
                        <p className="mt-5 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
                            Join us for this grace-filled family retreat. If you have any questions or would like to book your family's spot, please feel free to call our coordinators anytime!
                        </p>
                    </div>

                    <div className="grid gap-3">
                        {contactItems.map(({ icon: Icon, title, value, isLink }) => (
                            <div
                                key={title}
                                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/50"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#D9B83F] dark:bg-amber-950/50 dark:text-amber-300">
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        {title}
                                    </p>
                                    {isLink ? (
                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            {value.map((num, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`tel:${num.value}`}
                                                    className="font-semibold text-[#D9B83F] transition-colors hover:underline"
                                                >
                                                    {num.display}
                                                    {idx < value.length - 1 && <span className="text-slate-400 ml-2">•</span>}
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-1 font-semibold text-slate-800 dark:text-white">
                                            {value}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <a
                    href="#home"
                    className="mt-8 inline-flex items-center gap-2 font-bold text-[#D9B83F] hover:underline"
                >
                    Back to the top
                    <ArrowRight size={16} />
                </a>
            </div>
        </div>
    </section>
);
