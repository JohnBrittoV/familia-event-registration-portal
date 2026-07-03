import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { LogOut, ShieldAlert } from "lucide-react";

export const PendingAccess = () => {

    const { user, logout, dbUser, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        
        if (loading) return;

        // If a random person types /pending without logging in, kick them out
        if (!isAuthenticated) {
            navigate('/', {replace: true});
            return;
        }

        // The Instant Redirect! If Admin approves them, move them to dashboard
        if (dbUser?.isApproved === true || dbUser?.role === 'admin') {
            navigate('/dashboard', {replace: true});
        }

    }, [isAuthenticated, dbUser, loading, navigate]);

    if (loading) return null;

    return(
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 
                        flex flex-col items-center justify-center p-6">

            <div className="max-w-md w-full bg-white dark:bg-slate-800 
                            rounded-3xl shadow-xl border border-slate-100 
                            dark:border-slate-700 p-8 text-center">

                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 
                                text-amber-600 dark:text-amber-500 rounded-full 
                                flex items-center justify-center mx-auto mb-6">

                    <ShieldAlert size={32} />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 
                               dark:text-white mb-2">
                    Access Pending
                </h1>

                <p className="text-slate-600 
                                dark:text-slate-400 mb-6">
                                    
                    Hello
                    <span className="font-semibold">{user?.displayName}</span>
                    , your account has been created successfully. However, you need 
                    administrator approval to access the registration portal.
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 
                                rounded-xl p-4 mb-8 text-sm 
                                text-slate-500 dark:text-slate-400">

                    Please contact the system administrator to verify your identity and grant access permissions.
                </div>

                <Button variant="secondary" onClick={logout} className="w-full">
                    <LogOut size={18} /> Sign Out for Now
                </Button>

            </div>
        </div>
    )
}