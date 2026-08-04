import React, { useState } from "react";
import { Greeting } from "../components/features/Greeting";
import { Spinner } from '../components/ui/Spinner';
import { HelpHeader } from "../components/features/TechSupport/HelpHeader";
import { VideoTutorials } from "../components/features/TechSupport/VideoTutorials";
import { HelpFAQ } from "../components/features/TechSupport/HelpFAQ";
import { SupportTicketForm } from "../components/features/TechSupport/SupportTicketForm";
import { ContactBanner } from "../components/features/TechSupport/ContactBaner";

export const RPTechSupport = () => {
    const [language, setLanguage] = useState('en'); // 'en' or 'ml' (Malayalam)

    return (
        <div className={`max-w-4xl mx-auto space-y-8 pb-24 animate-in fade-in duration-300 ${language === 'ml' ? 'font-malayalam' : ''}`}>
            
            {/* Header & Language Switcher */}
            <HelpHeader language={language} setLanguage={setLanguage} />

            {/* Direct Contact Banner */}
            <ContactBanner language={language} />

            {/* Video Tutorials Section */}
            <VideoTutorials language={language} />

            {/* Frequently Asked Questions Section */}
            <HelpFAQ language={language} />

            {/* Submit Support Ticket Section */}
            <SupportTicketForm language={language} />

        </div>
    );
};
