import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { FeatureCard } from '../ui/FeatureCard';
import  HeroImage from '../../assets/images/Hero_img1.png';

export const HeroSection = () => {
    
    const [isRegistering, setIsRegistering] = useState(false);
    
    const handleGetStarted = () => {
        setIsRegistering(true);
        setTimeout(() => setIsRegistering(false), 2000);
    }

    const features = [
        { icon: '🎸', text: 'Praise & Worship' },
        { icon: '🙏', text: 'Adoration' },
        { icon: '👦', text: 'Children\'s Session' },
        { icon: '👨‍👩‍👧', text: 'Family Sessions' },
        { icon: '💬', text: 'Spiritual Sharing' },
        { icon: '🤝', text: 'Fellowship'}
    ];

    return (
        <div className='section-wrapper'>

            {/* Left section */}
            <div className='flex flex-col gap-6 sm:gap-8'>

                {/* Date & Location */}
                <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
                    
                    <div className="flex items-center gap-1.5 text-sm 
                                    sm:text-base text-slate-600 
                                    dark:text-slate-400">
                        <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
                        <span>August 26 - 29</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-sm sm:text-base 
                                    text-slate-600 dark:text-slate-400">
                        <MapPin size={16} className="text-amber-600 dark:text-amber-400" />
                        <span>Pastoral Center Dwarka</span>
                    </div>

                </div>

                {/* Heading */}

                <h1 className="text-heading">Abide in Christ, <br />
                    <span className="text-blue-700 
                                     dark:text-blue-500">Renew Our Soul.</span>
                </h1>

                {/* Theme Scripture */}

                <div className="bg-slate-50 dark:bg-slate-800/50 
                                  rounded-2xl p-5 sm:p-6 border 
                                  border-slate-200 dark:border-slate-700">

                    <p className="text-xs sm:text-sm font-semibold 
                                  uppercase tracking-wider text-amber-600 
                                  dark:text-amber-400 mb-2">Theme Scripture</p>

                    <p className="text-base sm:text-lg 
                                  font-medium text-slate-800 
                                  dark:text-slate-200 leading-relaxed">
                                "But seek first the kingdom of God and his righteousness..."
                    </p>

                    <p className="text-sm sm:text-base text-slate-600 
                                dark:text-slate-400 mt-1">— Matthew 6:33
                    </p>

                </div>

                {/* Features Grid */}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">

                    {features.map((feat, index) => (
                        <FeatureCard key={index} icon={feat.icon} text={feat.text} />
                    ))}
                    
                </div>

                {/* CTA Button */}

                <div className="w-full sm:w-auto">
                    <Button 
                        variant="primary" 
                        icon={ArrowRight} 
                        isLoading={isRegistering}
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </Button>
                </div>

            </div>

            {/* Right section */}
            <div className='relative'>
                <img 
                    src={`${HeroImage}`} 
                    alt="Families gathering at church" 
                    className="w-full h-auto rounded-2xl 
                               shadow-xl object-cover aspect-[4/3] 
                               sm:aspect-[16/10] lg:aspect-[4/3]"
                />

                {/* Overlay Card */}

                <div className="absolute -bottom-4 -right-4 
                                sm:-bottom-6 sm:-right-6 
                                lg:-bottom-8 lg:-right-8 
                                bg-white dark:bg-slate-800 
                                rounded-xl shadow-lg p-4 sm:p-5 
                                lg:p-6 max-w-[200px] sm:max-w-[240px] 
                                lg:max-w-[280px] border 
                                border-slate-200 
                                dark:border-slate-700">

                    <p className="text-xs sm:text-sm font-semibold 
                                  uppercase tracking-wider 
                                  text-amber-600 dark:text-amber-400">
                            Annual Family Conference
                    </p>

                    <p className="text-sm sm:text-base lg:text-lg 
                                  font-bold text-slate-900 
                                  dark:text-white mt-1 leading-tight">
                            Renewing Hearts, Restoring Families
                    </p>

                </div>

            </div>

        </div>
    );
};
