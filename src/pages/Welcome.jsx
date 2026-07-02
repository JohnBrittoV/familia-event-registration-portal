import React from "react";
import { Header } from '../components/layouts/Header';
import { HeroSection } from "../components/sections/HeroSection";

export const Welcome = () => {
    return(

        <div className="min-h-screen bg-white dark:bg-slate-900 
                        transition-colors duration-300">
            <Header/>
            <main className="page-container">
                <HeroSection/>
            </main>
        </div>
    )
}