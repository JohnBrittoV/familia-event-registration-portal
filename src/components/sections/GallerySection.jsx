import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Images } from 'lucide-react';
import Image1 from '../../assets/themes/Image01.jpg';
import Image2 from '../../assets/themes/Photo_2.png';
import Image3 from '../../assets/themes/photo_3.png';

const galleryImages = [
    { src: Image1, 
      title: "Familia'26", 
      label: 'Family Retreat',
      prayer: 'സ്വർഗ്ഗീയപിതാവേ നന്ദിയുള്ള ഹൃദയത്തോടെ എന്റെ കുടുംബത്തെ അങ്ങയുടെ സ്നേഹപരിപാലനയ്ക്കായി പൂർണ്ണമായി സമർപ്പിക്കുന്നു. നിങ്ങൾ ആദ്യം അവിടുത്തെ രാജ്യവും അവിടുത്തെനീതിയും അന്വേഷിക്കുക. അതോടൊപ്പം മറ്റുള്ളവയെല്ലാം നിങ്ങൾക്കു ലഭിക്കും” എന്ന തിരുവചനം ഹൃദയത്തിൽ സ്വീകരിച്ചുകൊണ്ട് അങ്ങയെ അടുത്തറിയാനും, അങ്ങിൽ ആഴപ്പെടാനുമായി Jesus Youth ഫാമിലി സ്ട്രീം ഒരുക്കുന്ന ഫമീലിയ 2026 നെ അങ്ങയുടെ തിരുമുമ്പിൽ സമർപ്പിക്കുന്നു.'
    },

    { src: Image2, 
      title: "Familia'26", 
      label: 'Family Retreat',
      prayer: 'ഓഗസ്റ്റ് 26, 27, 28, 29 തീയതികളിൽ നടക്കുന്ന ഈ കുടുംബ നവീകരണ ധ്യാനം പരിശുദ്ധാത്മ നിറവുള്ളതായി മാറുവാൻ. പങ്കെടുക്കുന്ന കുടുംബങ്ങളെല്ലാം തിരുക്കുടുംബത്തിന്റെ മാതൃക സ്വീകരിച്ചുകൊണ്ട് മുന്നേറാൻ അനുഗ്രഹിക്കണമേ.ധ്യാനത്തിന്റെ എല്ലാ മുന്നൊരുക്കങ്ങളും തടസ്സങ്ങൾ ഇല്ലാതെ നടക്കുന്നതിനായി എല്ലാ ലീഡേഴ്‌സും അങ്ങയുടെ ആത്മാവിനാൽ ശക്തിപ്പടുവാനായി.'
    },

    { src: Image3, 
      title: "Familia'26", 
      label: 'Family Retreat',
      prayer: 'കുടുംബങ്ങളുടെ രാജ്ഞിയായ പരിശുദ്ധ അമ്മേ... ഞങ്ങൾക്കുവേണ്ടി അപേക്ഷിക്കണമേ തിരുക്കുടുംബത്തിൻ്റെ പാലകനായ വിശുദ്ധ യൗസേപ്പിതാവേ... ഞങ്ങൾക്കുവേണ്ടി അപേക്ഷിക്കണമേ.. വിശുദ്ധ ഫ്രാൻസിസ് അസീസി.. ഞങ്ങൾക്കുവേണ്ടി അപേക്ഷിക്കണമേ 1 സ്വർഗ്ഗസ്ഥനായ പിതാവേ 1 നന്മ നിറഞ്ഞ മറിയമേ 1 ത്രിത്വസ്തുതി' 
    },
];

