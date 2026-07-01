import { auth, googleProvider } from '../config/firebase.config';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

// Login user
export const loginWithGoogleService = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Firebase Service: Error during Google Sign-In:", error);
        throw error;
    }
};

// Logout user
export const logoutUserService = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Firebase Service: Error during Sign out:", error);
        throw error;
    }
};

// onAuthStateChange Listener
export const subscribeToAuthService = (callback) => {
    return onAuthStateChanged(auth, callback);
};