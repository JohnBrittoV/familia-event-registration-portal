import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { loginWithGoogleService, 
         logoutUserService, 
         subscribeToAuthService, 
         subscribeToUserProfile,
        } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const pendingRoleRef = useRef('responsible_person')

    useEffect(() => {
        
        let profileUnsubscribe = null;

        const authUnsubscribe = subscribeToAuthService(async (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                });

                profileUnsubscribe = await subscribeToUserProfile(firebaseUser, (databaseProfile) => {
                    setDbUser(databaseProfile);
                    setLoading(false);
                },
                    pendingRoleRef.current
                );
            } 
            else {
                setUser(null);
                setDbUser(null);
                if (profileUnsubscribe) profileUnsubscribe();
                setLoading(false);
            }
                
        });
        
        return () => {
            authUnsubscribe();
            if (profileUnsubscribe) profileUnsubscribe();
        };       
    }, []);

    const login = async (roleType = 'responsible_person') => {
        setLoading(true);
        pendingRoleRef.current = roleType;
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
            pendingRoleRef.current = 'responsible_person';
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