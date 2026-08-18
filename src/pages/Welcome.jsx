import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Header } from '../components/layout/Header';
import { WelcomePage } from "../components/sections/WelcomePage";
import { Footer } from "../components/sections/Footer";
import { useMouseGlow } from "../hooks/useMouseGlow";

export const Welcome = () => {

    const { isAuthenticated, dbUser, loading } = useAuth();
    const navigate = useNavigate();

    useMouseGlow();

    useEffect(() => {
        if (!loading && isAuthenticated && dbUser) {
            if (['admin', 'owner'].includes(dbUser.role)) {
                navigate('/admin');
            } else {
                navigate('/rp/dashboard');
            }
        }
    }, [isAuthenticated, dbUser, loading, navigate])

    if (loading) return null;

    return(

        <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
            
            {/* Mouse Tracking Glow Background Layer */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-60 dark:opacity-40 transition-opacity duration-500">
                <div
                    className="absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 dark:bg-blue-600/15 blur-[100px]"
                    style={{
                        left: 'var(--mouse-x, 50%)',
                        top: 'var(--mouse-y, 20%)',
                    }}
                />
            </div>

        <div className="relative z-10">
            <Header/>
            <main className="page-container">
                <WelcomePage />
            </main>
            <Footer/>
        </div>

        </div>
    )
}