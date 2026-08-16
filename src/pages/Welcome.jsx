import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Header } from '../components/layout/Header';
import { WelcomePage } from "../components/sections/WelcomePage";
import { Footer } from "../components/sections/Footer";

export const Welcome = () => {

    const { isAuthenticated, dbUser, loading } = useAuth();
    const navigate = useNavigate();

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

        <div className="min-h-screen bg-white dark:bg-slate-900 
                        transition-colors duration-300">
            <Header/>
            <main className="page-container">
                <WelcomePage />
            </main>
            <Footer/>
        </div>
    )
}