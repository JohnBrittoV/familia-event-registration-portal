import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';

const COLLECTION_NAME = 'prayerOfferings';
const STORAGE_KEY = 'familia_prayer_user';

export const prayerAuthService = {

    checkUserExists: async (mobileNumber) => {
        try {
            const userRef = doc(db, COLLECTION_NAME, mobileNumber);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return data;

            }
            return null;
        } catch (error) {
            console.error('Error checking user existence:', error);
            throw new Error('Failed to verify mobile number. Please try again');
        }
    },

    registerPrayerUser: async (userData) => {
        try {
            const { mobile, name, place} = userData;
            const userRef = doc(db, COLLECTION_NAME, mobile);

            const newProfile = {
                mobile,
                name,
                place,
                totalHailMarys:0,
                createdAt: serverTimestamp(),
                lastActive: serverTimestamp()
            };

            await setDoc(userRef, newProfile, {merge: true});
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
            return newProfile;
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Failed to create profile. Please try again');
        }
    },

    updateLastActive: async (mobileNumber) => {
        try {
            const userRef = doc(db, COLLECTION_NAME, mobileNumber);
            await setDoc(userRef, {lastActive: serverTimestamp()}, {merge:true})
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    },

    // Helper to check if a session already exists locally on app load
    getLocalUser: () => {
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('Error reading local user session:', error);
            return null;
        }
    },

    // Helper for handling logouts
    clearLocalUser: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};