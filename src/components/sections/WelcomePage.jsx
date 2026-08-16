import React from 'react';
import { useMouseGlow } from '../../hooks/useMouseGlow';
import { WelcomeHero } from './WelcomeHero';
import { EventStory } from './EventStory';
import { HighlightsSection } from './HighlightsSection';
import { GallerySection } from './GallerySection';
import { PrayerSection } from './PrayerSection';
import { ContactSection } from './ContactSection';

export const WelcomePage = () => {
    useMouseGlow();

    return (
            <div className="relative overflow-hidden">
                <div className="pointer-events-none fixed inset-0 -z-10 opacity-100 transition-opacity duration-500">
                    <div
                        className="absolute h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl"
                        style={{
                            left: 'var(--mouse-x, 50%)',
                            top: 'var(--mouse-y, 20%)',
                        }}
                    />
                </div>
    
                <WelcomeHero />
                <EventStory />
                <GallerySection />
                <HighlightsSection />
                <PrayerSection />
                <ContactSection />
            </div>
        );
}