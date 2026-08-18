import React from 'react';
import { WelcomeHero } from './WelcomeHero';
import { EventStory } from './EventStory';
import { HighlightsSection } from './HighlightsSection';
import { GallerySection } from './GallerySection';
import { PrayerSection } from './PrayerSection';
import { ContactSection } from './ContactSection';

export const WelcomePage = () => {

    return (
            <div className="relative overflow-hidden">    
                <WelcomeHero />
                <EventStory />
                <GallerySection />
                <HighlightsSection />
                <PrayerSection />
                <ContactSection />
            </div>
        );
}