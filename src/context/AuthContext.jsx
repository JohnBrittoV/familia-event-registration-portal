import React, { createContext, useContext, useEffect, useState } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { loginWithGoogleService, 
         logoutUserService, 
         subscribeToAuthService, 
         checkAndCreateUserDocument} from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const unsubscribe = subscribeToAuthService(async (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                });

                try {
                    const databaseProfile = await checkAndCreateUserDocument(firebaseUser);
                    setDbUser(databaseProfile);
                } catch (error) {
                    console.error("Failed to fetch user permissions", error);
                }
            } 
            else {
                setUser(null);
                setDbUser(null);
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
        dbUser,
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