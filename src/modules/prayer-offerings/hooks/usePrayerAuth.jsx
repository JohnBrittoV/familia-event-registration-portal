import { useState, useEffect } from "react";
import { prayerAuthService } from "../services/prayerAuthService";

const STORAGE_KEY = 'prayer_user_mobile';

export const usePrayerAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [authStep, setAuthStep] = useState(1);
    const [tempMobile, setTempMobile] = useState('');

    useEffect(() => {
        const checkLocalSession = async () => {
            const savedMobile = localStorage.getItem('prayer_user_mobile');
            if (savedMobile) {
                try {
                    const userData = await prayerAuthService.checkUserExists(savedMobile);
                    if (userData) {
                        setCurrentUser(userData);
                        await prayerAuthService.updateLastActive(savedMobile);
                    }
                    else {
                        localStorage.removeItem(STORAGE_KEY);
                    }
                } catch (error) {
                    console.error('Session restore failed', error)
                }
            }
            setIsLoading(false);
        }

        checkLocalSession();
    }, []);

    // Handle submit start parying button
    const handleMobileSubmit = async (mobileNumber) => {
        
        setIsLoading(true);
        setError(null);

        try {
            const existingUser = await prayerAuthService.checkUserExists(mobileNumber);

            if (existingUser) {
                localStorage.setItem(STORAGE_KEY, mobileNumber);
                await prayerAuthService.updateLastActive(mobileNumber);
                setCurrentUser(existingUser)
            }
            else {
                setTempMobile(mobileNumber);
                setAuthStep(2);
            }
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // Handle profile creation
    const handleProfileSubmit = async (profileData) => {
        setIsLoading(true);
        setError(null);

        try {
            const fullUserData = {...profileData, mobile: tempMobile};
            const newUser = await prayerAuthService.registerPrayerUser(fullUserData);

            localStorage.setItem(STORAGE_KEY, tempMobile);
            setCurrentUser(newUser);
        } catch (error) {
            setError(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    // Handle logout
    const logout = () => {
        localStorage.removeItem('prayer_user_mobile');
        setCurrentUser(null);
        setAuthStep(1);
        setTempMobile('');
    }

    return {
        currentUser,
        isLoading,
        error,
        authStep,
        tempMobile,
        handleMobileSubmit,
        handleProfileSubmit,
        logout,
        setAuthStep
    };
};