export const GallerySection = () => {
    const [active, setActive] = useState(0);

    const next = () => setActive((current) => (current + 1) % galleryImages.length);
    const previous = () => setActive((current) => (current - 1 + galleryImages.length) % galleryImages.length);

     const currentImage = galleryImages[active];

    return (
        <section
            id="gallery"
            className="relative overflow-hidden py-5 sm:py-10"
        >
            <div className="page-container">

                {/* =====================================================
                    SECTION HEADER
                ====================================================== */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#D9B83F]">
                            See the experience
                        </p>
                        <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                            Media{' '}
                            <span className="text-[#D9B83F]">
                                gallery.
                            </span>
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                            Explore event posters, family moments, and
                            highlights from Familia'26.
                        </p>
                    </div>

                    {/* Desktop navigation */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={previous}
                            aria-label="Previous gallery image"
                            className="
                                flex h-11 w-11 items-center justify-center
                                rounded-full border border-slate-300 bg-white
                                text-slate-700 shadow-sm transition-all duration-200
                                hover:-translate-x-0.5 hover:border-[#D9B83F] hover:text-[#D9B83F]
                                dark:border-slate-700 dark:bg-slate-900 dark:text-white
                            "
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Next gallery image"
                            className="
                                flex h-11 w-11 items-center justify-center
                                rounded-full border border-slate-300 bg-white
                                text-slate-700 shadow-sm transition-all duration-200
                                hover:translate-x-0.5 hover:border-[#D9B83F] hover:text-[#D9B83F]
                                dark:border-slate-700 dark:bg-slate-900 dark:text-white
                            "
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    GALLERY
                ====================================================== */}
                <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">

                    {/* =================================================
                        MAIN IMAGE SECTION
                    ================================================== */}
                    <div
                        className=" group
                            overflow-hidden
                            rounded-4xl
                            border border-slate-300
                            bg-slate-950
                            shadow-2xl
                            dark:border-slate-700
                        "
                    >
                        {/* Image area */}
                        <div className="relative w-full bg-slate-950 sm:aspect-video">
                            <img
                                key={currentImage.src}
                                src={currentImage.src}
                                alt={currentImage.title}
                                className="relative block h-auto w-full object-contain transition-opacity
                                           duration-300 sm:absolute sm:inset-0 sm:h-full sm:w-full"
                            />

                            {/* Image counter */}
                            <div
                                className="
                                    absolute left-4 top-4
                                    rounded-full border border-white/20
                                    bg-black/40 px-3 py-1.5
                                    text-xs font-semibold text-white
                                    backdrop-blur-md
                                "
                            >
                                {active + 1} / {galleryImages.length}
                            </div>

                            {/* Expand button */}
                            <button
                                type="button"
                                aria-label="Preview image"
                                className="
                                    absolute right-4 top-4
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-full bg-black/45
                                    text-white backdrop-blur-md
                                    transition-all duration-200
                                    hover:scale-105 hover:bg-black/65
                                "
                            >
                                <Expand size={18} />
                            </button>

                            {/* Main navigation buttons */}
                            <button
                                type="button"
                                onClick={previous}
                                aria-label="Previous image"
                                className="
                                    absolute left-3 top-1/2
                                    flex h-10 w-10 -translate-y-1/2
                                    items-center justify-center
                                    rounded-full bg-black/40 text-white
                                    opacity-0 backdrop-blur-md transition-all duration-200
                                    hover:bg-black/60 group-hover:opacity-100
                                "
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next image"
                                className="
                                    absolute right-3 top-1/2
                                    flex h-10 w-10 -translate-y-1/2
                                    items-center justify-center
                                    rounded-full bg-black/40 text-white
                                    opacity-0 backdrop-blur-md transition-all duration-200
                                    hover:bg-black/60
                                "
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* =================================================
                            IMAGE CAPTION & PRAYER
                        ================================================== */}
                        <div
                            className="
                                border-t border-white/10
                                bg-slate-950
                                px-6 py-6
                                sm:px-8 sm:py-7
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-[#D9B83F]
                                "
                            >
                                {currentImage.label}
                            </p>

                            <h3
                                className="
                                    mt-2
                                    text-2xl
                                    font-black
                                    tracking-tight
                                    text-white
                                    sm:text-3xl
                                "
                            >
                                {currentImage.title}
                            </h3>

                            {/* Added Malayalam Prayer Text with max-height scroll for clean alignment */}
                            {currentImage.prayer && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="mb-3 font-malayalam text-sm font-bold tracking-wider text-[#D9B83F]/80">
                                        ധ്യാനം ഒരുക്ക പ്രാർത്ഥന
                                    </p>
                                    <p 
                                        className="font-malayalam text-[15px] leading-8 text-slate-300 sm:text-base sm:leading-relaxed"
                                    >
                                        {currentImage.prayer}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* =================================================
                        THUMBNAILS
                    ================================================== */}
                    <div
                        className="
                            flex gap-3 overflow-x-auto pb-2
                            lg:flex-col lg:overflow-visible lg:pb-0
                        "
                    >
                        {galleryImages.map((item, index) => {
                            const isActive = active === index;

                            return (
                                <button
                                    key={`${item.title}-${index}`}
                                    type="button"
                                    onClick={() => setActive(index)}
                                    aria-label={`View ${item.label} ${index + 1}`}
                                    className={`
                                        group relative shrink-0 overflow-hidden
                                        rounded-2xl border text-left transition-all duration-300
                                        w-52 sm:w-60 lg:w-full
                                        ${
                                            isActive
                                                ? 'border-[#D9B83F] ring-2 ring-[#D9B83F]/30 shadow-lg'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-[#D9B83F]/60'
                                        }
                                    `}
                                >
                                    <div className="relative aspect-video w-full bg-slate-950">
                                        <img
                                            src={item.src}
                                            alt=""
                                            className="
                                                h-full w-full object-contain
                                                transition-transform duration-500
                                                group-hover:scale-[1.03]
                                            "
                                        />
                                        {isActive && (
                                            <div className="absolute inset-0 bg-[#D9B83F]/5" />
                                        )}
                                    </div>

                                    <div className="bg-slate-900 px-4 py-3 dark:bg-slate-950">
                                        <p className="text-sm font-bold text-white">
                                            {item.label}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {item.title}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* =====================================================
                    MOBILE NAVIGATION
                ====================================================== */}
                <div className="mt-5 flex items-center justify-center gap-3 lg:hidden">
                    <button
                        type="button"
                        onClick={previous}
                        className="
                            flex h-10 w-10 items-center justify-center rounded-full
                            border border-slate-300 bg-white text-slate-700
                            dark:border-slate-700 dark:bg-slate-900 dark:text-white
                        "
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1.5">
                        {galleryImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActive(index)}
                                aria-label={`Go to image ${index + 1}`}
                                className={`
                                    h-2 rounded-full transition-all duration-300
                                    ${active === index ? 'w-6 bg-[#D9B83F]' : 'w-2 bg-slate-300 dark:bg-slate-700'}
                                `}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={next}
                        className="
                            flex h-10 w-10 items-center justify-center rounded-full
                            border border-slate-300 bg-white text-slate-700
                            dark:border-slate-700 dark:bg-slate-900 dark:text-white
                        "
                        aria-label="Next image"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* =====================================================
                    FOOTNOTE
                ====================================================== */}
                <div
                    className="
                        mt-6 flex items-center justify-center gap-2
                        text-center text-xs text-slate-500 dark:text-slate-400
                    "
                >
                    <Images size={15} />
                    <span>
                        Explore Familia'26 moments and highlights.
                    </span>
                </div>

            </div>
        </section>
    );
};


