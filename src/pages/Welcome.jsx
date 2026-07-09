import React from "react";
import { Header } from '../components/layout/Header';
import { HeroSection } from "../components/sections/HeroSection";
import { Footer } from "../components/sections/Footer";

export const Welcome = () => {
    return(

        <div className="min-h-screen bg-white dark:bg-slate-900 
                        transition-colors duration-300">
            <Header/>
            <main className="page-container">
                <HeroSection/>
            </main>
            <Footer/>
        </div>
    )
}