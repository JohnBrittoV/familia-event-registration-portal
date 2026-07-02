import { auth, db, googleProvider } from '../config/firebase.config';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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

// Check user exist
export const checkAndCreateUserDocument = async (user) => {
    if(!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newUserProfile = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'responsible_person',
            isApproved: false,
            createdAt: serverTimestamp(),
        };

        try {
            await setDoc(userRef, newUserProfile);
            return newUserProfile;
        } catch (error) {
            console.error('Error creating user document:', error);
            throw error;
        }
    }

    return userSnap.data();

}