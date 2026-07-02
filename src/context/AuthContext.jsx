import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginWithGoogleService, logoutUserService, subscribeToAuthService } from '../services/AuthService';
import { Spinner } from '../components/ui/Spinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const unsubscribe = subscribeToAuthService((firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                });
            } 
            else {
                setUser(null);
            }
                setLoading(false);
        });
        
        return () => unsubscribe();
       
    }, []);

    const login = async () => {
        setLoading(true);
        try {
            return await loginWithGoogleService();
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutUserService();
            setUser(null);
        } catch (error) {
            throw error;
        }
        finally {
            setLoading(false);
        }
    };

    const contextValue = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return(
        <AuthContext.Provider value={contextValue}>
            {loading ? (
                <div className='fixed inset-0 flex items-center justify-center bg-slate-50 transition-colors'>
                    <Spinner size='lg'/>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth hook must be used within an explicit AuthProvider wrapper structural unit");
    }
    return context;
}