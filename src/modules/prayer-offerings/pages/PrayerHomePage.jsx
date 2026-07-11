import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BaseHeader } from '../../../components/layout/BaseHeader';

export const PrayerHomePage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await login('prayer_partner'); // Pass the new role!
            navigate('/prayer-dashboard');
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <BaseHeader hideUserProfile={true} /> {/* Reused component */}
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h1 className="text-5xl font-bold text-slate-800 dark:text-white mb-6">Offer a Prayer for Familia'26</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">Choose a prayer, pick a date, or offer an instant prayer to support our community.</p>
                <button onClick={() => setShowLoginModal(true)} className="px-8 py-4 bg-[#3B6AB0] text-white text-lg rounded-full shadow-lg hover:shadow-xl">Start Praying</button>
            </div>
            
            {/* Inline Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
                        <h2 className="text-2xl font-bold mb-2">One person. One prayer.</h2>
                        <p className="text-slate-500 mb-6">Sign in so we remember your prayers.</p>

                        <button onClick={handleGoogleLogin} 
                                className="w-full py-3 px-4 rounded-full flex items-center justify-center gap-3
                                        bg-slate-50 dark:bg-slate-800
                                        border border-slate-300 dark:border-slate-600
                                        text-slate-800 dark:text-white
                                        hover:bg-slate-200 dark:hover:bg-slate-700
                                        transition-colors duration-200 ease-in-out font-medium shadow-sm hover:shadow"
                            >
                                {/* Google SVG Icon */}
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3344C44.6993 38.2027 47.532 31.7928 47.532 24.5528Z" fill="#4285F4"/>
                                    <path d="M24.48 48.0016C31.3178 48.0016 37.0972 45.8248 41.3383 42.1729L32.6489 36.174C30.5826 37.5772 27.9421 38.4695 24.48 38.4695C18.1387 38.4695 12.8034 34.2188 10.9833 28.5044H3.12891V34.6176C7.37664 43.1171 15.1204 48.0016 24.48 48.0016Z" fill="#34A853"/>
                                    <path d="M10.9833 28.5044C9.79087 25.1462 9.79087 21.389 10.9833 18.0308V11.9175H3.12891C-0.0423109 18.2456 -0.0423109 26.2896 3.12891 32.6177L10.9833 28.5044Z" fill="#FBBC04"/>
                                    <path d="M24.48 9.49841C28.1955 9.49841 31.5427 10.7692 34.1636 13.299L41.2632 6.19864C37.3835 2.55646 32.0973 0.0498047 24.48 0.0498047C15.1204 0.0498047 7.37664 4.93439 3.12891 13.425L10.9833 19.5382C12.8034 13.8238 18.1387 9.49841 24.48 9.49841Z" fill="#EA4335"/>
                                </svg>

                                <span>Continue with Google</span>
                            </button>

                    </div>
                </div>
            )}
        </div>
    );
};