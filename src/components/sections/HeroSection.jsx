import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { FeatureCard } from '../ui/FeatureCard';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import  HeroImage from '../../assets/images/Hero_img1.png';
import { Calendar, MapPin, ArrowRight, HandHeart,
         Music, Heart, Baby, Users, MessageCircle, HandshakeIcon
    } from 'lucide-react';

export const HeroSection = () => {
    
    const { login } = useAuth();
    const navigate = useNavigate();

    // const handleGetStarted = async () => {
    //     setIsRegistering(true);

    //     try {
    //         await login();
    //         navigate('/dashboard');
    //     } catch (error) {
    //         console.error('User cancelled the login or an error occurred:', error);
    //     }
    //     finally {
    //         setIsRegistering(false);
    //     }
    // }

    const features = [
        { icon: Heart, text: 'Prayer & Adoration' },
        { icon: Music , text: 'Praise & Worship' },
        { icon: Baby, text: 'Children\'s Corner' },
        { icon: Users, text: 'Family Sessions' },
        { icon: MessageCircle, text: 'Spiritual Sharing' },
        { icon: HandshakeIcon, text: 'Together in Faith'}
    ];

    return (
        <>
                <div className='flex flex-col items-center 
                            max-w-3xl mx-auto py-3 sm:py-3 
                            lg:py-10 px-4 sm:px-6'>

                {/* Heading */}

                <h1 className="w-full text-4xl sm:text-5xl lg:text-6xl 
                               font-extrabold leading-[1.15] tracking-tight 
                               text-center sm:text-left">

                    <span className="text-slate-800 dark:text-white">Familia'26 <br /></span>
                    <span className="text-[#3B6AB0] dark:text-blue-400">Family Retreat.</span>
                </h1>

                {/* Date & Location */}
                <div className='w-full flex flex-wrap justify-center 
                                sm:justify-start items-center gap-4 
                                mt-4 sm:mt-6"'>
                    
                    <div className="flex items-center gap-2 text-sm 
                                    sm:text-base text-[#3B6AB0] 
                                    dark:text-blue-400 font-medium">

                        <Calendar size={16} className="shrink-0" />
                        <span>August 26 - 29</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm 
                                    sm:text-base text-[#3B6AB0] 
                                    dark:text-blue-400 font-medium">

                        <MapPin size={16} className="shrink-0"/>
                        <span>Pastoral Center Dwarka</span>
                    </div>

                </div>

                 {/* 3. Image with White Frame */}
                <div className="w-full max-w-[280px] sm:max-w-sm 
                                md:max-w-md lg:max-w-lg xl:max-w-xl 
                                mt-8 mb-4 relative">

                    <div className="bg-white dark:bg-slate-800 
                                    rounded-2xl border-4 border-white 
                                    dark:border-slate-800 shadow-xl 
                                    p-1 sm:p-0 overflow-hidden">
                        <img 
                            src={HeroImage} 
                            alt="Families gathering at church" 
                            className="w-full h-auto rounded-xl 
                                       object-cover aspect-[4/3] 
                                       transition-transform 
                                       duration-300 hover:scale-105"
                        />
                    </div>
                </div>

                {/* 4. Let's Pray for Familia Button */}
                <button 
                    className="w-full sm:w-auto inline-flex 
                               items-center justify-center 
                               gap-2 px-6 py-2.5 sm:px-8 sm:py-3 
                               rounded-full border-2 border-[#3B6AB0] 
                               dark:border-blue-400 text-[#3B6AB0] 
                               dark:text-blue-400 font-semibold 
                               hover:bg-[#3B6AB0] hover:text-white 
                               dark:hover:bg-blue-400 dark:hover:text-slate-900 
                               transition-colors duration-200"
                               
                    onClick={() => { /* Add your prayer sign-up logic or modal here */ }}
                >
                    <HandHeart size={18} />
                    <span>Pray for Familia'26</span>
                </button>


                {/* 5. Theme Scripture */}

                <div className="w-full bg-[#F4F7FB] 
                                dark:bg-slate-800/80 border 
                                border-slate-200 dark:border-slate-700 
                                rounded-2xl p-5 sm:p-6 mt-8">

                    <p className="text-xs font-bold uppercase 
                                  tracking-widest text-[#3B6AB0] 
                                  dark:text-blue-400 mb-2">
                        Theme Scripture
                    </p>
                    <p className="text-base sm:text-lg font-medium 
                                  text-slate-800 dark:text-slate-200 
                                  leading-relaxed italic">

                        "But seek first the kingdom of God and his righteousness, and all these things will be added to you."
                    </p>
                    <p className="text-sm text-slate-500 
                                dark:text-slate-400 mt-2">— Matthew 6:33</p>
                </div>

                {/* Features Grid */}

                <div className="w-full grid grid-cols-2 
                                sm:grid-cols-3 gap-3 sm:gap-4 
                                mt-6 sm:mt-8">

                    {features.map((feat, index) => (
                        <FeatureCard key={index} icon={feat.icon} text={feat.text} />
                    ))}
                    
                </div>

                {/* CTA Button

                <div className="w-full sm:w-auto mt-2">

                    <Button 
                        className='"w-full sm:w-auto bg-[#3B6AB0] hover:bg-[#2E5591] text-white 
                                   rounded-full px-8 py-3 sm:py-3.5 font-bold shadow-md 
                                   hover:shadow-lg transition-all duration-200 flex items-center 
                                   justify-center gap-2'

                        variant="primary" 
                        icon={ArrowRight} 
                        isLoading={isRegistering}
                        onClick={handleGetStarted}
                    >
                        Let's Pray for Familia26
                    </Button>
                </div> */}

            </div>

        </>
    );
};
